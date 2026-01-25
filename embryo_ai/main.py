import os
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel

app = FastAPI(title="EMprion AI Brain (Sanity Check)")

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

@app.get("/")
async def root():
    return {
        "status": "BAREBONES_ALIVE",
        "port": os.environ.get("PORT"),
        "cwd": os.getcwd(),
        "env": dict(os.environ) # Temporarily peek at env (will remove later for security)
    }

@app.post("/api/predict", response_model=AnalysisResult)
async def predict(file: UploadFile = File(...), analysis_type: str = "gardner"):
    return {
        "stage": "Test Mode",
        "confidence": "100%",
        "commentary": "Barebones sanity check successful",
        "action": "Proceed with deployment",
        "gardner": {"expansion": "4", "icm": "A", "te": "A"},
        "milestones": {},
        "anomalies": [],
        "concordance": {},
        "analysis_type": analysis_type
    }

if __name__ == "__main__":
    print(f"📡 BAREBONES: Binding to 0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, access_log=True)
