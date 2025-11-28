import torch
import torch.nn as nn
import torchvision.models as models
from torch import Tensor

class VGG16WithCNN(nn.Module):
    def __init__(self, num_classes: int = 10):
        super(VGG16WithCNN, self).__init__()
        self.num_classes = num_classes
        self.vgg16 = models.vgg16(weights=None)

        for param in self.vgg16.parameters():
            param.requires_grad = False

        self.custom_cnn = nn.Sequential(
            nn.Conv2d(512, 64, kernel_size=3, stride=1, padding=1),
            nn.ReLU(inplace=True),
            nn.BatchNorm2d(64),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )

        # 分类器
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 3 * 3, 1024),
            nn.ReLU(inplace=True),
            nn.Dropout(0.4),
            nn.Linear(1024, num_classes),
        )

    def forward(self, x: Tensor):
        x = self.vgg16.features(x)
        x = self.custom_cnn(x)
        x = x.view(x.size(0), -1)
        x = self.classifier(x)
        return x
