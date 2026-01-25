import os
import uvicorn
import asyncio
import asyncio
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
try:
    from service import ai_service
except ImportError:
    ai_service = None

app = FastAPI(title="EMprion AI Brain (Simulation Mode)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResult(BaseModel):
    stage: str
    confidence: str
    commentary: str
    action: str
    gardner: dict
    milestones: dict
    anomalies: List[str]
    concordance: dict
    analysis_type: str

def generate_mock_result(analysis_type: str) -> dict:
    # DETERMINISTIC CLINICAL BENCHMARKS (Non-Random for Compliance)
    if analysis_type == "gardner":
        return {
            "stage": "Blastocyst (SIMULATED)",
            "confidence": "94.20%",
            "commentary": "NOTICE: This is a deterministic reference result used for system verification only. Not for clinical use.",
            "action": "SYSTEM TEST IN PROGRESS",
            "gardner": {
                "expansion": "4",
                "icm": "A",
                "te": "A",
                "cell_count": "120",
                "cavity_symmetry": "95%",
                "fragmentation": "<5%"
            },
            "milestones": {"unavailable": True, "reason": "Choice: Gardner Mode"},
            "anomalies": ["None detected (Safe zone)"],
            "concordance": {"AI_Confidence": 0.94, "Historical_Match": 0.92},
            "analysis_type": "gardner"
        }
    else: # morphokinetics
        return {
            "stage": "Expanded Blastocyst (tEB)",
            "confidence": "91.50%",
            "commentary": "Kinematic alignment matches clinical developmental benchmarks.",
            "action": "Valid for vitrification / transfer",
            "gardner": {"expansion": "4", "icm": "A", "te": "A"},
            "milestones": {
                "t2": "26.5h", "t3": "37.0h", "t5": "48.5h", "t8": "54.0h",
                "tM": "93.0h", "tB": "105.0h", "tEB": "118.0h", "s3": "10.5h"
            },
            "anomalies": ["Synchronous cleavage verified."],
            "concordance": {"AI_Confidence": 0.94, "Literature_Match": 0.91},
            "analysis_type": "morphokinetics"
        }

@app.get("/")
async def root():
    return {
        "status": "online",
        "model": "Subhag Embryon v3",
        "mode": "Simulation (STABLE)",
        "diagnostics": {"port": 8000, "cwd": os.getcwd()}
    }

@app.post("/api/predict", response_model=AnalysisResult)
async def predict(file: UploadFile = File(...), analysis_type: str = "gardner"):
    # Determine if input is video
    content_type = file.content_type or ""
    is_video = content_type.startswith("video/") or file.filename.lower().endswith(('.mp4', '.avi', '.mov'))

    # ENFORCE CLINICAL RULE: No Morphokinetics for Images
    if not is_video and analysis_type == "morphokinetics":
        raise HTTPException(
            status_code=400, 
            detail="Clinical Logic Violation: Morphokinetic analysis requires time-lapse video data. Static images only support Gardner grading."
        )

    # Use AI Service if available
    if ai_service:
        try:
            file_bytes = await file.read()
            if analysis_type == "gardner":
                result = ai_service.predict_gardner(file_bytes)
            else:
                result = ai_service.predict_morphokinetics(file_bytes, file.filename)
            
            if result and "error" in result:
                # MANDATORY CLINICAL REJECTION: Stop immediately.
                raise HTTPException(status_code=400, detail=result["error"])
            
            if result:
                return result
        except HTTPException as he:
            raise he
        except Exception as e:
            print(f"CRITICAL: AI Service Exception: {e}")
            if os.getenv("ALLOW_SIMULATION", "false").lower() != "true":
                raise HTTPException(status_code=500, detail="Clinical Engine Failure. Analysis blocked for safety.")
    
    # Simulation Mode - Heavily Guarded
    if os.getenv("ALLOW_SIMULATION", "false").lower() == "true":
        await asyncio.sleep(0.5)
        return generate_mock_result(analysis_type)
    
    raise HTTPException(
        status_code=500, 
        detail="Clinical Safety Lock: AI Engine (CLIP/Inference) is offline. Simulated data is disabled in this environment."
    )

if __name__ == "__main__":
    # Hardcoded port 8000 was proven to work in ultrasound check
    print(f"📡 SIMULATION STARTING: Binding to 0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, access_log=True)
