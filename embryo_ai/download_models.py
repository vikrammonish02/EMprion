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
        "modelr3D18_bs16_trlen10_cv3_best_epoch31": {
                        "url": f"{BASE_URL}/modelr3D18_bs16_trlen10_cv3_best_epoch31%20(1)","size_mb": 198,
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


def download_file(url: str, dest_path: str, description: str, token: str = None):
    """Download a file with progress indicator."""
    print(f"\n📥 Downloading: {description}")
    print(f"   Destination: {dest_path}")
    
    if url == "CONTACT_MAINTAINER_FOR_ACCESS":
        print("   ❌ URL not configured. Please contact vikram@subhag.in for model access.")
        return False
    
    try:
        headers = {}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        
        request = urllib.request.Request(url, headers=headers)
        
        def progress_hook(block_num, block_size, total_size):
            downloaded = block_num * block_size
            if total_size > 0:
                percent = min(100, downloaded * 100 // total_size)
                bar = '█' * (percent // 2) + '░' * (50 - percent // 2)
                sys.stdout.write(f'\r   [{bar}] {percent}%')
            else:
                sys.stdout.write(f'\r   Downloaded {downloaded / (1024*1024):.1f} MB')
            sys.stdout.flush()
        
        with urllib.request.urlopen(request) as response, open(dest_path, 'wb') as out_file:
            total_size = int(response.info().get('Content-Length', -1))
            downloaded = 0
            block_size = 8192
            while True:
                buffer = response.read(block_size)
                if not buffer:
                    break
                downloaded += len(buffer)
                out_file.write(buffer)
                progress_hook(downloaded // block_size, block_size, total_size)
                
        print("\n   ✅ Download complete!")
        return True
    except Exception as e:
        print(f"\n   ❌ Download failed: {e}")
        return False


def main():
    print("=" * 60)
    print("🧬 Subhag EMBRION - Model Weight Downloader")
    print("=" * 60)
    
    hf_token = os.environ.get("HUGGINGFACE_TOKEN")
    if hf_token:
        print("🔑 Using HUGGINGFACE_TOKEN from environment.")
    else:
        print("💡 Tip: Set HUGGINGFACE_TOKEN env var if the repository is private.")

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
    
    print("\n🚀 Starting downloads...")
    all_success = True
    for name in missing:
        info = MODEL_URLS[name]
        dest_path = os.path.join(CURRENT_DIR, name)
        success = download_file(info['url'], dest_path, info['description'], token=hf_token)
        if not success:
            all_success = False
    
    if all_success:
        print("\n🎉 All models downloaded successfully!")
        return 0
    else:
        print("\n❌ Some models failed to download.")
        print("-" * 60)
        print("📋 HOW TO GET MODEL WEIGHTS MANUALLY:")
        print("-" * 60)
        print("""
The model weights are hosted on Hugging Face.

To get access:
1. Visit: https://huggingface.co/vikramsona02/EMprion-models
2. Download the missing files into the embryo_ai/ directory.

If models are private, ensure HUGGINGFACE_TOKEN is set.
""")
        return 1


if __name__ == "__main__":
    main()
