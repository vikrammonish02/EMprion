"""
Hugging Face model weight uploader for Subhag EMBRION.
Transfers proprietary weights from local storage to vikramsona02/EMprion-models.
"""

import os
import sys
from huggingface_hub import HfApi, create_repo, upload_folder

# Configuration
REPO_ID = "vikramsona02/EMprion-models"
LOCAL_DIR = os.path.dirname(os.path.abspath(__file__))

def main():
    print("=" * 60)
    print("🧬 Hugging Face Model Migration Tool")
    print("=" * 60)
    
    # 1. Check for files to upload
    files_to_upload = [f for f in os.listdir(LOCAL_DIR) 
                      if f.endswith('.pth') or f.startswith('model') or f.endswith('.ini')]
    
    if not files_to_upload:
        print("❌ No model weights found in embryo_ai/. Nothing to upload.")
        return
    
    print(f"Found {len(files_to_upload)} files to migrate (~3.3GB).")
    
    # 2. Authentication
    print("\n🔑 Authentication Required")
    token = os.getenv("HF_TOKEN")
    if not token:
        print("Get your 'WRITE' token from: https://huggingface.co/settings/tokens")
        token = input("Enter your Hugging Face Access Token: ").strip()
    
    if not token:
        print("❌ Token is required.")
        return

    api = HfApi(token=token)
    
    # 3. Create repository if it doesn't exist
    print(f"\n📁 Preparing repository: {REPO_ID}")
    try:
        create_repo(repo_id=REPO_ID, repo_type="model", exist_ok=True, token=token)
        print("✅ Repository ready.")
    except Exception as e:
        print(f"❌ Could not create repository: {e}")
        return

    # 4. Upload Files
    print(f"\n🚀 Uploading files to {REPO_ID}...")
    print("This may take a long time depending on your internet connection.")
    
    try:
        # We use upload_folder to efficiently sync the directory
        # We'll use a temporary folder or filter the current one
        # Actually, let's just specify the patterns to include
        upload_folder(
            folder_path=LOCAL_DIR,
            repo_id=REPO_ID,
            repo_type="model",
            allow_patterns=["*.pth", "model*", "*.ini"],
            ignore_patterns=["venv/*", "__pycache__/*", "*.py"], # Don't upload code/venv
            token=token,
            commit_message="Initial migration of embryo analysis weights"
        )
        print("\n✨ SUCCESS! All model weights are now on Hugging Face.")
        print(f"Explore at: https://huggingface.co/{REPO_ID}")
        
    except Exception as e:
        print(f"\n❌ Upload failed: {e}")

if __name__ == "__main__":
    main()
