from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.tiles import TileResponse
from app.services import tile_service

router = APIRouter(prefix="/tiles", tags=["tiles"])

@router.get("/ndvi", response_model=TileResponse)
def get_ndvi_tile(
    date_start: str = Query(default="2023-06-01",
                            description="YYYY-MM-DD"),
    date_end:   str = Query(default="2023-11-30",
                            description="YYYY-MM-DD"),
    db: Session = Depends(get_db),
):
    return tile_service.get_ndvi_tile(db, date_start, date_end)


@router.get("/crop-type", response_model=TileResponse)
def get_crop_type_tile(
    kharif_start: str = Query(default="2023-06-01"),
    kharif_end:   str = Query(default="2023-09-30"),
    rabi_start:   str = Query(default="2023-10-01"),
    rabi_end:     str = Query(default="2024-01-31"),
    db: Session = Depends(get_db),
):
    return tile_service.get_crop_type_tile(
        db, kharif_start, kharif_end, rabi_start, rabi_end
    )


@router.get("/stress", response_model=TileResponse)
def get_stress_tile(
    date_start: str = Query(default="2023-06-01"),
    date_end:   str = Query(default="2023-11-30"),
    db: Session = Depends(get_db),
):
    return tile_service.get_stress_tile(db, date_start, date_end)
