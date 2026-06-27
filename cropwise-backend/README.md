# CropWise AI Backend

FastAPI backend for **CropWise AI** — a satellite-powered irrigation advisory system for Indian farmers.

Uses **Google Earth Engine** for live NDVI/crop/stress satellite tiles, **PostgreSQL** for field data and caching, and **SQLAlchemy** ORM for database access.

## Features

- 🛰️ **Live Satellite Tiles** — NDVI, crop classification, moisture stress via Google Earth Engine
- 💧 **Irrigation Advisories** — Stage-aware water recommendations based on crop stress
- 📊 **60-Day Timeseries** — NDVI, NDWI, growth stage, stress index, water deficit
- 🚨 **Critical Alerts** — Real-time notifications for fields needing immediate irrigation
- ⚡ **Tile Caching** — 24-hour cache in PostgreSQL (first call: 30-60s, cached: <100ms)
- 🔒 **Security** — X-Internal-Key header validation, CORS, rate limiting via proxy

## Quick Start

See **[QUICKSTART.md](./QUICKSTART.md)** for 5-minute setup.

## Full Setup

See **[SETUP.md](./SETUP.md)** for complete architecture, troubleshooting, and production deployment.

## Architecture

```
React Frontend (5173)
    ↓ HTTP /api/tiles/crop-type
Express Proxy (4000)
    ↓ strips /api, injects X-Internal-Key
FastAPI Backend (8000)
    ↓ Python + GEE + SQLAlchemy
PostgreSQL (cropwise_db) + Google Earth Engine API
```

## Endpoints

| Method | Path | Response | Example |
|--------|------|----------|---------|
| GET | `/tiles/ndvi` | GEE NDVI tile URL | `{ "tile_url": "...", "is_mock": false }` |
| GET | `/tiles/crop-type` | Crop classification tile | `{ "tile_url": "...", "legend": {...} }` |
| GET | `/tiles/stress` | Moisture stress tile | `{ "tile_url": "...", "legend": {...} }` |
| GET | `/fields/{id}/advisory` | Irrigation recommendation | `{ "advisory_status": "Irrigate Now", ... }` |
| GET | `/fields/{id}/timeseries` | 60-day NDVI/stress history | `[ { "obs_date": "2024-10-15", "ndvi": 0.45, ... }, ... ]` |
| GET | `/alerts` | Critical alerts | `[ { "id": 1, "risk_level": "critical", ... }, ... ]` |
| GET | `/health` | Liveness + GEE status | `{ "status": "ok", "gee_ready": true }` |

## Project Structure

```
cropwise-backend/
├── main.py                    # FastAPI app, startup/shutdown
├── requirements.txt           # Python dependencies
├── .env.example              # Template (commit this)
├── .env                      # Secrets (git-ignored)
├── SETUP.md                  # Full setup guide
├── QUICKSTART.md             # 5-minute quickstart
├── integration_test.py       # Test connectivity
│
└── app/
    ├── config.py             # Settings from .env
    ├── database.py           # SQLAlchemy engine + session
    ├── models/
    │   └── field.py          # ORM: Field, Timeseries, Advisory, TileCache
    ├── gee/
    │   ├── auth.py           # GEE initialization
    │   ├── tiles.py          # get_ndvi_tiles(), get_crop_type_tiles(), get_stress_tiles()
    │   └── stress.py         # compute_stress(), detect_growth_stage(), generate_advisory()
    ├── schemas/
    │   ├── tiles.py          # Pydantic: TileResponse
    │   ├── field.py          # Pydantic: TimeseriesRow, AdvisoryResponse
    │   └── alerts.py         # Pydantic: AlertResponse
    ├── services/
    │   ├── tile_service.py   # Calls GEE, caches in DB
    │   ├── field_service.py  # Timeseries + advisory logic
    │   └── alert_service.py  # Query critical alerts
    └── routers/
        ├── tiles.py          # GET /tiles/*
        ├── fields.py         # GET /fields/{id}/*
        └── alerts.py         # GET /alerts
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/cropwise_db

# Google Earth Engine
GEE_PROJECT_ID=cropwise-ai-499810
GEE_SERVICE_ACCOUNT=          # Optional: service account email
GEE_KEY_FILE=                 # Optional: path to service account JSON key

# Security
INTERNAL_API_KEY=<long_random_string>    # X-Internal-Key header value
ALLOWED_ORIGINS=http://localhost:4000    # CORS origins

# Behavior
USE_MOCK_GEE=true             # true: return OSM tiles, false: call GEE
CACHE_TILES=true              # Cache tile URLs in DB
CACHE_TTL_SECONDS=86400       # 24 hours
```

## Dependencies

```
FastAPI 0.111.0               # Web framework
Uvicorn 0.29.0                # ASGI server
SQLAlchemy 2.0.30             # ORM
psycopg2-binary 2.9.9         # PostgreSQL driver
GeoAlchemy2 0.15.1            # PostGIS support
Pydantic 2.7.1                # Data validation
earthengine-api 0.1.401       # Google Earth Engine SDK
NumPy, Pandas, Shapely        # Data processing
python-dotenv 1.0.1           # .env loading
```

## Running

### Development

```bash
uvicorn main:app --reload --port 8000
```

Auto-reloads on file changes. Swagger docs at http://localhost:8000/docs

### Production

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Testing

```bash
python integration_test.py
```

Verifies backend ↔ proxy ↔ frontend connectivity.

## Database Schema

**Fields** (8 Maharashtra sample fields seeded automatically)
- `field_id`, `zone_name`, `crop_type`, `area_ha`, `district`, `state`, `confidence`, `geom` (PostGIS polygon)

**Timeseries** (60-day history per field)
- `field_id`, `obs_date`, `ndvi`, `ndwi`, `evi`, `growth_stage`, `stress_class`, `deficit_mm`

**Advisory** (daily recommendation per field)
- `field_id`, `issue_date`, `advisory_status`, `timeline_days`, `water_amount_mm`, `duration_hours`, `best_time`, `advisory_text`, `risk_level`, `soil_moisture_pct`, `rainfall_mm`, `days_since_rain`

**TileCache** (24-hour TTL)
- `field_id`, `cache_key`, `tile_url`, `attribution`, `layer_name`, `expires_at`

## GEE Project

- **Project ID**: `cropwise-ai-499810`
- **Dataset**: Sentinel-2 SR Harmonized (`COPERNICUS/S2_SR_HARMONIZED`)
- **Indices**: NDVI (B8/B4), NDWI (B8/B11), EVI
- **Regions**: Maharashtra & Punjab

## Troubleshooting

See **[SETUP.md](./SETUP.md)** "Troubleshooting" section.

## Contributing

1. Create a feature branch
2. Test with `python integration_test.py`
3. Commit with clear messages
4. Push and create a PR

## License

Built for ISRO Hackathon Challenge 6 — CropWise AI.

---

**Questions?** Check **SETUP.md** or **QUICKSTART.md**.
