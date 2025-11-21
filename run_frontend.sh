#!/bin/bash
# 假设您在 /home/your_username/airicepest 目录下

NAME="airicepest_frontend"
DIR=/home/ubuntu/AiRicePest

echo "Starting $NAME"

# 运行 Next.js 生产环境服务 (默认 3000 端口)
# 注意: Next.js 会自动找到 .env.local 里的配置
exec npm start --prefix $DIR
