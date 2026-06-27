from pydantic import BaseModel
from typing import Optional, Dict, Any

class TileResponse(BaseModel):
    tile_url:    str
    attribution: str
    layer_name:  str
    is_mock:     bool = False
    legend:      Optional[Dict[str, Any]] = None
    date_start:  Optional[str] = None
    date_end:    Optional[str] = None
