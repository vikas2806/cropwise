# CropWise AI — Setup Checklist

Use this checklist to track your setup progress. Print it, or follow it section by section.

---

## Pre-Setup

- [ ] You have Python 3.8+ installed (`python --version`)
- [ ] You have Node.js 16+ installed (`node --version`)
- [ ] You have Git installed
- [ ] You have a PostgreSQL account (local, Supabase, or Neon)
- [ ] You have cloned the repo: `git clone ...`

---

## Step 1: Database Setup

- [ ] Database created (`cropwise_db` or your name)
- [ ] PostGIS extension enabled: `CREATE EXTENSION IF NOT EXISTS postgis;`
- [ ] Connection string copied, e.g.:
  ```
  postgresql://user:password@host:5432/cropwise_db
  ```

---

## Step 2: Generate Security Key

Run in terminal:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

- [ ] Key generated
- [ ] Key saved (e.g., in a temp file)
- [ ] Key copied to clipboard or noted

---

## Step 3: Backend Setup

### 3.1 Create Virtual Environment

```bash
cd cropwise-backend
python -m venv venv
```

- [ ] `venv/` folder created in `cropwise-backend/`

### 3.2 Activate Virtual Environment

```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

- [ ] Terminal shows `(venv)` prefix

### 3.3 Create .env File

```bash
cp .env.example .env
```

- [ ] `.env` file created in `cropwise-backend/`

### 3.4 Edit .env with Your Values

Edit `cropwise-backend/.env`:

```env
DATABASE_URL=postgresql://...  ← Paste your DB connection string here
INTERNAL_API_KEY=...           ← Paste the key from Step 2
ALLOWED_ORIGINS=http://localhost:4000,http://localhost:5173
USE_MOCK_GEE=true
CACHE_TILES=true
CACHE_TTL_SECONDS=86400
```

- [ ] DATABASE_URL filled
- [ ] INTERNAL_API_KEY filled
- [ ] File saved

### 3.5 Install Dependencies

```bash
pip install -r requirements.txt
```

- [ ] No errors during installation
- [ ] All packages installed (takes ~2–5 minutes)

### 3.6 Test Backend Startup

```bash
uvicorn main:app --reload --port 8000
```

- [ ] Server starts without errors
- [ ] You see: `Uvicorn running on http://127.0.0.1:8000`
- [ ] Database tables created automatically
- [ ] 8 sample fields seeded
- [ ] GEE initialization message appears (or "USE_MOCK_GEE=true")
- [ ] Keep terminal open (backend running)

---

## Step 4: Proxy Server Setup

### 4.1 Navigate to Proxy Folder

```bash
cd cropwise-ui/proxy-server
```

- [ ] You're in `cropwise-ui/proxy-server/`

### 4.2 Create .env File

```bash
cp .env.example .env
```

- [ ] `.env` file created

### 4.3 Edit .env with Your Values

Edit `cropwise-ui/proxy-server/.env`:

```env
BACKEND_URL=http://localhost:8000
PROXY_PORT=4000
ALLOWED_ORIGIN=http://localhost:5173
INTERNAL_API_KEY=...  ← PASTE SAME KEY AS BACKEND
```

- [ ] BACKEND_URL = http://localhost:8000
- [ ] PROXY_PORT = 4000
- [ ] INTERNAL_API_KEY matches backend exactly
- [ ] File saved

### 4.4 Install Dependencies

```bash
npm install
```

- [ ] No errors during installation
- [ ] `node_modules/` folder created

### 4.5 Test Proxy Startup

```bash
npm start
```

- [ ] Server starts without errors
- [ ] You see: `Proxy running on port 4000 → http://localhost:8000`
- [ ] Keep terminal open (proxy running)

---

## Step 5: Frontend Setup

### 5.1 Navigate to Frontend Folder

```bash
cd cropwise-ui
```

- [ ] You're in `cropwise-ui/`

### 5.2 Install Dependencies

```bash
npm install
```

- [ ] No errors
- [ ] `node_modules/` folder created

### 5.3 Verify Frontend .env

Check `cropwise-ui/.env`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_USE_MOCK=false
```

- [ ] `.env` already configured correctly
- [ ] No changes needed

### 5.4 Start Frontend

```bash
npm run dev
```

- [ ] Server starts without errors
- [ ] You see: `Local: http://localhost:5173/`
- [ ] Keep terminal open (frontend running)

---

## Step 6: Verification

### 6.1 Open Browser

Open **http://localhost:5173** in your browser.

- [ ] Frontend loads without errors
- [ ] You see CropWise AI home page
- [ ] No red error messages in console

### 6.2 Navigate to Map Explorer

- [ ] Click **Map Explorer** in sidebar
- [ ] Map loads with field boundaries
- [ ] OpenStreetMap base layer visible

### 6.3 Test Tile Layers

- [ ] Click **Crop Type** button → Map updates
- [ ] Click **Stress** button → Map updates
- [ ] Click **Advisory** button → Map updates
- [ ] No console errors

### 6.4 Select a Field

- [ ] Click any field polygon
- [ ] Right panel shows field details
- [ ] Advisory text visible
- [ ] Water recommendation shown

### 6.5 Check Alerts Tab

- [ ] Click **Alerts** in top tab
- [ ] Alert list shows fields with critical/high/medium risk
- [ ] Each alert has risk level and message

### 6.6 Run Integration Test

In a new terminal:

```bash
cd cropwise-backend
python integration_test.py
```

- [ ] All ✓ tests pass
- [ ] Output: "All tests PASSED!"

---

## Step 7: Celebrate! 🎉

- [ ] Backend running on port 8000 ✅
- [ ] Proxy running on port 4000 ✅
- [ ] Frontend running on port 5173 ✅
- [ ] All tests passing ✅
- [ ] Map showing satellite tiles ✅
- [ ] Advisories displaying ✅
- [ ] Alerts showing ✅

**You're done!** The entire CropWise AI stack is running. 🚀

---

## Optional: Next Steps

- [ ] Read [API.md](../cropwise-backend/API.md) to understand all endpoints
- [ ] Review [SETUP.md](../cropwise-backend/SETUP.md) for production deployment
- [ ] Enable real GEE by setting `USE_MOCK_GEE=false` and running `python -c "import ee; ee.Authenticate()"`
- [ ] Deploy backend to production (Heroku, AWS, DigitalOcean, etc.)
- [ ] Deploy proxy to production
- [ ] Deploy frontend to production

---

## Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| Backend won't start | Check DATABASE_URL in .env; run `python -m venv venv` |
| Proxy won't start | Ensure INTERNAL_API_KEY matches backend; check port 4000 free |
| Frontend won't load | Check VITE_API_BASE_URL in .env; check proxy running |
| "Forbidden" errors | INTERNAL_API_KEY mismatch; ensure identical in both .env files |
| Tiles not loading | Check browser DevTools Console; set USE_MOCK_GEE=true |

See [SETUP.md](../cropwise-backend/SETUP.md) for detailed troubleshooting.

---

## Support

- 📖 Read [README.md](../cropwise-backend/README.md)
- ⚡ Follow [QUICKSTART.md](../cropwise-backend/QUICKSTART.md)
- 📚 Check [API.md](../cropwise-backend/API.md)
- 🔧 Review [SETUP.md](../cropwise-backend/SETUP.md)

---

**Print this checklist and check off each item as you go. Good luck! 🌾**
