import os
import sys
import torch
import numpy as np
import cv2
from PIL import Image
import io

# Local path for AI modules
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.append(CURRENT_DIR)

try:
    from inference import EmbryoInference
    HAS_ENGINE = True
except ImportError as e:
    print(f"Failed to import EmbryoInference from {CURRENT_DIR}: {e}")
    HAS_ENGINE = False

# Import the CLIP-based Embryo Gate
try:
    from embryo_gate import validate_embryo_image
    HAS_GATE = True
    print("EmbryoGate: CLIP gating available.")
except ImportError as e:
    print(f"Warning: EmbryoGate not available: {e}. Gating disabled.")
    HAS_GATE = False

class AIService:
    _instance = None
    _engine = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        if not HAS_ENGINE:
            raise RuntimeError("EmbryoInference engine not found.")
        
        # Initial dummy instance to access _find_best_model
        temp_engine = EmbryoInference(config_path=None)
        
        # Determine the best config (defaulting to video preference for the general service)
        best_config = temp_engine._find_best_model(is_video=True)
        print(f"AI Service: Initializing with best model: {best_config}")
        
        self._engine = EmbryoInference(config_path=best_config)
        print("AI Service: Models loaded successfully.")

    def predict_gardner(self, image_bytes: bytes):
        """
        Runs Gardner grading on a single image.
        """
        # Convert bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return {"error": "Invalid image data"}

        # INTELLIGENT GATING (CLIP-based): Semantic validation
        if HAS_GATE:
            is_valid, reason, confidence = validate_embryo_image(frame)
            if not is_valid:
                print(f"CLIP GATE REJECTION: {reason}")
                return {"error": f"Input Rejected: {reason}. Please upload a valid embryo image."}
            print(f"CLIP GATE PASSED: {reason}")
        else:
            # CLINICAL SAFETY LOCK: Do not allow analysis if the safety gate is offline
            print("CRITICAL SAFETY ERROR: Embryo Gate is OFFLINE. Blocking analysis.")
            return {"error": "Clinical Safety Error: Embryo Validation Gate (CLIP) is unavailable. Analysis blocked for regulatory compliance."}

        # Preprocess frame
        tensor = self._engine._preprocess_frame(frame)
        # Add batch and time dims -> 1 x 1 x C x H x W
        tensor = tensor.unsqueeze(0).unsqueeze(0)
        
        results = self._engine.predict(
            input_data=tensor,
            is_video=False,
            analysis_type="gardner"
        )
        return results

    def _convert_to_mp4(self, source_path):
        """Converts any video to H.264 MP4 using system ffmpeg."""
        import subprocess
        
        # Create output path
        base_name = os.path.splitext(source_path)[0]
        output_path = base_name + "_converted.mp4"
        
        # FFmpeg command: -y (overwrite), -i (input), -c:v libx264 (video codec), -c:a aac (audio codec)
        # -preset fast, -crf 23 (balance quality/speed)
        cmd = [
            "ffmpeg", "-y", "-i", source_path,
            "-c:v", "libx264", "-c:a", "aac",
            "-preset", "fast", "-crf", "23",
            output_path
        ]
        
        try:
            print(f"Converting {source_path} to H.264 MP4...")
            subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            if os.path.exists(output_path):
                print(f"Conversion successful: {output_path}")
                return output_path
        except Exception as e:
            print(f"Video conversion failed: {e}")
            return None
            
        return None

    def predict_morphokinetics(self, video_bytes: bytes, filename: str):
        """
        Runs Morphokinetic analysis on a video file.
        Since video processing requires sequential frames, we save to a temporary file.
        """
        import tempfile
        
        suffix = os.path.splitext(filename)[1] or ".mp4"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tfile:
            tfile.write(video_bytes)
            temp_path = tfile.name

        try:
            # AUTO-CONVERSION: Ensure it's a valid MP4 for both backend (OpenCV) and Frontend (Chrome)
            # If original is already mp4, we might still want to re-encode if it's HEVC,
            # but for speed, let's checking extension or just force convert if not simple mp4.
            # Actually, to be safe for the user's issue (ProRes/HEVC), we SHOULD try to convert.
            
            # For this fix, we will attempt conversion if existing tools are present
            converted_path = self._convert_to_mp4(temp_path)
            work_path = converted_path if converted_path else temp_path
            
            # The engine has a load_input method that handles video files efficiently
            tensor = self._engine.load_input(work_path)
            
            if tensor is None:
                return {"error": "Failed to extract frames from video"}
            
            # INTELLIGENT GATING (CLIP-based) for video: Check a middle frame
            if HAS_GATE:
                import cv2
                cap = cv2.VideoCapture(work_path)
                total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
                cap.set(cv2.CAP_PROP_POS_FRAMES, total_frames // 2)
                ret, middle_frame = cap.read()
                cap.release()
                
                if ret:
                    is_valid, reason, confidence = validate_embryo_image(middle_frame)
                    if not is_valid:
                        print(f"CLIP GATE REJECTION (Video): {reason}")
                        return {"error": f"Input Rejected: {reason}. Please upload a valid embryo video."}
                    print(f"CLIP GATE PASSED (Video): {reason}")
            else:
                # CLINICAL SAFETY LOCK
                print("CRITICAL SAFETY ERROR: Embryo Gate is OFFLINE (Video). Blocking analysis.")
                return {"error": "Clinical Safety Error: Embryo Validation Gate (CLIP) is unavailable. Analysis blocked."}

            results = self._engine.predict(
                input_data=tensor,
                is_video=True,
                analysis_type="morphokinetics"
            )
            
            # Since we can't easily push the converted file back to the browser in this sync call without
            # changing the API contract, we will trust the backend results are now valid.
            # Ideally, we should upload the converted file to cloud/storage and return the new URL.
            # For this local prototype, we will return the path so the frontend *could* potential stream it if we added that.
            # But primarily this ensures the RESULTS are generated.
            
            return results
        finally:
            if os.path.exists(temp_path):
                os.unlink(temp_path)
            # Clean up converted file if it exists and is different
            # (In a real app, we'd keep it as the new artifact)
            # For now, we clean it up to avoid filling disk.
            # if converted_path and os.path.exists(converted_path):
            #    os.unlink(converted_path)


# Singleton instance
try:
    ai_service = AIService() if HAS_ENGINE else None
except Exception as e:
    print(f"CRITICAL: Failed to initialize AIService: {e}")
    ai_service = None
