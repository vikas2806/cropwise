# CropWise AI — Complete Setup Guide

This guide walks you through setting up the entire CropWise AI stack: **React frontend** → **Express proxy** → **FastAPI backend** → **PostgreSQL** → **Google Earth Engine**.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                             │
│  React (localhost:5173) — Vite                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP requests
                         │ GET /api/tiles/crop-type
                         │ GET /api/fields/{id}/advisory
                         │ GET /api/alerts
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express Proxy (port 4000)                    │
│  cropwise-ui/proxy-server/                                      │
│  • Strips /api prefix → /tiles/crop-type                        │
│  • Injects X-Internal-Key header                                │
│  • CORS + rate limiting                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP (with X-Internal-Key)
                         │ GET /tiles/crop-type
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FastAPI Backend (port 8000)                    │
│  cropwise-backend/                                              │
│  • /tiles/* — GEE tile URLs (NDVI, crop-type, stress)          │
│  • /fields/{id}/advisory — irrigation recommendations          │
│  • /fields/{id}/timeseries — 60-day NDVI/stress history       │
│  • /alerts — critical alerts across all fields                 │
│  • /health — status check                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │ Python libraries + SQL
                         │ 
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
   PostgreSQL+PostGIS            Google Earth Engine API
   (cropwise_db)                 (earthengine-api)
   • fields (8 Maharashtra)       • Sentinel-2 NDVI
   • timeseries (60 days)         • Crop classification
   • advisories (daily)           • Moisture stress
   • tile_cache (24h TTL)         • GEE Project: cropwise-ai-499810
```

---

## Step 1: Set Up PostgreSQL Database

### Option A: Local PostgreSQL

```bash
# 1. Create database
psql -U postgres
CREATE DATABASE cropwise_db;
\c cropwise_db
CREATE EXTENSION IF NOT EXISTS postgis;
```

Your connection string:
```
postgresql://postgres:YOUR_PASSWORD@localhost:5432/cropwise_db
```

### Option B: Supabase (Recommended for Hackathon)

1. Go to https://supabase.com
2. Create new project
3. Go to **SQL Editor** → run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```
4. Go to **Settings** → **Database** → Copy connection string
   ```
   postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres
   ```

### Option C: Neon (Also Good)

1. Go to https://neon.tech
2. Create new project
3. Copy connection string from dashboard
   ```
   postgresql://YOUR_USER:YOUR_PASSWORD@ep-XXX.us-east-2.aws.neon.tech/cropwise_db
   ```

---

## Step 2: Generate Security Keys

Open a terminal and run:

```bash
# For INTERNAL_API_KEY (used by both proxy and backend)
python -c "import secrets; print(secrets.token_hex(32))"
```

Output example:
```
a7f3e9d2c8b1f4a6e9c2d5f8b1a4e7d0c3f6a9b2e5f8c1d4a7e0b3f6c9d2e5
```

Keep this key safe — you'll use it in both `.env` files.

---

## Step 3: Backend Setup

### 3.1 Create Python Virtual Environment

```bash
cd cropwise-backend
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate
```

### 3.2 Configure Backend

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# REQUIRED — paste your database connection string
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/cropwise_db

# GEE Project ID (already set, don't change)
GEE_PROJECT_ID=cropwise-ai-499810

# REQUIRED — paste the security key from Step 2
INTERNAL_API_KEY=a7f3e9d2c8b1f4a6e9c2d5f8b1a4e7d0c3f6a9b2e5f8c1d4a7e0b3f6c9d2e5

# Proxy server origin
ALLOWED_ORIGINS=http://localhost:4000,http://localhost:5173

# Start with true until GEE is confirmed working
USE_MOCK_GEE=true
CACHE_TILES=true
CACHE_TTL_SECONDS=86400
```

### 3.3 Install Dependencies

```bash
pip install -r requirements.txt
```

### 3.4 (One-time) GEE Authentication

If you haven't already:

```bash
python -c "import ee; ee.Authenticate()"
```

This opens a browser to authorize. Keep the token — it's saved locally.

### 3.5 Start Backend

```bash
uvicorn main:app --reload --port 8000
```

You'll see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Verify it's working:
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status": "ok", "version": "1.0.0", "gee_ready": false}  # false if USE_MOCK_GEE=true
```

---

## Step 4: Proxy Server Setup

### 4.1 Configure Proxy

```bash
cd cropwise-ui/proxy-server
cp .env.example .env
```

Edit `.env`:

```env
# The backend FastAPI server
BACKEND_URL=http://localhost:8000

PROXY_PORT=4000
ALLOWED_ORIGIN=http://localhost:5173

# MUST match cropwise-backend/.env INTERNAL_API_KEY
INTERNAL_API_KEY=a7f3e9d2c8b1f4a6e9c2d5f8b1a4e7d0c3f6a9b2e5f8c1d4a7e0b3f6c9d2e5
```

### 4.2 Install & Start Proxy

```bash
npm install
npm start
```

You'll see:
```
Proxy running on port 4000 → http://localhost:8000
```

Verify:
```bash
curl http://localhost:4000/health
```

Expected:
```json
{"status": "ok"}
```

---

## Step 5: Frontend Setup

### 5.1 Environment Already Set

Frontend `.env` is already configured:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_USE_MOCK=false
```

This points to the proxy server on port 4000.

### 5.2 Start Frontend

```bash
cd cropwise-ui
npm install
npm run dev
```

You'll see:
```
VITE v5.0.0 ready in 123 ms

➜  Local:   http://localhost:5173/
```

---

## Step 6: Full Integration Test

### 6.1 Verify Health Checks

✅ Frontend health:
```bash
curl http://localhost:5173
```

✅ Proxy health:
```bash
curl http://localhost:4000/health
# {"status": "ok"}
```

✅ Backend health:
```bash
curl http://localhost:8000/health
# {"status": "ok", "version": "1.0.0", "gee_ready": true/false}
```

### 6.2 Test Tile Endpoint (Frontend → Proxy → Backend)

```bash
curl "http://localhost:4000/api/tiles/crop-type"
```

Expected response (with or without GEE, mock or real):
```json
{
  "tile_url": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "attribution": "Mock Crop Types — OpenStreetMap",
  "layer_name": "Crop Types (Mock)",
  "is_mock": true
}
```

### 6.3 Test Field Advisory (requires field to exist)

```bash
curl "http://localhost:4000/api/fields/1/advisory"
```

Expected:
```json
{
  "field_id": 1,
  "zone_name": "Vidarbha-Rice-01",
  "crop_type": "Rice",
  "area_ha": 2340,
  "growth_stage": "Vegetative",
  "ndvi": 0.45,
  "stress_class": "Mild",
  "soil_moisture_pct": 45.3,
  "rainfall_mm": 8.0,
  "days_since_rain": 5,
  "advisory_status": "Irrigate Soon",
  "timeline_days": 3,
  "water_amount_mm": 25.0,
  "duration_hours": 2.5,
  "best_time": "4:00–8:00 AM",
  "advisory_text": "..."
}
```

### 6.4 Open the Frontend in Browser

Go to http://localhost:5173 and:
1. Click **Map Explorer**
2. Toggle between **Crop Type**, **Stress**, and **Advisory** layers
3. Click a field polygon to see the advisory panel
4. Click **Alerts** tab to see critical alerts

---

## Troubleshooting

### ❌ "Proxy error: Backend unavailable"

**Cause:** Backend (`http://localhost:8000`) is not running or wrong port.

**Fix:**
```bash
# Check backend is running
curl http://localhost:8000/health

# If not, restart backend in its terminal
cd cropwise-backend
uvicorn main:app --reload --port 8000
```

### ❌ "CORS error" in browser console

**Cause:** Frontend origin not in `ALLOWED_ORIGINS` in backend.

**Fix:**
1. Check `cropwise-backend/.env`:
   ```env
   ALLOWED_ORIGINS=http://localhost:4000,http://localhost:5173
   ```
2. Restart backend

### ❌ "X-Internal-Key: Forbidden"

**Cause:** Key mismatch between proxy and backend.

**Fix:**
1. Check proxy `.env`: `INTERNAL_API_KEY=...`
2. Check backend `.env`: `INTERNAL_API_KEY=...` (must match exactly)
3. Restart both proxy and backend
4. Test:
   ```bash
   curl -H "X-Internal-Key: YOUR_KEY" http://localhost:8000/tiles/ndvi
   ```

### ❌ "Tiles not loading, only OSM base layer"

**Cause:** GEE not initialized OR backend not returning tile URLs.

**Fix:**

1. Check backend is returning tiles:
   ```bash
   curl http://localhost:8000/tiles/ndvi
   ```

2. If `is_mock: true`, GEE is disabled. To enable:
   - Set `USE_MOCK_GEE=false` in `.env`
   - Ensure you've run `ee.Authenticate()` once
   - Restart backend

3. Check browser DevTools Console for errors

---

## Endpoint Reference

| Method | Path | Frontend | Backend | Description |
|--------|------|----------|---------|-------------|
| GET | `/api/tiles/ndvi` | ✅ useTileLayer | /tiles/ndvi | NDVI health heatmap |
| GET | `/api/tiles/crop-type` | ✅ useTileLayer | /tiles/crop-type | Crop classification |
| GET | `/api/tiles/stress` | ✅ useTileLayer | /tiles/stress | Moisture stress |
| GET | `/api/fields/{id}/advisory` | ✅ MapExplorer | /fields/{id}/advisory | Irrigation recommendation |
| GET | `/api/fields/{id}/timeseries` | ✅ FieldDetail | /fields/{id}/timeseries | 60-day NDVI/stress/deficit |
| GET | `/api/alerts` | ✅ Alerts tab | /alerts | All critical alerts |
| GET | `/api/health` | - | /health | Liveness + GEE status |

---

## Performance Notes

- **Tile URLs cached 24 hours** in PostgreSQL (use `CACHE_TILES=true`)
- **First tile request: 30-60 seconds** (GEE computation)
- **Cached tile requests: <100ms** (instant)
- **Mock tiles always instant** (when `USE_MOCK_GEE=true`)

---

## Production Deployment

### Environment Variables

In production, set these securely (not in `.env`):

**Backend:**
```env
DATABASE_URL=postgresql://prod_user:STRONG_PASSWORD@prod.db.host:5432/cropwise_prod
INTERNAL_API_KEY=GENERATE_NEW_LONG_RANDOM_KEY
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://your-proxy-domain.com
USE_MOCK_GEE=false
GEE_SERVICE_ACCOUNT=your-service-account-email@iam.gserviceaccount.com
GEE_KEY_FILE=/path/to/service-account-key.json
```

**Proxy:**
```env
BACKEND_URL=https://your-backend-api.com
INTERNAL_API_KEY=SAME_AS_BACKEND
ALLOWED_ORIGIN=https://your-frontend-domain.com
```

### Run Backend with Gunicorn

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## Summary

You now have:

✅ PostgreSQL with PostGIS  
✅ FastAPI backend serving GEE tiles + advisories  
✅ Express proxy with security  
✅ React frontend fetching via proxy  
✅ Complete data pipeline: Frontend → Proxy → Backend → DB + GEE  

**Happy farming! 🌾**
