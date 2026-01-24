# 🧬 Subhag EMBRION AI Platform

> **AI-Powered Embryo Assessment for IVF Clinics**
> 
> Advanced deep learning platform for automated embryo grading, morphokinetic analysis, and viability scoring.

![License](https://img.shields.io/badge/license-Proprietary-red)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![React](https://img.shields.io/badge/react-19-61dafb)
![Status](https://img.shields.io/badge/status-Research%20%2F%20Pre--Clinical-orange)

---

## 🎯 Features

### AI Analysis Engines
- **Gardner Grading**: Automated blastocyst grading (Expansion/ICM/TE scores)
- **Morphokinetic Analysis**: Time-lapse milestone detection (t2, t3, t5, t8, tM, tB, tEB)
- **CLIP-Based Smart Gating**: Rejects non-embryo images (prevents misuse)

### Clinical Platform
- Patient registration with clinical intake forms
- Cycle management and embryo cohort tracking
- Batch import with parallel AI analysis
- Viability ranking and clinical decision support
- Export-ready assessment reports

---

## 📋 Prerequisites

| Component | Version | Purpose |
|-----------|---------|---------|
| Python | 3.10+ | AI Backend |
| Node.js | 18+ | Frontend |
| PyTorch | 2.0+ | Deep Learning |
| FFmpeg | 6.0+ | Video Processing |

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/vikrammonish02/EMprion.git
cd EMprion
```

### 2. Download AI Model Weights
The trained model weights (~1.5GB) are hosted externally due to size limits.

**Download from**: [Hugging Face Models (vikramsona02/EMprion-models)](https://huggingface.co/vikramsona02/EMprion-models)

```bash
# After downloading, place weights in embryo_ai/
cd embryo_ai/
# Copy these files:
# - gardner_net_best.pth
# - modelres18LSTM_bs16_trlen10_cv3_best_epoch18 (or similar)
```

> ⚠️ **IMPORTANT**: The AI will not work without model weights. Contact `vikram@subhag.in` for access.

### 3. Install Backend (Python)
```bash
cd embryo_ai
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install transformers  # For CLIP gating
```

### 4. Install Frontend (Node.js)
```bash
cd ..  # Back to root
npm install
```

### 5. Start Services
```bash
# Terminal 1: Backend (Port 8000)
cd embryo_ai
python main.py

# Terminal 2: Frontend (Port 3000)
npm run dev
```

### 6. Access Application
Open: **http://localhost:3000**

---

## 📁 Project Structure

```
EMprion/
├── embryo_ai/                 # AI Backend
│   ├── main.py               # FastAPI server entry
│   ├── service.py            # API service layer
│   ├── inference.py          # Model inference engine
│   ├── embryo_gate.py        # CLIP-based content validation
│   ├── gardner_net.py        # Gardner grading architecture
│   └── requirements.txt      # Python dependencies
│
├── screens/                   # React Pages
│   ├── DashboardHome.tsx     # Main dashboard
│   ├── PatientsList.tsx      # Patient directory
│   ├── PatientDetail.tsx     # Patient profile
│   ├── NewCycleForm.tsx      # Cycle wizard
│   ├── CycleDetail.tsx       # Embryo ranking
│   └── AssessmentDetail.tsx  # AI results view
│
├── components/                # React Components
│   ├── Sidebar.tsx           # Navigation
│   ├── PatientRegistrationWizard.tsx
│   └── EmbryoUploadModal.tsx
│
├── api.ts                     # Frontend API client
├── types.ts                   # TypeScript interfaces
└── README.md                  # This file
```

---

## 🔧 Configuration

### Environment Variables (Optional)
```bash
# embryo_ai/.env
ALLOW_SIMULATION=False    # Set True for demo mode (fake results)
MODEL_PATH=/path/to/weights
```

### API Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/predict?analysis_type=gardner` | POST | Image analysis |
| `/api/predict?analysis_type=morphokinetics` | POST | Video analysis |
| `/` | GET | Health check |

---

## 🧪 Testing

### Test AI Locally
```bash
cd embryo_ai
python -c "from inference import EmbryoInference; print('OK')"
```

### Test CLIP Gate
```bash
cd embryo_ai
python embryo_gate.py
```

---

## 🏥 Clinical Safety Features

1. **CLIP Gating**: AI rejects non-embryo images (product photos, screenshots, etc.)
2. **User Certification**: Mandatory checkbox before analysis
3. **No Silent Failures**: System errors are explicit, not hidden
4. **Audit Trail**: All uploads logged with timestamps

---

## ⚠️ Regulatory Notice

This software is **FOR RESEARCH USE ONLY**.

- ❌ Not FDA cleared / CE marked
- ❌ Not validated for clinical decision-making
- ❌ No warranty expressed or implied

For commercial clinical deployment, contact: **regulatory@subhag.in**

---

## 📞 Contact

**Subhag HealthTech**
- Email: vikram@subhag.in
- GitHub: [@vikrammonish02](https://github.com/vikrammonish02)

---

## 📄 License

Proprietary - All Rights Reserved © 2026 Subhag HealthTech

Unauthorized copying, modification, or distribution is prohibited.
