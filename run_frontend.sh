#!/bin/bash
# 假设您在 /home/your_username/airicepest 目录下

NAME="airicepest_frontend"
DIR=/home/ubuntu/AiRicePest

echo "Starting $NAME"

# 运行 Next.js 生产环境服务
exec npm start --prefix $DIR
