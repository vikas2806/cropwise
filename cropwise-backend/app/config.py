from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database — user pastes their PostgreSQL URL here
    database_url: str

    # GEE
    gee_project_id:      str            = "cropwise-ai-499810"
    gee_service_account: Optional[str]  = None
    gee_key_file:        Optional[str]  = None

    # Security
    internal_api_key: str
    allowed_origins:  str = "http://localhost:4000"

    # Behaviour
    use_mock_gee:       bool = True
    cache_tiles:        bool = True
    cache_ttl_seconds:  int  = 86400

    class Config:
        env_file = ".env"

settings = Settings()

ALLOWED_ORIGINS_LIST = [
    origin.strip()
    for origin in settings.allowed_origins.split(",")
]
