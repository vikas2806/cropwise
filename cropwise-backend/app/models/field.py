from sqlalchemy import (
    Column, Integer, String, Float,
    Date, Text, ForeignKey, DateTime
)
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from datetime import datetime
from app.database import Base


class Field(Base):
    __tablename__ = "fields"

    field_id   = Column(Integer, primary_key=True, index=True)
    zone_name  = Column(String(100), nullable=False)
    crop_type  = Column(String(50))
    area_ha    = Column(Float)
    district   = Column(String(100))
    state      = Column(String(50), default="Maharashtra")
    confidence = Column(Float, default=0.91)
    geom       = Column(Geometry("POLYGON", srid=4326))

    timeseries = relationship("Timeseries", back_populates="field",
                              cascade="all, delete-orphan")
    advisories = relationship("Advisory",   back_populates="field",
                              cascade="all, delete-orphan")
    tile_cache = relationship("TileCache",  back_populates="field",
                              cascade="all, delete-orphan")


class Timeseries(Base):
    __tablename__ = "timeseries"

    ts_id        = Column(Integer, primary_key=True, index=True)
    field_id     = Column(Integer, ForeignKey("fields.field_id"), nullable=False)
    obs_date     = Column(Date, nullable=False)
    ndvi         = Column(Float)
    ndwi         = Column(Float)
    evi          = Column(Float)
    growth_stage = Column(String(30))
    stress_class = Column(String(20))
    deficit_mm   = Column(Float)
    computed_at  = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="timeseries")


class Advisory(Base):
    __tablename__ = "advisories"

    advisory_id       = Column(Integer, primary_key=True, index=True)
    field_id          = Column(Integer, ForeignKey("fields.field_id"), nullable=False)
    issue_date        = Column(Date, nullable=False)
    advisory_status   = Column(String(30))
    timeline_days     = Column(Integer)
    water_amount_mm   = Column(Float)
    duration_hours    = Column(Float)
    best_time         = Column(String(50))
    advisory_text     = Column(Text)
    risk_level        = Column(String(20))
    soil_moisture_pct = Column(Float)
    rainfall_mm       = Column(Float)
    days_since_rain   = Column(Integer)

    field = relationship("Field", back_populates="advisories")


class TileCache(Base):
    """
    Caches GEE tile URLs so the 30-60 second GEE computation
    only happens once. Subsequent requests return instantly.
    tile_url expires after CACHE_TTL_SECONDS (default 24 hours).
    """
    __tablename__ = "tile_cache"

    cache_id    = Column(Integer, primary_key=True, index=True)
    field_id    = Column(Integer, ForeignKey("fields.field_id"),
                         nullable=True)  # null = region-level tile
    cache_key   = Column(String(300), nullable=False, unique=True)
    tile_url    = Column(Text, nullable=False)
    attribution = Column(Text)
    layer_name  = Column(String(100))
    expires_at  = Column(DateTime, nullable=False)
    created_at  = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="tile_cache")
