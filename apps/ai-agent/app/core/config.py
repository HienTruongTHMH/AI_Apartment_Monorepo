from typing import Optional
from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    # API Keys
    gemini_api_key: str = ""
    openrouter_api_key: str = ""
    qdrant_api_key: Optional[str] = None

    # Connections
    redis_url: str = "redis://localhost:6379/0"
    qdrant_url: str = "https://4e23d033-1adc-41dc-9039-86240152ed61.australia-southeast1-0.gcp.cloud.qdrant.io"

    # App Info
    app_name: str = "Agent 1 - Listing Verifier"
    app_version: str = "1.0.0"

    # Server Config
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

settings = Settings()