import ee
import logging
from app.config import settings

logger = logging.getLogger(__name__)
_gee_initialized = False


def initialize_gee():
    global _gee_initialized
    if _gee_initialized:
        return True

    project = settings.gee_project_id

    try:
        if settings.gee_service_account and settings.gee_key_file:
            # Production: service account auth
            credentials = ee.ServiceAccountCredentials(
                settings.gee_service_account,
                settings.gee_key_file,
            )
            ee.Initialize(credentials=credentials, project=project)
            logger.info("GEE initialized via service account")
        else:
            # Development: user credential auth
            # Requires running authenticate.py once beforehand
            # Same as the existing authenticate.py script
            ee.Initialize(project=project)
            logger.info(f"GEE initialized — project: {project}")

        _gee_initialized = True
        return True

    except Exception as e:
        logger.error(f"GEE initialization failed: {e}")
        if not settings.use_mock_gee:
            raise RuntimeError(
                f"GEE failed and USE_MOCK_GEE=false. "
                f"Run authenticate.py first. Error: {e}"
            )
        logger.warning(
            "USE_MOCK_GEE=true — continuing without GEE. "
            "Mock tile URLs will be returned."
        )
        return False


def is_gee_ready() -> bool:
    return _gee_initialized
