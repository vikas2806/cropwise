import math

GROWTH_STAGES = ["Sowing", "Vegetative", "Flowering", "Maturity"]

# Stage sensitivity from ISRO blueprint
# Flowering stage is most sensitive to water stress
STAGE_SENSITIVITY = {
    "Sowing":     0.8,
    "Vegetative": 1.0,
    "Flowering":  1.4,
    "Maturity":   0.9,
}

# FAO-56 Kc values per stage (lookup table, not learned)
KC_TABLE = {
    "Sowing":     0.4,
    "Vegetative": 0.8,
    "Flowering":  1.15,
    "Maturity":   0.7,
}


def detect_growth_stage(ndvi: float, day_of_season: int) -> str:
    if day_of_season < 20 or ndvi < 0.25:
        return "Sowing"
    elif ndvi < 0.45:
        return "Vegetative"
    elif ndvi >= 0.45 and day_of_season < 90:
        return "Flowering"
    else:
        return "Maturity"


def compute_stress(ndvi: float, ndwi: float,
                   growth_stage: str) -> dict:
    """
    Stage-conditioned stress index.
    Key insight from ISRO blueprint: same NDVI drop at
    Flowering is weighted 1.4x vs Vegetative.
    """
    ndvi_min, ndvi_max = 0.1, 0.85
    vci = max(0.0, min(1.0,
              (ndvi - ndvi_min) / (ndvi_max - ndvi_min)))
    smi = max(0.0, min(1.0, (ndwi + 0.5)))

    weight = STAGE_SENSITIVITY.get(growth_stage, 1.0)
    cwsi   = weight * (1.0 - (0.6 * vci + 0.4 * smi))
    cwsi   = max(0.0, min(1.0, cwsi))

    if cwsi < 0.25:
        stress_class = "None"
    elif cwsi < 0.50:
        stress_class = "Mild"
    elif cwsi < 0.75:
        stress_class = "Moderate"
    else:
        stress_class = "Severe"

    return {
        "stress_class":  stress_class,
        "stress_index":  round(cwsi, 3),
        "vci":           round(vci, 3),
    }


def compute_deficit(ndvi: float, ndwi: float,
                    growth_stage: str,
                    et0_mm: float = 5.0) -> dict:
    """FAO-56 simplified dual crop coefficient."""
    kc         = KC_TABLE.get(growth_stage, 0.8)
    etc_mm     = kc * et0_mm * 8
    soil_mm    = max(0.0, ndwi * 30)
    deficit_mm = max(0.0, etc_mm - soil_mm)
    return {
        "deficit_mm": round(deficit_mm, 1),
        "etc_mm":     round(etc_mm, 1),
        "kc":         round(kc, 2),
    }


def generate_advisory(deficit_mm: float,
                      stress_class: str,
                      growth_stage: str,
                      rainfall_forecast_mm: float = 0.0) -> dict:
    """
    Rule-based irrigation advisory.
    Plain English output — the AI Irrigation Copilot.
    Transparent, explainable, not a black box.
    """
    if stress_class == "Severe" or deficit_mm > 40:
        status        = "Irrigate Now"
        timeline_days = 1
        water_mm      = round(deficit_mm * 1.1, 1)
        risk          = "critical"
        text = (
            f"Critical water deficit of {deficit_mm:.0f}mm detected "
            f"with severe stress at {growth_stage} stage. "
            f"Irrigate immediately to prevent yield loss."
        )
    elif stress_class == "Moderate" or deficit_mm > 20:
        if rainfall_forecast_mm > 15:
            status        = "No Action"
            timeline_days = 7
            water_mm      = 0.0
            risk          = "medium"
            text = (
                f"Moderate deficit of {deficit_mm:.0f}mm detected but "
                f"{rainfall_forecast_mm:.0f}mm rainfall is forecast. "
                f"Monitor — irrigate only if rain does not arrive."
            )
        else:
            status        = "Irrigate Soon"
            timeline_days = 3
            water_mm      = round(deficit_mm * 1.05, 1)
            risk          = "high"
            text = (
                f"Water deficit of {deficit_mm:.0f}mm with moderate "
                f"stress at {growth_stage} stage. "
                f"Irrigate within {timeline_days} days with "
                f"{water_mm:.0f}mm to maintain yield."
            )
    else:
        status        = "No Action"
        timeline_days = 7
        water_mm      = 0.0
        risk          = "low"
        text = (
            f"Crop water balance is adequate. "
            f"Deficit: {deficit_mm:.0f}mm. "
            f"No irrigation needed this week."
        )

    return {
        "advisory_status":   status,
        "timeline_days":     timeline_days,
        "water_amount_mm":   water_mm,
        "duration_hours":    round(water_mm / 10, 1),
        "best_time":         "4:00–8:00 AM",
        "advisory_text":     text,
        "risk_level":        risk,
    }
