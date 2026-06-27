from pydantic import BaseModel
from datetime import date
from typing import Optional

class TimeseriesRow(BaseModel):
    obs_date:     date
    ndvi:         Optional[float] = None
    ndwi:         Optional[float] = None
    evi:          Optional[float] = None
    growth_stage: Optional[str]   = None
    stress_class: Optional[str]   = None
    deficit_mm:   Optional[float] = None

    class Config:
        from_attributes = True


class AdvisoryResponse(BaseModel):
    field_id:          int
    zone_name:         str
    crop_type:         Optional[str]   = None
    area_ha:           Optional[float] = None
    growth_stage:      Optional[str]   = None
    ndvi:              Optional[float] = None
    stress_class:      Optional[str]   = None
    soil_moisture_pct: Optional[float] = None
    rainfall_mm:       Optional[float] = None
    days_since_rain:   Optional[int]   = None
    advisory_status:   Optional[str]   = None
    timeline_days:     Optional[int]   = None
    water_amount_mm:   Optional[float] = None
    duration_hours:    Optional[float] = None
    best_time:         Optional[str]   = None
    advisory_text:     Optional[str]   = None

    class Config:
        from_attributes = True
