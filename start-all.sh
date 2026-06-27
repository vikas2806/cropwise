#!/bin/bash
# CropWise AI Development Startup Script (Mac/Linux)
# Starts all three services in separate terminal windows/tabs

set -e

echo ""
echo "========================================"
echo "CropWise AI Stack Launcher"
echo "========================================"
echo ""

# Check if backend virtual environment exists
if [ ! -d "cropwise-backend/venv" ]; then
    echo "[ERROR] Backend venv not found"
    echo "Run: cd cropwise-backend && python3 -m venv venv"
    exit 1
fi

# Check if proxy node_modules exists
if [ ! -d "cropwise-ui/proxy-server/node_modules" ]; then
    echo "[ERROR] Proxy dependencies not installed"
    echo "Run: cd cropwise-ui/proxy-server && npm install"
    exit 1
fi

# Check if frontend node_modules exists
if [ ! -d "cropwise-ui/node_modules" ]; then
    echo "[ERROR] Frontend dependencies not installed"
    echo "Run: cd cropwise-ui && npm install"
    exit 1
fi

echo "[1/3] Starting Backend (port 8000)..."
cd cropwise-backend
source venv/bin/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..
sleep 2

echo "[2/3] Starting Proxy (port 4000)..."
cd cropwise-ui/proxy-server
npm start &
PROXY_PID=$!
cd ../..
sleep 2

echo "[3/3] Starting Frontend (port 5173)..."
cd cropwise-ui
npm run dev &
FRONTEND_PID=$!
cd ..
sleep 2

echo ""
echo "========================================"
echo "All services starting..."
echo "========================================"
echo ""
echo "Frontend:  http://localhost:5173"
echo "Proxy:     http://localhost:4000"
echo "Backend:   http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all services..."
echo ""
echo "========================================"

# Wait for all background processes
wait
