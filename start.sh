#!/bin/bash

# AI水稻病虫害识别系统 - 快速启动脚本

echo "🌾 AI水稻病虫害识别系统 - 启动中..."
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到 Node.js，请先安装 Node.js (https://nodejs.org/)"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo "✅ npm 版本: $(npm -v)"
echo ""

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
    echo ""
fi

# 启动开发服务器
echo "🚀 启动开发服务器..."
echo ""
echo "📌 访问地址："
echo "   - 主页: http://localhost:3000"
echo "   - 登录: http://localhost:3000/sign-in"
echo "   - 注册: http://localhost:3000/sign-up"
echo ""
echo "👤 测试账户："
echo "   管理员: admin / admin123"
echo "   普通用户: 需要注册"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev
