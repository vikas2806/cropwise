from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.field import TimeseriesRow, AdvisoryResponse
from app.services import field_service

router = APIRouter(prefix="/fields", tags=["fields"])

@router.get("/{field_id}/timeseries",
            response_model=List[TimeseriesRow])
def get_timeseries(field_id: int,
                   db: Session = Depends(get_db)):
    rows = field_service.get_timeseries(db, field_id)
    if not rows:
        raise HTTPException(status_code=404,
                            detail="Field not found")
    return rows


@router.get("/{field_id}/advisory",
            response_model=AdvisoryResponse)
def get_advisory(field_id: int,
                 db: Session = Depends(get_db)):
    result = field_service.get_advisory(db, field_id)
    if not result:
        raise HTTPException(status_code=404,
                            detail="Field not found")
    return result
