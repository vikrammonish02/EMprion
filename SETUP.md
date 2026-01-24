# 🔧 Complete Setup Guide

This document provides step-by-step instructions for deploying the Subhag EMBRION AI Platform from scratch.

---

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Download Model Weights](#download-model-weights)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Hardware (Minimum)
| Component | Requirement |
|-----------|-------------|
| CPU | 4 cores |
| RAM | 8 GB |
| Storage | 10 GB free |
| GPU | Optional (CPU inference works) |

### Hardware (Recommended for Production)
| Component | Requirement |
|-----------|-------------|
| CPU | 8+ cores |
| RAM | 16 GB |
| Storage | 50 GB SSD |
| GPU | NVIDIA RTX 3060+ with CUDA |

### Software
```bash
# Check versions
python --version    # >= 3.10
node --version      # >= 18
npm --version       # >= 9
ffmpeg -version     # >= 6.0 (for video processing)
```

---

## Download Model Weights

### Option A: From Shared Drive (Recommended)

**Model Weights Download**: Contact `vikram@subhag.in` for access to the model repository.

Files you will receive:
```
gardner_net_best.pth                    (~60 MB)  - Gardner Grading
modelres18LSTM_bs16_trlen10_cv3...      (~200 MB) - Morphokinetic Analysis
```

### Option B: Using Download Script
```bash
cd embryo_ai
python download_models.py
```

### Verify Models
```bash
cd embryo_ai
python -c "
import torch
m1 = torch.load('gardner_net_best.pth', map_location='cpu')
print('Gardner Model: OK')
"
```

---

## Backend Setup

### Step 1: Create Virtual Environment
```bash
cd embryo_ai
python -m venv venv

# Activate
source venv/bin/activate        # macOS/Linux
# OR
venv\Scripts\activate           # Windows
```

### Step 2: Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
pip install transformers pillow  # For CLIP gating

# Optional: GPU support
pip install torch torchvision --extra-index-url https://download.pytorch.org/whl/cu118
```

### Step 3: Install FFmpeg (Required for Videos)
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# Windows
choco install ffmpeg
```

### Step 4: Test Backend
```bash
python main.py
# Should output: Uvicorn running on http://0.0.0.0:8000
```

---

## Frontend Setup

### Step 1: Install Dependencies
```bash
cd ..  # Back to project root
npm install
```

### Step 2: Configure API Endpoint
Edit `api.ts` if backend is on different host:
```typescript
const BASE_URL = 'http://localhost:8000';  // Change if needed
```

### Step 3: Run Development Server
```bash
npm run dev
# Access at http://localhost:3000
```

---

## Production Deployment

### Option 1: Docker (Recommended)

```bash
# Build
docker-compose up -d

# Or manually:
docker build -t embrion-backend -f Dockerfile.backend .
docker build -t embrion-frontend -f Dockerfile.frontend .
```

### Option 2: Manual Deployment

#### Backend (Gunicorn + Uvicorn)
```bash
cd embryo_ai
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

#### Frontend (Nginx)
```bash
npm run build
# Serve ./dist with Nginx
```

### Option 3: Cloud Platforms
- **AWS**: EC2 + S3 (for models) + CloudFront
- **GCP**: Cloud Run + Cloud Storage
- **Azure**: App Service + Blob Storage

---

## Troubleshooting

### Error: "Model weights not found"
```bash
# Verify files exist
ls embryo_ai/*.pth

# Expected files:
# - gardner_net_best.pth
# - modelres18LSTM_...
```

### Error: "CLIP model download failed"
```bash
# Manual download
pip install huggingface-hub
python -c "from transformers import CLIPModel; CLIPModel.from_pretrained('openai/clip-vit-base-patch32')"
```

### Error: "FFmpeg not found"
```bash
# Check installation
which ffmpeg
ffmpeg -version

# If missing, reinstall per your OS
```

### Error: "Analysis Failed" on all uploads
1. Check backend logs: `python main.py`
2. Look for CLIP GATE REJECTION messages
3. Verify you're uploading actual embryo images

---

## Support

- **Email**: vikram@subhag.in
- **GitHub Issues**: https://github.com/vikrammonish02/EMprion/issues

---

*Last Updated: January 2026*
