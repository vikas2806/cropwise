from pydantic import BaseModel
from typing import Optional

class AlertResponse(BaseModel):
    id:         int
    field_id:   int
    zone_name:  str
    risk_level: str
    message:    Optional[str] = None
    created_at: Optional[str] = None
