
import os
import sys
import torch
from backend.pth.service import predict

# Mock config
weights_path = "/home/ubuntu/AiRicePest/backend/pth/dense_net_model_50.pth"
class_names = ["Bacterialblight", "Blast", "Brownspot", "Healthy", "Tungro"]
image_path = "public/placeholder.png"

print(f"Testing prediction with weights: {weights_path}")
try:
    label, conf = predict(image_path, weights_path, class_names)
    print(f"Prediction: {label}, Confidence: {conf}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
