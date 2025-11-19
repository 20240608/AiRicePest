@echo off
REM AiRicePest Quick Start Script for Windows
REM This script helps you quickly set up and run the project

echo ===============================
echo   AiRicePest Quick Start
echo ===============================
echo.

REM Check prerequisites
echo [1/5] Checking prerequisites...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 20+ from https://nodejs.org/
    pause
    exit /b 1
)

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python 3.11+ from https://www.python.org/
    pause
    exit /b 1
)

where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] MySQL/MariaDB is not found. Please ensure it's installed and running.
)

echo [OK] Prerequisites check passed
echo.

REM Install frontend dependencies
echo [2/5] Installing frontend dependencies...
if not exist "node_modules" (
    call npm install
    echo [OK] Frontend dependencies installed
) else (
    echo [SKIP] node_modules exists, skipping npm install
)
echo.

REM Install backend dependencies
echo [3/5] Installing backend dependencies...
cd backend
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python packages...
pip install -r requirements.txt
echo [OK] Backend dependencies installed
cd ..
echo.

REM Check environment files
echo [4/5] Checking environment configuration...

if not exist ".env.local" (
    echo [WARNING] .env.local not found. Creating from example...
    echo NEXT_PUBLIC_API_URL=http://localhost:4000 > .env.local
    echo [OK] Created .env.local
) else (
    echo [OK] .env.local exists
)

if not exist "backend\.env" (
    echo [WARNING] backend\.env not found. Please configure manually.
    echo Example backend\.env:
    echo   DB_USER=root
    echo   DB_PASS=your_password
    echo   DB_HOST=localhost
    echo   DB_PORT=3306
    echo   DB_NAME=airicepest
    echo   SECRET_KEY=^(generate with: python -c "import secrets; print(secrets.token_hex(32))"^)
) else (
    echo [OK] backend\.env exists
)
echo.

REM Database setup
echo [5/5] Database setup
echo Please ensure you have:
echo   1. Created database: CREATE DATABASE airicepest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
echo   2. Imported schema: mysql -u root -p airicepest ^< server\sql\schema.sql
echo   3. Imported seed data: mysql -u root -p airicepest ^< server\sql\seed.sql
echo.
set /p dbready="Have you completed database setup? (y/n): "
if /i not "%dbready%"=="y" (
    echo Please complete database setup first, then run this script again.
    pause
    exit /b 1
)
echo.

REM Start services
echo ===============================
echo   Starting Services
echo ===============================
echo.

echo Starting backend (Flask on port 4000)...
start "AiRicePest Backend" cmd /k "cd backend && venv\Scripts\activate && python app.py"
timeout /t 3 /nobreak >nul

echo [OK] Backend started in new window
echo   Backend API: http://localhost:4000
echo.

echo Starting frontend (Next.js on port 3000)...
echo.
echo ===============================
echo   Access Information
echo ===============================
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:4000
echo   Health:   http://localhost:4000/api/health
echo.
echo   Test accounts:
echo     User:  username=farmer_john, password=password123
echo     Admin: username=admin, password=admin123
echo.
echo Press Ctrl+C to stop frontend (backend runs in separate window)
echo ===============================
echo.

npm run dev
