import ee
import logging
from app.gee.auth import is_gee_ready
from app.config import settings

logger = logging.getLogger(__name__)

GEE_ATTRIBUTION = (
    "Map tiles by Google Earth Engine | "
    "Imagery © Copernicus/ESA Sentinel-2"
)

# ─── MOCK TILE URLS ────────────────────────────────────
# Used when USE_MOCK_GEE=true or GEE is unavailable.
# These are OpenStreetMap-based styled tiles that visually
# approximate what the real GEE tiles look like.
# The frontend will show these until real GEE tiles are ready.

MOCK_TILES = {
    "ndvi": {
        "tile_url":    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "attribution": "Mock NDVI — OpenStreetMap",
        "layer_name":  "NDVI (Mock)",
        "is_mock":     True,
    },
    "crop-type": {
        "tile_url":    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "attribution": "Mock Crop Types — OpenStreetMap",
        "layer_name":  "Crop Types (Mock)",
        "is_mock":     True,
    },
    "stress": {
        "tile_url":    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "attribution": "Mock Stress — OpenStreetMap",
        "layer_name":  "Moisture Stress (Mock)",
        "is_mock":     True,
    },
}


def _get_tile_url(ee_image, viz_params: dict) -> str:
    """
    Core helper — gets tile URL from a GEE image.
    This is what geemap does internally before to_html().
    Returns the full tile URL template string.
    """
    map_id_dict = ee_image.getMapId(viz_params)
    tile_url = map_id_dict['tile_fetcher'].url_format
    return tile_url


def get_ndvi_tiles(
    lon_min: float = 72.6,
    lat_min: float = 15.6,
    lon_max: float = 80.9,
    lat_max: float = 22.0,
    date_start: str = "2023-06-01",
    date_end:   str = "2023-11-30",
) -> dict:
    """
    Replicates get_satellite.py exactly.
    Returns tile URL instead of saving HTML.
    """
    if not is_gee_ready():
        return MOCK_TILES["ndvi"]

    try:
        region = ee.Geometry.Rectangle([lon_min, lat_min, lon_max, lat_max])

        images = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterBounds(region)
            .filterDate(date_start, date_end)
            .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
        )
        clean = images.median()
        ndvi  = clean.normalizedDifference(["B8", "B4"])

        viz = {
            "min":     0,
            "max":     0.8,
            "palette": ["brown", "yellow", "lightgreen", "darkgreen"],
        }

        tile_url = _get_tile_url(ndvi, viz)

        return {
            "tile_url":    tile_url,
            "attribution": GEE_ATTRIBUTION,
            "layer_name":  "NDVI - Crop Health",
            "is_mock":     False,
            "date_start":  date_start,
            "date_end":    date_end,
            "region": {
                "lon_min": lon_min, "lat_min": lat_min,
                "lon_max": lon_max, "lat_max": lat_max,
            },
        }

    except Exception as e:
        logger.error(f"GEE NDVI tile generation failed: {e}")
        return MOCK_TILES["ndvi"]


def get_crop_type_tiles(
    lon_min: float = 73.9,
    lat_min: float = 29.5,
    lon_max: float = 76.9,
    lat_max: float = 32.5,
    kharif_start: str = "2023-06-01",
    kharif_end:   str = "2023-09-30",
    rabi_start:   str = "2023-10-01",
    rabi_end:     str = "2024-01-31",
) -> dict:
    """
    Replicates crop.py exactly.
    Returns crop classification tile URL instead of HTML map.
    """
    if not is_gee_ready():
        return MOCK_TILES["crop-type"]

    try:
        region = ee.Geometry.Rectangle([lon_min, lat_min, lon_max, lat_max])

        kharif = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterBounds(region)
            .filterDate(kharif_start, kharif_end)
            .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
            .median()
        )
        kharif_ndvi = kharif.normalizedDifference(["B8", "B4"])
        kharif_ndwi = kharif.normalizedDifference(["B8", "B11"])

        rabi = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterBounds(region)
            .filterDate(rabi_start, rabi_end)
            .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
            .median()
        )
        rabi_ndvi = rabi.normalizedDifference(["B8", "B4"])

        crop_map = kharif_ndvi.expression(
            "(kharif_ndvi > 0.5 && kharif_ndwi > 0.2) ? 1"
            ": (rabi_ndvi > 0.5) ? 2"
            ": (kharif_ndvi > 0.4 && kharif_ndvi <= 0.6 && kharif_ndwi < 0.2) ? 3"
            ": (kharif_ndvi > 0.7 && rabi_ndvi > 0.6) ? 4"
            ": (kharif_ndvi > 0.5 && kharif_ndvi <= 0.7) ? 5"
            ": 0",
            {
                "kharif_ndvi": kharif_ndvi,
                "kharif_ndwi": kharif_ndwi,
                "rabi_ndvi":   rabi_ndvi,
            },
        ).rename("Crop")

        viz = {
            "min":     0,
            "max":     5,
            "palette": [
                "#8B4513",
                "#00CED1",
                "#FFD700",
                "#FFFFE0",
                "#228B22",
                "#FFA500",
            ],
        }

        tile_url = _get_tile_url(crop_map, viz)

        return {
            "tile_url":    tile_url,
            "attribution": GEE_ATTRIBUTION,
            "layer_name":  "Crop Classification",
            "is_mock":     False,
            "legend": {
                "0": {"label": "Fallow",    "color": "#8B4513"},
                "1": {"label": "Rice",      "color": "#00CED1"},
                "2": {"label": "Wheat",     "color": "#FFD700"},
                "3": {"label": "Cotton",    "color": "#FFFFE0"},
                "4": {"label": "Sugarcane", "color": "#228B22"},
                "5": {"label": "Maize",     "color": "#FFA500"},
            },
        }

    except Exception as e:
        logger.error(f"GEE crop tile generation failed: {e}")
        return MOCK_TILES["crop-type"]


def get_stress_tiles(
    lon_min: float = 72.6,
    lat_min: float = 15.6,
    lon_max: float = 80.9,
    lat_max: float = 22.0,
    date_start: str = "2023-06-01",
    date_end:   str = "2023-11-30",
) -> dict:
    """
    Derives moisture stress from NDWI.
    NDWI = (B8 - B11) / (B8 + B11)
    Low NDWI = drought stress.
    """
    if not is_gee_ready():
        return MOCK_TILES["stress"]

    try:
        region = ee.Geometry.Rectangle([lon_min, lat_min, lon_max, lat_max])

        images = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterBounds(region)
            .filterDate(date_start, date_end)
            .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
        )
        composite = images.median()
        ndwi = composite.normalizedDifference(["B8", "B11"])

        stress_index = ndwi.multiply(-1).add(1).divide(2)

        viz = {
            "min":     0,
            "max":     1,
            "palette": [
                "#639922",
                "#EF9F27",
                "#BA7517",
                "#E24B4A",
            ],
        }

        tile_url = _get_tile_url(stress_index, viz)

        return {
            "tile_url":    tile_url,
            "attribution": GEE_ATTRIBUTION,
            "layer_name":  "Moisture Stress",
            "is_mock":     False,
            "legend": {
                "none":     {"label": "No Stress",       "color": "#639922"},
                "mild":     {"label": "Mild Stress",     "color": "#EF9F27"},
                "moderate": {"label": "Moderate Stress", "color": "#BA7517"},
                "severe":   {"label": "Severe Stress",   "color": "#E24B4A"},
            },
        }

    except Exception as e:
        logger.error(f"GEE stress tile generation failed: {e}")
        return MOCK_TILES["stress"]
