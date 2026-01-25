"""
Model Weights Download Script

This script downloads the required AI model weights from external storage.
Run this after cloning the repository.

Usage:
    python download_models.py
"""

import os
import sys
import urllib.request
import hashlib

# Configuration
BASE_URL = "https://huggingface.co/vikramsona02/EMprion-models/resolve/main"

MODEL_URLS = {
    "gardner_net_best.pth": {
        "url": f"{BASE_URL}/gardner_net_best.pth",
        "size_mb": 46.9,
        "description": "Gardner Grading Model (ResNet-18)"
    },
        "model3D18_bs16_trlen10_cv3_best_epoch31": {
                        "url": f"{BASE_URL}/model3D18_bs16_trlen10_cv3_best_epoch31%20(1)","size_mb": 198,
        "description": "Morphokinetic Analysis Model (ResNet-18 + LSTM)"
    }
}

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))


def check_existing_models():
    """Check which models are already downloaded."""
    existing = []
    missing = []
    
    for name, info in MODEL_URLS.items():
        path = os.path.join(CURRENT_DIR, name)
        if os.path.exists(path):
            existing.append(name)
        else:
            missing.append(name)
    
    return existing, missing


def download_file(url: str, dest_path: str, description: str):
    """Download a file with progress indicator."""
    print(f"\n📥 Downloading: {description}")
    print(f"   Destination: {dest_path}")
    
    if url == "CONTACT_MAINTAINER_FOR_ACCESS":
        print("   ❌ URL not configured. Please contact vikram@subhag.in for model access.")
        return False
    
    try:
        def progress_hook(block_num, block_size, total_size):
            downloaded = block_num * block_size
            percent = min(100, downloaded * 100 // total_size)
            bar = '█' * (percent // 2) + '░' * (50 - percent // 2)
            sys.stdout.write(f'\r   [{bar}] {percent}%')
            sys.stdout.flush()
        
        urllib.request.urlretrieve(url, dest_path, progress_hook)
        print("\n   ✅ Download complete!")
        return True
    except Exception as e:
        print(f"\n   ❌ Download failed: {e}")
        return False


def main():
    print("=" * 60)
    print("🧬 Subhag EMBRION - Model Weight Downloader")
    print("=" * 60)
    
    existing, missing = check_existing_models()
    
    if existing:
        print(f"\n✅ Already downloaded ({len(existing)}):")
        for name in existing:
            print(f"   - {name}")
    
    if not missing:
        print("\n✅ All models are already downloaded!")
        print("   You can run the backend: python main.py")
        return 0
    
    print(f"\n⚠️  Missing models ({len(missing)}):")
    for name in missing:
        info = MODEL_URLS[name]
        print(f"   - {name} ({info['size_mb']} MB)")
        print(f"     {info['description']}")
    
    print("\n" + "-" * 60)
    print("📋 HOW TO GET MODEL WEIGHTS:")
    print("-" * 60)
    print("""
The model weights are hosted on Hugging Face.

To get access:
1. Run this script: `python download_models.py`
2. Or visit: https://huggingface.co/vikramsona02/EMprion-models

If models are private, contact vikram@subhag.in.
""")
    
    return 1


if __name__ == "__main__":
    sys.exit(main())
