import torch
import torch.nn as nn
import torchvision.models as models

class GardnerNet(nn.Module):
    """
    PyTorch implementation of the Multi-Label Blastocyst Grading Network.
    
    Architecture based on: https://github.com/llockhar/Blastocyst-Grading
    - Backbone: VGG16 (features only)
    - Heads: 3 separate branches for Expansion (BE), ICM, and Trophectoderm (TE)
    """
    def __init__(self, pretrained=True, freeze_backbone=True):
        super(GardnerNet, self).__init__()
        
        # Load VGG16 backbone
        # We use the 'features' part of VGG16 which corresponds to the convolutional blocks
        vgg16 = models.vgg16(pretrained=pretrained)
        self.features = vgg16.features
        
        # Optional: Freeze backbone weights (simulating Keras 'trainable=False' behavior)
        # The original paper/code freezes everything except the last 3 layers for fine-tuning
        # Here we provide an option to freeze the entire feature extractor
        if freeze_backbone:
            for param in self.features.parameters():
                param.requires_grad = False
                
        # Define the 3 grading heads
        # Each head takes the output of the VGG16 features (512 channels)
        
        # Branch 1: Expansion Grade (BE)
        self.head_expansion = nn.Sequential(
            nn.AdaptiveAvgPool2d((1, 1)),     # GlobalAveragePooling2D
            nn.Flatten(),
            nn.Linear(512, 32),               # Dense 32
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(32, 8),                 # Dense 8
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(8, 5)                   # Softmax Output (5 classes for Expansion 0-4)
        )
        
        # Branch 2: Inner Cell Mass (ICM)
        self.head_icm = nn.Sequential(
            nn.AdaptiveAvgPool2d((1, 1)),
            nn.Flatten(),
            nn.Linear(512, 32),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(32, 8),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(8, 3)
        )
        
        # Branch 3: Trophectoderm (TE)
        self.head_te = nn.Sequential(
            nn.AdaptiveAvgPool2d((1, 1)),
            nn.Flatten(),
            nn.Linear(512, 32),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(32, 8),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(8, 3)
        )

    def forward(self, x):
        # 1. Feature Extraction (VGG16)
        # Expected input: [Batch, 3, 224, 224]
        # Output: [Batch, 512, 7, 7] (typically)
        x = self.features(x)
        
        # 2. Variable Heads
        # Expansion Output
        out_be = self.head_expansion(x)
        
        # ICM Output
        out_icm = self.head_icm(x)
        
        # TE Output
        out_te = self.head_te(x)
        
        # Return dictionary for clarity
        return {
            'expansion': out_be,
            'icm': out_icm,
            'te': out_te
        }

if __name__ == "__main__":
    # Quick sanity check
    model = GardnerNet(pretrained=False)
    print("GardnerNet VGG16 Architecture initialized successfully.")
    print(model)
