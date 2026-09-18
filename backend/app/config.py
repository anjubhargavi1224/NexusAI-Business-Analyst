import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root or backend dir
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(ROOT_DIR / ".env")
load_dotenv()

class Settings:
    PROJECT_NAME: str = "NEXUS AI — Business Intelligence & Decision Support"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DEFAULT_DATASET_PATH: str = str(Path(__file__).resolve().parent.parent / "data" / "nexus_enterprise_sample.csv")
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

settings = Settings()
