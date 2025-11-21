#!/bin/bash
# 假设您在 /home/your_username/airicepest 目录下

NAME="airicepest_backend"
DIR=/home/ubuntu/AiRicePest/backend
WORKERS=2 # 根据服务器核心数调整
VENV_DIR=/home/ubuntu/AiRicePest/backend/myenv_311
FLASK_APP=app.py
echo "Starting $NAME as $USER"

# Directly use the Gunicorn executable inside the VENV path
# This bypasses potential issues with 'source' and 'exec' in systemd
exec $VENV_DIR/bin/gunicorn app:app \
  --name $NAME \
  --workers $WORKERS \
  --bind 127.0.0.1:4000 \
  --log-level=info \
  --timeout 120 \
  --chdir $DIR
