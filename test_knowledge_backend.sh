#!/bin/bash

# 知识库功能测试启动脚本

echo "======================================"
echo "知识库功能测试启动脚本"
echo "======================================"

# 检查后端环境
echo ""
echo "1. 检查后端 Python 环境..."
cd /media/qiu/entertainment/airicepest/AiRicePest/airicepest/backend

if [ -d "myenv_311" ]; then
    echo "   ✓ 找到虚拟环境 myenv_311"
    source myenv_311/bin/activate
    echo "   ✓ 已激活虚拟环境"
else
    echo "   ✗ 未找到虚拟环境，使用系统 Python"
fi

# 检查必要的包
echo ""
echo "2. 检查必要的 Python 包..."
python3 -c "import flask; print('   ✓ Flask:', flask.__version__)" 2>/dev/null || echo "   ✗ Flask 未安装"
python3 -c "import flask_cors; print('   ✓ Flask-CORS 已安装')" 2>/dev/null || echo "   ✗ Flask-CORS 未安装"

# 检查图片目录
echo ""
echo "3. 检查图片目录..."
IMAGE_DIR="/media/qiu/entertainment/airicepest/AiRicePest/airicepest/images"
if [ -d "$IMAGE_DIR" ]; then
    IMAGE_COUNT=$(ls -1 "$IMAGE_DIR"/*.png "$IMAGE_DIR"/*.jpeg 2>/dev/null | wc -l)
    echo "   ✓ 图片目录存在，包含 $IMAGE_COUNT 个图片文件"
else
    echo "   ✗ 图片目录不存在"
fi

# 启动后端
echo ""
echo "4. 启动后端服务器..."
echo "   后端将在 http://localhost:4000 运行"
echo "   按 Ctrl+C 停止服务器"
echo ""

cd /media/qiu/entertainment/airicepest/AiRicePest/airicepest/backend
python3 app.py
