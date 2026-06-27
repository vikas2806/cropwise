from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import date, timedelta
import math
import logging

from app.models.field import Field, Timeseries, Advisory
from app.gee.stress import (
    detect_growth_stage,
    compute_stress,
    compute_deficit,
    generate_advisory,
)

logger = logging.getLogger(__name__)


def _mock_timeseries(field_id: int, limit: int = 60) -> list:
    """
    Generates realistic mock timeseries when GEE is not available.
    Seeded by field_id so each field gets different values.
    """
    today  = date(2024, 10, 15)
    result = []
    seed   = field_id * 0.3

    for i in range(limit):
        d    = today - timedelta(days=(limit - 1 - i))
        t    = i / (limit - 1)
        ndvi = round(
            0.35 + 0.35 * math.sin(math.pi * t * (1 + seed * 0.1))
            + 0.05 * math.sin(t * 20),
            4,
        )
        ndwi  = round(ndvi * 0.55 + 0.05, 4)
        stage = detect_growth_stage(ndvi, i)
        stress = compute_stress(ndvi, ndwi, stage)
        deficit = compute_deficit(ndvi, ndwi, stage)

        result.append({
            "obs_date":     d,
            "ndvi":         ndvi,
            "ndwi":         ndwi,
            "evi":          round(ndvi * 0.85, 4),
            "growth_stage": stage,
            "stress_class": stress["stress_class"],
            "deficit_mm":   deficit["deficit_mm"],
        })
    return result


def get_timeseries(db: Session,
                   field_id: int,
                   limit: int = 60) -> list:
    """
    Returns timeseries rows.
    Checks DB first. If empty, generates mock data
    and persists it so future calls are instant.
    """
    rows = (
        db.query(Timeseries)
        .filter(Timeseries.field_id == field_id)
        .order_by(desc(Timeseries.obs_date))
        .limit(limit)
        .all()
    )
    if rows:
        return list(reversed(rows))

    field = db.query(Field).filter(
        Field.field_id == field_id
    ).first()
    if not field:
        return []

    mock_rows = _mock_timeseries(field_id, limit)
    orm_rows  = []
    for row in mock_rows:
        ts = Timeseries(
            field_id     = field_id,
            obs_date     = row["obs_date"],
            ndvi         = row["ndvi"],
            ndwi         = row["ndwi"],
            evi          = row["evi"],
            growth_stage = row["growth_stage"],
            stress_class = row["stress_class"],
            deficit_mm   = row["deficit_mm"],
        )
        db.add(ts)
        orm_rows.append(ts)

    db.commit()
    for r in orm_rows:
        db.refresh(r)
    return orm_rows


def get_advisory(db: Session, field_id: int) -> dict | None:
    field = db.query(Field).filter(
        Field.field_id == field_id
    ).first()
    if not field:
        return None

    # Ensure timeseries exists
    get_timeseries(db, field_id)

    latest_ts = (
        db.query(Timeseries)
        .filter(Timeseries.field_id == field_id)
        .order_by(desc(Timeseries.obs_date))
        .first()
    )

    ndvi         = latest_ts.ndvi         if latest_ts else 0.5
    ndwi         = latest_ts.ndwi         if latest_ts else 0.2
    stress_class = latest_ts.stress_class if latest_ts else "Mild"
    deficit_mm   = latest_ts.deficit_mm   if latest_ts else 20.0
    growth_stage = latest_ts.growth_stage if latest_ts else "Vegetative"

    latest_adv = (
        db.query(Advisory)
        .filter(Advisory.field_id == field_id)
        .order_by(desc(Advisory.issue_date))
        .first()
    )

    if not latest_adv:
        adv_data = generate_advisory(deficit_mm, stress_class,
                                     growth_stage)
        new_adv  = Advisory(
            field_id          = field_id,
            issue_date        = date.today(),
            advisory_status   = adv_data["advisory_status"],
            timeline_days     = adv_data["timeline_days"],
            water_amount_mm   = adv_data["water_amount_mm"],
            duration_hours    = adv_data["duration_hours"],
            best_time         = adv_data["best_time"],
            advisory_text     = adv_data["advisory_text"],
            risk_level        = adv_data["risk_level"],
            soil_moisture_pct = round(max(20, min(80, ndwi * 100 + 42)), 1),
            rainfall_mm       = 8.0,
            days_since_rain   = 5,
        )
        db.add(new_adv)
        db.commit()
        db.refresh(new_adv)
        latest_adv = new_adv

    return {
        "field_id":          field.field_id,
        "zone_name":         field.zone_name,
        "crop_type":         field.crop_type,
        "area_ha":           field.area_ha,
        "growth_stage":      growth_stage,
        "ndvi":              ndvi,
        "stress_class":      stress_class,
        "soil_moisture_pct": latest_adv.soil_moisture_pct,
        "rainfall_mm":       latest_adv.rainfall_mm,
        "days_since_rain":   latest_adv.days_since_rain,
        "advisory_status":   latest_adv.advisory_status,
        "timeline_days":     latest_adv.timeline_days,
        "water_amount_mm":   latest_adv.water_amount_mm,
        "duration_hours":    latest_adv.duration_hours,
        "best_time":         latest_adv.best_time,
        "advisory_text":     latest_adv.advisory_text,
    }
