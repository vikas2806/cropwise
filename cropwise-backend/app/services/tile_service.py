from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import logging

from app.models.field import TileCache
from app.gee import tiles as gee_tiles
from app.config import settings

logger = logging.getLogger(__name__)


def _cache_key(layer: str, params: dict) -> str:
    parts = [layer] + [f"{k}={v}" for k, v in sorted(params.items())]
    return ":".join(parts)


def _get_cached_tile(db: Session, key: str) -> dict | None:
    row = (
        db.query(TileCache)
        .filter(
            TileCache.cache_key == key,
            TileCache.expires_at > datetime.utcnow(),
        )
        .first()
    )
    if row:
        logger.info(f"Cache HIT for {key}")
        return {
            "tile_url":    row.tile_url,
            "attribution": row.attribution,
            "layer_name":  row.layer_name,
            "is_mock":     False,
        }
    return None


def _save_tile_cache(db: Session, key: str,
                     result: dict, layer_name: str):
    if not settings.cache_tiles:
        return
    expires = datetime.utcnow() + timedelta(
        seconds=settings.cache_ttl_seconds
    )
    existing = db.query(TileCache).filter(
        TileCache.cache_key == key
    ).first()

    if existing:
        existing.tile_url    = result["tile_url"]
        existing.attribution = result.get("attribution", "")
        existing.layer_name  = layer_name
        existing.expires_at  = expires
    else:
        db.add(TileCache(
            cache_key   = key,
            tile_url    = result["tile_url"],
            attribution = result.get("attribution", ""),
            layer_name  = layer_name,
            expires_at  = expires,
        ))
    db.commit()


def get_ndvi_tile(db: Session,
                  date_start: str = "2023-06-01",
                  date_end:   str = "2023-11-30") -> dict:
    key    = _cache_key("ndvi", {"s": date_start, "e": date_end})
    cached = _get_cached_tile(db, key)
    if cached:
        return cached

    result = gee_tiles.get_ndvi_tiles(
        date_start=date_start,
        date_end=date_end,
    )
    if not result.get("is_mock"):
        _save_tile_cache(db, key, result, "NDVI")
    return result


def get_crop_type_tile(db: Session,
                       kharif_start: str = "2023-06-01",
                       kharif_end:   str = "2023-09-30",
                       rabi_start:   str = "2023-10-01",
                       rabi_end:     str = "2024-01-31") -> dict:
    key    = _cache_key("crop", {
        "ks": kharif_start, "ke": kharif_end,
        "rs": rabi_start,   "re": rabi_end,
    })
    cached = _get_cached_tile(db, key)
    if cached:
        return cached

    result = gee_tiles.get_crop_type_tiles(
        kharif_start=kharif_start,
        kharif_end=kharif_end,
        rabi_start=rabi_start,
        rabi_end=rabi_end,
    )
    if not result.get("is_mock"):
        _save_tile_cache(db, key, result, "Crop Types")
    return result


def get_stress_tile(db: Session,
                    date_start: str = "2023-06-01",
                    date_end:   str = "2023-11-30") -> dict:
    key    = _cache_key("stress", {"s": date_start, "e": date_end})
    cached = _get_cached_tile(db, key)
    if cached:
        return cached

    result = gee_tiles.get_stress_tiles(
        date_start=date_start,
        date_end=date_end,
    )
    if not result.get("is_mock"):
        _save_tile_cache(db, key, result, "Moisture Stress")
    return result
