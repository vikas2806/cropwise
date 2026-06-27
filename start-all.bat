@echo off
REM CropWise AI Development Startup Script (Windows)
REM Starts all three services in separate terminal windows

echo.
echo ========================================
echo CropWise AI Stack Launcher
echo ========================================
echo.

REM Check if backend virtual environment exists
if not exist "cropwise-backend\venv" (
    echo [ERROR] Backend venv not found
    echo Run: cd cropwise-backend ^&^& python -m venv venv
    pause
    exit /b 1
)

REM Check if proxy node_modules exists
if not exist "cropwise-ui\proxy-server\node_modules" (
    echo [ERROR] Proxy dependencies not installed
    echo Run: cd cropwise-ui\proxy-server ^&^& npm install
    pause
    exit /b 1
)

REM Check if frontend node_modules exists
if not exist "cropwise-ui\node_modules" (
    echo [ERROR] Frontend dependencies not installed
    echo Run: cd cropwise-ui ^&^& npm install
    pause
    exit /b 1
)

echo [1/3] Starting Backend (port 8000)...
start "CropWise Backend" cmd /k "cd cropwise-backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000"
timeout /t 2 /nobreak

echo [2/3] Starting Proxy (port 4000)...
start "CropWise Proxy" cmd /k "cd cropwise-ui\proxy-server && npm start"
timeout /t 2 /nobreak

echo [3/3] Starting Frontend (port 5173)...
start "CropWise Frontend" cmd /k "cd cropwise-ui && npm run dev"
timeout /t 2 /nobreak

echo.
echo ========================================
echo All services starting...
echo ========================================
echo.
echo Frontend:  http://localhost:5173
echo Proxy:     http://localhost:4000
echo Backend:   http://localhost:8000
echo.
echo Close any window to stop that service.
echo.
echo ========================================
pause
