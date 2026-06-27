from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import text

from app.config import settings, ALLOWED_ORIGINS_LIST
from app.database import engine, Base, SessionLocal
from app.gee.auth import initialize_gee, is_gee_ready
from app.routers import tiles, fields, alerts
from app.models.field import Field


def seed_fields(db):
    """
    Inserts 8 sample Maharashtra fields on first run.
    Skips if fields already exist.
    """
    count = db.query(Field).count()
    if count > 0:
        return

    fields_data = [
        ("Vidarbha-Rice-01",    "Rice",    2340, "Nagpur",
         78.960, 21.100, 78.975, 21.115),
        ("Wardha-Cotton-02",    "Cotton",  1850, "Wardha",
         78.990, 21.100, 79.005, 21.115),
        ("Amravati-Wheat-03",   "Wheat",   1200, "Amravati",
         79.020, 21.100, 79.035, 21.115),
        ("Nagpur-Soybean-04",   "Soybean",  980, "Nagpur",
         78.960, 21.130, 78.975, 21.145),
        ("Amravati-Soybean-05", "Soybean", 1560, "Amravati",
         78.990, 21.130, 79.005, 21.145),
        ("Yavatmal-Cotton-06",  "Cotton",  2100, "Yavatmal",
         79.020, 21.130, 79.035, 21.145),
        ("Buldhana-Wheat-07",   "Wheat",    870, "Buldhana",
         78.960, 21.160, 78.975, 21.175),
        ("Washim-Rice-08",      "Rice",    1430, "Washim",
         78.990, 21.160, 79.005, 21.175),
    ]

    for zone, crop, area, district, x1, y1, x2, y2 in fields_data:
        wkt = (
            f"POLYGON(({x1} {y1},{x2} {y1},"
            f"{x2} {y2},{x1} {y2},{x1} {y1}))"
        )
        db.execute(
            text(
                "INSERT INTO fields "
                "(zone_name,crop_type,area_ha,district,state," 
                "confidence,geom) VALUES "
                "(:zone,:crop,:area,:district,'Maharashtra',"
                "0.91,ST_GeomFromText(:wkt,4326))"
            ),
            {
                "zone":     zone,
                "crop":     crop,
                "area":     area,
                "district": district,
                "wkt":      wkt,
            },
        )
    db.commit()
    print(f"Seeded {len(fields_data)} fields")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Create all tables (safe to run multiple times)
    Base.metadata.create_all(bind=engine)

    # 2. Seed fields if empty
    db = SessionLocal()
    try:
        seed_fields(db)
    finally:
        db.close()

    # 3. Initialize GEE
    initialize_gee()

    yield
    # Shutdown — nothing to clean up


app = FastAPI(
    title="CropWise AI API",
    description="Backend for CropWise AI — ISRO Hackathon Challenge 6",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow only the proxy server
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS_LIST,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Internal key validation
# The proxy server injects X-Internal-Key on every request
# FastAPI rejects anything without it
@app.middleware("http")
async def verify_internal_key(request: Request, call_next):
    # Skip check for public/browser paths that should not require the internal header
    path = request.url.path
    public_paths = ["/health", "/docs", "/openapi.json", "/redoc", "/favicon.ico"]
    if path in public_paths or path.startswith("/docs/") or path.startswith("/redoc/"):
        return await call_next(request)

    key = request.headers.get("X-Internal-Key", "")
    if key != settings.internal_api_key:
        raise HTTPException(status_code=403,
                            detail="Forbidden")
    return await call_next(request)

# Register routers
app.include_router(tiles.router)
app.include_router(fields.router)
app.include_router(alerts.router)


@app.get("/health")
def health():
    return {
        "status":    "ok",
        "version":   "1.0.0",
        "gee_ready": is_gee_ready(),
    }
