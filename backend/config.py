import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent


class Config:
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}@"
        f"{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '3306')}/"
        f"{os.getenv('DB_NAME')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-prod')
    JWT_SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-prod')
    MODEL_WEIGHTS_PATH = os.getenv(
        'MODEL_WEIGHTS_PATH',
        str(BASE_DIR / 'pth' / 'dense_net_model_50.pth')
    )
    MODEL_LABELS = [
        label.strip() for label in os.getenv(
            'MODEL_LABELS',
            'Bacterialblight,Blast,Brownspot,Healthy,Tungro'
        ).split(',') if label.strip()
    ]
    PUBLIC_BASE_URL = os.getenv('PUBLIC_BASE_URL')
    PUBLIC_STATIC_BASE_URL = os.getenv('PUBLIC_STATIC_BASE_URL')

