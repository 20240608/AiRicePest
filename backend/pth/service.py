"""Utility helpers to load the PyTorch model and run predictions."""

from __future__ import annotations

import os
from pathlib import Path
from typing import List, Tuple

import torch
from PIL import Image
from torchvision import transforms

from .model import VGG16WithCNN

# 检查 CUDA 是否可用，选择设备
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[INFO] 🔧 使用设备: {DEVICE}")

_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

_MODEL: VGG16WithCNN | None = None
_LOADED_WEIGHTS: str | None = None
_CLASS_NAMES: List[str] = []


def _ensure_class_names(class_names: List[str]) -> None:
    global _CLASS_NAMES
    if not class_names:
        raise ValueError("Class names list cannot be empty.")
    if _CLASS_NAMES != class_names:
        _CLASS_NAMES = class_names


def _load_state_dict(weights_path: Path) -> dict:
    """
    Robustly load state dict handling various formats and prefixes.
    Based on api_server/app.py logic.
    """
    print(f"[INFO] Loading weights from {weights_path}")
    try:
        checkpoint = torch.load(str(weights_path), map_location=DEVICE)
    except Exception:
        checkpoint = torch.load(str(weights_path), map_location=DEVICE, weights_only=False)

    # Handle different checkpoint formats
    state_dict = None
    if isinstance(checkpoint, dict):
        state_dict = checkpoint.get('state_dict', checkpoint)
    elif isinstance(checkpoint, torch.nn.Module):
        state_dict = checkpoint.state_dict()
    else:
        raise ValueError(f"Unknown model file format: {type(checkpoint)}")

    # Handle prefixes
    new_state_dict = {}
    for k, v in state_dict.items():
        name = k
        if name.startswith('module.'):
            name = name[7:]
        new_state_dict[name] = v
        
    return new_state_dict


def get_model(weights_path: str | Path, class_names: List[str]) -> VGG16WithCNN:
    global _MODEL, _LOADED_WEIGHTS
    weights_path = str(weights_path)
    _ensure_class_names(class_names)

    if _MODEL is None or _LOADED_WEIGHTS != weights_path:
        print(f"[INFO] Initializing model...")
        try:
            model = VGG16WithCNN(num_classes=len(_CLASS_NAMES))
            state_dict = _load_state_dict(Path(weights_path))
            
            try:
                model.load_state_dict(state_dict, strict=True)
                print("[INFO] ✅ Model weights loaded successfully (strict mode)")
            except RuntimeError as e:
                print(f"[WARNING] Strict loading failed: {str(e)[:200]}...")
                # Try removing 'model.' prefix
                retry_state_dict = {}
                for k, v in state_dict.items():
                    if k.startswith('model.'):
                        retry_state_dict[k[6:]] = v
                    else:
                        retry_state_dict[k] = v
                
                try:
                    model.load_state_dict(retry_state_dict, strict=True)
                    print("[INFO] ✅ Loaded successfully after removing 'model.' prefix")
                except RuntimeError:
                    print("[WARNING] Trying non-strict loading...")
                    model.load_state_dict(state_dict, strict=False)
                    print("[INFO] ⚠️ Model weights partially loaded (non-strict mode)")

            model.to(DEVICE)
            model.eval()
            _MODEL = model
            _LOADED_WEIGHTS = weights_path
        except Exception as e:
            print(f"[ERROR] ❌ Model loading failed: {e}")
            raise
    return _MODEL


def predict(image_path: str | Path, weights_path: str | Path, class_names: List[str]) -> Tuple[str, float]:
    model = get_model(weights_path, class_names)
    image = Image.open(image_path).convert("RGB")
    tensor = _TRANSFORM(image).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1)
        
        # Get top prediction
        confidence, pred_idx = torch.max(probs, dim=1)
        
    label = _CLASS_NAMES[pred_idx.item()]
    return label, float(confidence.item() * 100)
