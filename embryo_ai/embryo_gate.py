"""
Embryo Gate: Smart AI-Powered Content Validation

This module uses CLIP (Contrastive Language-Image Pre-training) to semantically
validate whether an uploaded image is actually a microscope image of a human embryo.

This is a TOLLGATE that runs BEFORE any Gardner/Morphokinetic analysis.
"""

import os
import torch
import numpy as np
from PIL import Image
import io

# Lazy-load the CLIP model to avoid slow startup
_clip_model = None
_clip_processor = None
_clip_tokenizer = None

# Prompts for classification
POSITIVE_PROMPTS = [
    "a microscope image of a human embryo",
    "a blastocyst under microscope",
    "an IVF embryo image",
    "a time-lapse image of embryo development",
    "a day 5 blastocyst"
]

NEGATIVE_PROMPTS = [
    "a photo of an office or room",
    "office chair and desk",
    "meeting room or interior",
    "corporate workspace",
    "a bookshelf or document",
    "a photo of a person",
    "a screen or monitor",
    "a product or household item",
    "a diagram or infographic"
]

def _load_clip():
    """Lazy-load CLIP model on first use."""
    global _clip_model, _clip_processor, _clip_tokenizer
    
    if _clip_model is None:
        print("EmbryoGate: Loading CLIP model (first-time, may take a moment)...")
        try:
            from transformers import CLIPProcessor, CLIPModel
            
            model_id = "openai/clip-vit-base-patch32"
            _clip_model = CLIPModel.from_pretrained(model_id)
            _clip_processor = CLIPProcessor.from_pretrained(model_id)
            _clip_model.eval()
            
            print("EmbryoGate: CLIP model loaded successfully.")
        except Exception as e:
            print(f"EmbryoGate: Failed to load CLIP model: {e}")
            raise RuntimeError(f"CLIP model loading failed: {e}")
    
    return _clip_model, _clip_processor


def validate_embryo_image(image_data) -> tuple[bool, str, float]:
    """
    Validates if the given image is a biological embryo image.
    
    Args:
        image_data: Either a PIL Image, numpy array (BGR), or bytes.
    
    Returns:
        tuple: (is_valid: bool, message: str, confidence: float)
    """
    model, processor = _load_clip()
    
    # Convert input to PIL Image
    if isinstance(image_data, bytes):
        pil_image = Image.open(io.BytesIO(image_data)).convert("RGB")
    elif isinstance(image_data, np.ndarray):
        # Assume BGR (OpenCV format)
        import cv2
        rgb = cv2.cvtColor(image_data, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(rgb)
    elif isinstance(image_data, Image.Image):
        pil_image = image_data.convert("RGB")
    else:
        return False, "Invalid input type", 0.0
    
    # Prepare inputs
    all_prompts = POSITIVE_PROMPTS + NEGATIVE_PROMPTS
    inputs = processor(
        text=all_prompts,
        images=pil_image,
        return_tensors="pt",
        padding=True
    )
    
    # Run inference
    with torch.no_grad():
        outputs = model(**inputs)
        logits_per_image = outputs.logits_per_image  # Shape: [1, num_prompts]
        probs = logits_per_image.softmax(dim=1).squeeze().cpu().numpy()
    
    # Calculate scores
    positive_score = np.sum(probs[:len(POSITIVE_PROMPTS)])
    negative_score = np.sum(probs[len(POSITIVE_PROMPTS):])
    
    # Decision
    is_embryo = positive_score > negative_score
    confidence = max(positive_score, negative_score)
    
    if is_embryo:
        return True, f"Valid Embryo Image (confidence: {positive_score:.1%})", positive_score
    else:
        # Find the most likely negative category
        neg_probs = probs[len(POSITIVE_PROMPTS):]
        max_neg_idx = np.argmax(neg_probs)
        detected_as = NEGATIVE_PROMPTS[max_neg_idx]
        return False, f"Not an Embryo Image. Detected as: {detected_as}", negative_score


def validate_video_frame(frame_bgr: np.ndarray) -> tuple[bool, str, float]:
    """
    Convenience wrapper for video frames (BGR numpy arrays).
    """
    return validate_embryo_image(frame_bgr)


# Quick test
if __name__ == "__main__":
    print("Testing EmbryoGate...")
    # Create a simple test image (random noise)
    test_img = Image.fromarray(np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8))
    is_valid, msg, conf = validate_embryo_image(test_img)
    print(f"Random noise: is_valid={is_valid}, msg={msg}, conf={conf:.2%}")
