from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.field import Advisory, Field


def get_alerts(db: Session) -> list:
    rows = (
        db.query(Advisory, Field.zone_name)
        .join(Field, Advisory.field_id == Field.field_id)
        .filter(Advisory.risk_level.in_(
            ["critical", "high", "medium"]
        ))
        .order_by(Advisory.risk_level, desc(Advisory.issue_date))
        .limit(20)
        .all()
    )

    result = []
    for adv, zone_name in rows:
        result.append({
            "id":         adv.advisory_id,
            "field_id":   adv.field_id,
            "zone_name":  zone_name,
            "risk_level": adv.risk_level,
            "message":    adv.advisory_text,
            "created_at": (
                adv.issue_date.isoformat()
                if adv.issue_date else None
            ),
        })
    return result
