# Quick Start — 5 Minutes

If you just want to get running fast, follow this.

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL (or Supabase/Neon account)

---

## 1. Generate Security Key (1 min)

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Copy the output. You'll need it twice.

---

## 2. Set Up Backend (2 min)

```bash
cd cropwise-backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Create .env from template
cp .env.example .env
```

Edit `.env`:
```env
# Paste your PostgreSQL connection string
DATABASE_URL=postgresql://...

# Paste the key from step 1
INTERNAL_API_KEY=<your_key_here>

# Keep these
USE_MOCK_GEE=true
```

Install and run:
```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend running on **http://localhost:8000** ✅

---

## 3. Set Up Proxy (1 min)

```bash
cd cropwise-ui/proxy-server

cp .env.example .env
```

Edit `.env`:
```env
BACKEND_URL=http://localhost:8000
INTERNAL_API_KEY=<your_key_here>  # Same as backend
```

Install and run:
```bash
npm install
npm start
```

Proxy running on **http://localhost:4000** ✅

---

## 4. Start Frontend (1 min)

```bash
cd cropwise-ui
npm run dev
```

Frontend running on **http://localhost:5173** ✅

---

## 5. Open Browser

Go to **http://localhost:5173**

- Click **Map Explorer**
- Select a field
- See irrigation advice in the panel

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Backend unavailable" | Restart backend: `uvicorn main:app --reload --port 8000` |
| "X-Internal-Key: Forbidden" | Ensure `INTERNAL_API_KEY` is **identical** in both `.env` files |
| "Connection refused" | Check port numbers: backend=8000, proxy=4000, frontend=5173 |
| Tiles not loading | Check browser DevTools Console; set `USE_MOCK_GEE=true` for OSM tiles |

---

## Full Test

Once all three services are running, test in a new terminal:

```bash
cd cropwise-backend
python integration_test.py
```

Should see ✓ all tests pass.

---

That's it! 🚀
