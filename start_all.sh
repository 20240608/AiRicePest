#!/bin/bash

# AI水稻病虫害识别系统 - 完整启动脚本

echo "🌾 AI水稻病虫害识别系统 - 启动中..."
echo ""

# 检查依赖
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到 Node.js"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ 错误：未检测到 Python3"
    exit 1
fi

echo "✅ Node.js: $(node -v)"
echo "✅ Python: $(python3 --version)"
echo ""

# 检查虚拟环境
if [ ! -d ".venv" ]; then
    echo "📦 创建Python虚拟环境..."
    python3 -m venv .venv
fi

# 安装Python依赖
echo "📦 安装Python依赖..."
.venv/bin/pip install -q -r backend/requirements.txt
echo "✅ Python依赖安装完成"
echo ""

# 检查数据库连接
echo "🗄️  检查数据库连接..."
.venv/bin/python3 -c "
import pymysql
try:
    conn = pymysql.connect(host='localhost', user='airicepest', password='123456', database='airicepest')
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM users')
    count = cursor.fetchone()[0]
    print(f'✅ 数据库连接正常 (用户数: {count})')
    conn.close()
except Exception as e:
    print(f'❌ 数据库连接失败: {e}')
    print('请确保MySQL已启动，并且已导入数据库：')
    print('  mysql -u root -p airicepest < server/sql/schema.sql')
    print('  mysql -u root -p airicepest < server/sql/seed.sql')
    exit(1)
" || exit 1
echo ""

# 清理旧进程
echo "🧹 清理旧进程..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
rm -rf .next/dev/lock 2>/dev/null || true
echo "✅ 清理完成"
echo ""

# 启动后端
echo "🚀 启动后端服务器 (Flask on port 4000)..."
cd backend
../.venv/bin/python app.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
sleep 2

# 检查后端是否启动成功
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ 后端已启动 (PID: $BACKEND_PID)"
    echo "   日志: tail -f backend.log"
else
    echo "❌ 后端启动失败，查看 backend.log"
    exit 1
fi
echo ""

# 启动前端
echo "🚀 启动前端服务器 (Next.js)..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 访问地址："
echo "   前端: http://localhost:3000 或 http://localhost:3001"
echo "   后端: http://localhost:4000"
echo ""
echo "👤 测试账户："
echo "   用户名: admin"
echo "   密码: password123"
echo ""
echo "   (或注册新账户)"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 清理函数
cleanup() {
    echo ""
    echo "🛑 停止服务..."
    kill $BACKEND_PID 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    echo "✅ 所有服务已停止"
    exit 0
}

trap cleanup EXIT INT TERM

# 启动前端（阻塞）
npm run dev
