#!/bin/bash

# AiRicePest Quick Start Script
# This script helps you quickly set up and run the project

set -e

echo "🌾 AiRicePest Quick Start"
echo "========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+ from https://www.python.org/"
    exit 1
fi

if ! command_exists mysql; then
    echo "⚠️  MySQL/MariaDB is not found. Please ensure it's installed and running."
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⏩ node_modules exists, skipping npm install${NC}"
fi
echo ""

# Install backend dependencies
echo "🐍 Installing backend dependencies..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python packages..."
pip install -r requirements.txt
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
cd ..
echo ""

# Check environment files
echo "⚙️  Checking environment configuration..."

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Creating from example...${NC}"
    echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
    echo -e "${GREEN}✓ Created .env.local${NC}"
else
    echo -e "${GREEN}✓ .env.local exists${NC}"
fi

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env not found. Please configure manually.${NC}"
    echo "Example backend/.env:"
    echo "  DB_USER=root"
    echo "  DB_PASS=your_password"
    echo "  DB_HOST=localhost"
    echo "  DB_PORT=3306"
    echo "  DB_NAME=airicepest"
    echo "  SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(32))')"
else
    echo -e "${GREEN}✓ backend/.env exists${NC}"
fi
echo ""

# Database setup
echo "🗄️  Database setup"
echo "Please ensure you have:"
echo "  1. Created database: CREATE DATABASE airicepest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo "  2. Imported schema: mysql -u root -p airicepest < server/sql/schema.sql"
echo "  3. Imported seed data: mysql -u root -p airicepest < server/sql/seed.sql"
echo ""
read -p "Have you completed database setup? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please complete database setup first, then run this script again."
    exit 1
fi
echo ""

# Start services
echo "🚀 Starting services..."
echo ""

# Kill existing processes on ports 3000 and 4000
echo "Killing any existing processes on ports 3000 and 4000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
echo ""

# Start backend in background
echo "Starting backend (Flask on port 4000)..."
cd backend
source venv/bin/activate
python app.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
sleep 3

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
    echo "  Backend logs: tail -f backend.log"
    echo "  Backend API: http://localhost:4000"
else
    echo -e "${YELLOW}⚠️  Backend failed to start. Check backend.log for errors.${NC}"
fi
echo ""

# Start frontend
echo "Starting frontend (Next.js on port 3000)..."
echo -e "${GREEN}Frontend will start in this terminal...${NC}"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo "   Health:   http://localhost:4000/api/health"
echo ""
echo "📝 Test accounts:"
echo "   User:  username=farmer_john, password=password123"
echo "   Admin: username=admin, password=admin123"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Trap to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    echo "✓ All services stopped"
    exit 0
}

trap cleanup EXIT INT TERM

# Start frontend (blocking)
npm run dev
