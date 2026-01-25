import os
import uvicorn
import asyncio
import random
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel

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
    if analysis_type == "gardner":
        return {
            "stage": "Blastocyst",
            "confidence": f"{random.uniform(0.85, 0.98):.2%}",
            "commentary": "High-quality blastocyst with excellent morphology and clear ICM/TE borders.",
            "action": "Recommended for clinical transfer (Priority 1)",
            "gardner": {
                "expansion": "4",
                "icm": "A",
                "te": "A",
                "cell_count": str(random.randint(120, 150)),
                "cavity_symmetry": f"{random.randint(90, 99)}%",
                "fragmentation": f"<{random.randint(2, 5)}%"
            },
            "milestones": {"unavailable": True, "reason": "Gardner Mode Only"},
            "anomalies": ["No significant anomalies detected."],
            "concordance": {"inter_observer": 0.92, "historical": 0.88},
            "analysis_type": "gardner"
        }
    else: # morphokinetics
        return {
            "stage": "Expanded Blastocyst (tEB)",
            "confidence": f"{random.uniform(0.8, 0.95):.2%}",
            "commentary": "Continuous and synchronous cleavage pattern within optimal clinical windows.",
            "action": "Proceed to biopsy / Cryopreservation",
            "gardner": {"expansion": "--", "icm": "--", "te": "--"},
            "milestones": {
                "t2": "26.5h", "t3": "37.2h", "t5": "48.8h", "t8": "54.1h",
                "tM": "92.5h", "tB": "104.2h", "tEB": "116.8h", "s3": "10.7h"
            },
            "anomalies": ["Direct cleavage (t1->t3) excluded."],
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
    # Unified endpoint for Simulation Mode
    await asyncio.sleep(1.0) # Brief simulation delay
    return generate_mock_result(analysis_type)

if __name__ == "__main__":
    # Hardcoded port 8000 was proven to work in ultrasound check
    print(f"📡 SIMULATION STARTING: Binding to 0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, access_log=True)
