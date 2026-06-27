from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.alerts import AlertResponse
from app.services import alert_service

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    return alert_service.get_alerts(db)
