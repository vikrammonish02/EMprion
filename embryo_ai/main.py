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
DEBUG_LOGS = []

def log_debug(msg):
    log = f"{asyncio.get_event_loop().time():.2f}: {msg}"
    print(log)
    DEBUG_LOGS.append(log)

def check_models_present():
    """Quick check if required models exist on disk."""
    required = ["gardner_net_best.pth", "modelr3D18_bs16_trlen10_cv3_best_epoch31"]
    for m in required:
        if not os.path.exists(os.path.join(current_dir, m)):
            log_debug(f"🔍 Model check: {m} is MISSING")
            return False
    return True

async def load_ai_service_task():
    global ai_service, SERVICE_ERROR
    log_debug("🧬 [Service Loader] Starting...")
    
    if ALLOW_SIMULATION:
        log_debug("💡 [Service Loader] ALLOW_SIMULATION is TRUE. SKIPPING all heavy loading for stability.")
        ai_service = None
        return

    try:
        log_debug("🧬 [Service Loader] Checking environment for Production...")
        models_available = check_models_present()
        
        if not models_available:
            log_debug("❌ [Service Loader] Models missing. Production mode cannot start.")
            return

        # Give the server a moment to settle and pass health checks
        await asyncio.sleep(5) 
        
        log_debug("🧬 [Service Loader] Importing AI modules (High Memory Phase)...")
        from service import ai_service as loaded_service
        ai_service = loaded_service
        
        if ai_service:
            log_debug("✅ [Service Loader] AI Service loaded successfully")
        else:
            log_debug("⚠️ [Service Loader] AI Service returned None")
    except Exception as e:
        SERVICE_ERROR = str(e)
        log_debug(f"❌ [Service Loader] CRITICAL FAILURE: {e}")
        import traceback
        traceback.print_exc()
        ai_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    log_debug("--- BACKEND LIFECYCLE START ---")
    log_debug(f"🌍 PID: {os.getpid()}")
    log_debug(f"📊 Mode: {'FORCE SIMULATION' if ALLOW_SIMULATION else 'PRODUCTION ONLY'}")
    
    # Start loading task in the background (fire and forget)
    loop = asyncio.get_event_loop()
    loop.create_task(load_ai_service_task())
    
    log_debug("✅ Web Server is UP")
    yield
    # Shutdown logic
    log_debug("--- BACKEND LIFECYCLE END ---")

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
    status = "online" if ALLOW_SIMULATION or ai_service else "initializing"
    mode = "Simulation (FORCE)" if ALLOW_SIMULATION else "Production"
    
    return {
        "status": status, 
        "model": "Subhag Embryon v3", 
        "mode": mode,
        "models_on_disk": models_ok,
        "service_ready": ai_service is not None,
        "service_error": SERVICE_ERROR,
        "last_log": DEBUG_LOGS[-1] if DEBUG_LOGS else None
    }

@app.get("/api/logs")
async def get_logs():
    return {"logs": DEBUG_LOGS}

@app.get("/health")
async def health():
    return {
        "status": "ok", 
        "uptime_pid": os.getpid(),
        "service_ready": ai_service is not None,
        "simulation_enabled": ALLOW_SIMULATION
    }

@app.get("/api/predict_test")
async def predict_test(analysis_type: str = "gardner"):
    """Diagnostic endpoint to test simulation without file upload."""
    return generate_mock_result(analysis_type)

@app.post("/api/predict_json")
async def predict_json(data: dict):
    """Diagnostic endpoint to test POST without multipart."""
    return {"received": data, "mock": generate_mock_result("gardner")}

@app.post("/api/predict", response_model=AnalysisResult)
async def predict(file: UploadFile = File(...), analysis_type: str = "gardner"):
    """
    Unified prediction endpoint with Simulation Fallback.
    """
    # FAILS HERE IF MULTIPART PARSING CRASHES
    
    if ai_service is None:
        if ALLOW_SIMULATION:
            # Return immediately to avoid any heavy parsing issues
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
