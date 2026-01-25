import sys
import os
import uvicorn
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel

# Ensure the current directory is in the path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

# Global service instance (lazy loaded in background)
ai_service = None
ALLOW_SIMULATION = os.environ.get("ALLOW_SIMULATION", "false").lower() == "true"
SERVICE_ERROR = None

def check_models_present():
    """Quick check if required models exist on disk."""
    required = ["gardner_net_best.pth", "modelr3D18_bs16_trlen10_cv3_best_epoch31"]
    for m in required:
        if not os.path.exists(os.path.join(current_dir, m)):
            print(f"🔍 Model check: {m} is MISSING")
            return False
    return True

async def load_ai_service_task():
    global ai_service, SERVICE_ERROR
    try:
        print("🧬 [Service Loader] Checking environment...")
        models_available = check_models_present()
        
        if not models_available and ALLOW_SIMULATION:
            print("💡 [Service Loader] Models missing but Simulation is allowed. SKIPPING heavy load to save memory.")
            ai_service = None
            return

        # Give the server a moment to settle and pass health checks
        await asyncio.sleep(5) 
        
        print("🧬 [Service Loader] Importing AI modules (High Memory Phase)...")
        # Inline import to avoid global memory pressure until needed
        from service import ai_service as loaded_service
        ai_service = loaded_service
        
        if ai_service:
            print("✅ [Service Loader] AI Service loaded successfully")
        else:
            print("⚠️ [Service Loader] AI Service returned None")
    except Exception as e:
        SERVICE_ERROR = str(e)
        print(f"❌ [Service Loader] CRITICAL FAILURE: {e}")
        import traceback
        traceback.print_exc()
        ai_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("--- BACKEND LIFECYCLE START ---")
    print(f"🌍 PID: {os.getpid()}")
    print(f"📊 Mode: {'Simulation Allowed' if ALLOW_SIMULATION else 'Production Only'}")
    
    # TEMPORARILY DISABLED TO PREVENT CRASHES
    # loop = asyncio.get_event_loop()
    # loop.create_task(load_ai_service_task())
    
    print("✅ Web Server is UP (Simulation Only Mode Active)")
    yield
    # Shutdown logic
    print("--- BACKEND LIFECYCLE END ---")

app = FastAPI(
    title="EMprion AI Brain", 
    description="Regulatory Embryo Grading Service",
    lifespan=lifespan
)

# Enable CORS for the React frontend
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
    import random
    
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
                "t2": "26.5h",
                "t3": "37.2h",
                "t5": "48.8h",
                "t8": "54.1h",
                "tM": "92.5h",
                "tB": "104.2h",
                "tEB": "116.8h",
                "s3": "10.7h"
            },
            "anomalies": ["Direct cleavage (t1->t3) excluded."],
            "concordance": {"AI_Confidence": 0.94, "Literature_Match": 0.91},
            "analysis_type": "morphokinetics"
        }

@app.get("/")
async def root():
    models_ok = check_models_present()
    status = "online" if (ai_service or ALLOW_SIMULATION) else "initializing"
    mode = "Simulation (Active)" if (not ai_service and ALLOW_SIMULATION) else "Production"
    
    return {
        "status": status, 
        "model": "Subhag Embryon v3", 
        "mode": mode,
        "models_on_disk": models_ok,
        "service_ready": ai_service is not None,
        "error": SERVICE_ERROR
    }

@app.get("/health")
async def health():
    return {
        "status": "ok", 
        "uptime_pid": os.getpid(),
        "service_ready": ai_service is not None,
        "simulation_enabled": ALLOW_SIMULATION
    }

@app.post("/api/predict", response_model=AnalysisResult)
async def predict(file: UploadFile = File(...), analysis_type: str = "gardner"):
    """
    Unified prediction endpoint with Simulation Fallback.
    """
    if ai_service is None:
        if ALLOW_SIMULATION:
            await asyncio.sleep(1.0) # Brief simulation delay
            return generate_mock_result(analysis_type)
        else:
            raise HTTPException(status_code=503, detail="AI Engine still initializing or unavailable.")

    content = await file.read()
    
    try:
        if analysis_type == "gardner":
            result = ai_service.predict_gardner(content)
        elif analysis_type == "morphokinetics":
            result = ai_service.predict_morphokinetics(content, file.filename)
        else:
            raise HTTPException(status_code=400, detail="Invalid analysis_type.")
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

if __name__ == "__main__":
    # Railway passes the port as an environment variable
    port = int(os.environ.get("PORT", 8000))
    print(f"--- STARTUP CONFIGURATION ---")
    print(f"📡 Interface: 0.0.0.0")
    print(f"🔌 Port: {port}")
    print(f"📁 WORKDIR: {os.getcwd()}")
    print(f"-----------------------------")
    
    # Use the app object directly to avoid import issues
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info", access_log=True)
