from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import uvicorn
import os

from service import ai_service

app = FastAPI(title="EMprion AI Brain", description="Regulatory Embryo Grading Service")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to React app origin
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
    return {"status": "online", "model": "Subhag Embryon v3"}

@app.post("/api/predict", response_model=AnalysisResult)
async def predict(file: UploadFile = File(...), analysis_type: str = "gardner"):
    """
    Unified prediction endpoint.
    analysis_type: 'gardner' (for images) or 'morphokinetics' (for videos)
    """
    if ai_service is None:
        raise HTTPException(status_code=503, detail="AI Engine not initialized. Check Zenodo folder path.")

    content = await file.read()
    
    try:
        if analysis_type == "gardner":
            result = ai_service.predict_gardner(content)
        elif analysis_type == "morphokinetics":
            result = ai_service.predict_morphokinetics(content, file.filename)
        else:
            raise HTTPException(status_code=400, detail="Invalid analysis_type. Use 'gardner' or 'morphokinetics'.")
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
