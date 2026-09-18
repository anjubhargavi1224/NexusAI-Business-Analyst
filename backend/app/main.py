import os
from pathlib import Path
from typing import Optional, Dict, Any
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from .config import settings
from .data_loader import DataLoader
from .analytics_engine import AnalyticsEngine
from .ml_engine import MLEngine
from .anomaly_detector import AnomalyDetector
from .recommendation_engine import RecommendationEngine
from .ai_analyst import AIBusinessAnalyst
from .report_generator import ExecutiveReportGenerator

# In-Memory State Container
class State:
    def __init__(self):
        self.loader: Optional[DataLoader] = None
        self.analytics: Optional[AnalyticsEngine] = None
        self.ml: Optional[MLEngine] = None
        self.anomalies: Optional[AnomalyDetector] = None
        self.recommendations: Optional[RecommendationEngine] = None
        self.ai_analyst: Optional[AIBusinessAnalyst] = None
        self.current_dataset_name: Optional[str] = None
        self.is_demo_dataset: bool = False
        self.is_analyzed: bool = False
        self.validation_result: Optional[Dict[str, Any]] = None
        self.results: Dict[str, Any] = {}

state = State()

def _refresh_engines():
    """Refreshes analytical and machine learning engines with current active dataset."""
    if not state.loader or state.loader.df is None:
        return
    df_clean = state.loader.get_clean_dataframe()
    schema = state.loader.schema

    state.analytics = AnalyticsEngine(df_clean, schema)
    state.ml = MLEngine(df_clean, schema)
    state.anomalies = AnomalyDetector(df_clean, schema)
    state.results = {}

def execute_analysis_pipeline() -> Dict[str, Any]:
    """
    Executes the complete end-to-end analytical & ML pipeline with clear stage logging.
    Guarantees every stage either completes or raises an explicit exception with stage details.
    """
    if not state.loader or state.loader.df is None:
        raise ValueError("No dataset loaded to analyze.")

    print("[ANALYSIS] Starting dataset validation", flush=True)
    try:
        validation_summary = state.loader.get_validation_summary()
        state.validation_result = validation_summary
        _refresh_engines()
        print("[ANALYSIS] Dataset validation complete", flush=True)
    except Exception as e:
        print(f"[ANALYSIS] Error at dataset validation: {str(e)}", flush=True)
        raise RuntimeError(f"Dataset Validation failed: {str(e)}") from e

    print("[ANALYSIS] Starting KPI calculation", flush=True)
    try:
        kpis = state.analytics.compute_executive_kpis()
        trends = state.analytics.compute_trends_and_breakdowns()
        print("[ANALYSIS] KPI calculation complete", flush=True)
    except Exception as e:
        print(f"[ANALYSIS] Error at KPI calculation: {str(e)}", flush=True)
        raise RuntimeError(f"Business KPI Calculation failed: {str(e)}") from e

    print("[ANALYSIS] Starting customer segmentation", flush=True)
    try:
        segmentation = state.ml.perform_customer_segmentation(n_clusters=4)
        print("[ANALYSIS] Customer segmentation complete", flush=True)
    except Exception as e:
        print(f"[ANALYSIS] Error at customer segmentation: {str(e)}", flush=True)
        raise RuntimeError(f"Customer Segmentation failed: {str(e)}") from e

    print("[ANALYSIS] Starting churn prediction", flush=True)
    try:
        churn_model = state.ml.train_churn_model()
        print("[ANALYSIS] Churn prediction complete", flush=True)
    except Exception as e:
        print(f"[ANALYSIS] Error at churn prediction: {str(e)}", flush=True)
        raise RuntimeError(f"Churn Prediction failed: {str(e)}") from e

    print("[ANALYSIS] Starting anomaly detection", flush=True)
    try:
        anomalies = state.anomalies.detect_business_anomalies()
        print("[ANALYSIS] Anomaly detection complete", flush=True)
    except Exception as e:
        print(f"[ANALYSIS] Error at anomaly detection: {str(e)}", flush=True)
        raise RuntimeError(f"Anomaly Detection failed: {str(e)}") from e

    print("[ANALYSIS] Starting recommendations", flush=True)
    try:
        df_clean = state.loader.get_clean_dataframe()
        rec_engine = RecommendationEngine(df_clean, kpis, segmentation, churn_model)
        recommendations = rec_engine.generate_recommendations()
        state.recommendations = rec_engine
        print("[ANALYSIS] Recommendations complete", flush=True)
    except Exception as e:
        print(f"[ANALYSIS] Error at recommendations: {str(e)}", flush=True)
        raise RuntimeError(f"Recommendation Engine failed: {str(e)}") from e

    print("[ANALYSIS] Starting AI analyst", flush=True)
    try:
        # Grounded AI Business Analyst (deterministic fallback or Gemini with strict timeout)
        analyst = AIBusinessAnalyst(kpis, segmentation, churn_model, anomalies, recommendations)
        state.ai_analyst = analyst
        print("[ANALYSIS] AI analyst complete", flush=True)
    except Exception as e:
        print(f"[ANALYSIS] Non-critical warning at AI analyst: {str(e)}", flush=True)
        print("[ANALYSIS] Continuing with core analytics (AI analyst non-blocking fallback)", flush=True)

    print("[ANALYSIS] Analysis finished", flush=True)

    results = {
        "kpis": kpis,
        "trends": trends,
        "segmentation": segmentation,
        "churn": churn_model,
        "anomalies": anomalies,
        "recommendations": recommendations,
        "quality": state.loader.quality_report,
        "validation": state.validation_result
    }
    state.results = results
    state.is_analyzed = True
    return results

def init_default_dataset():
    """Explicitly initializes default enterprise sample dataset when requested."""
    sample_path = settings.DEFAULT_DATASET_PATH
    if not os.path.exists(sample_path):
        from ..data.generate_sample_data import generate_enterprise_data
        generate_enterprise_data(1600, sample_path)
    
    state.loader = DataLoader.from_csv_path(sample_path)
    state.current_dataset_name = "nexus_enterprise_sample.csv"
    state.is_demo_dataset = True
    execute_analysis_pipeline()

def _check_analyzed():
    """Validates that a dataset has been uploaded and analyzed before querying analytical routes."""
    if state.loader is None or not state.is_analyzed or state.analytics is None:
        raise HTTPException(
            status_code=400,
            detail="No analyzed dataset available. Please upload a business CSV and click 'Analyze Data', or explore with the demo dataset."
        )

# FastAPI Application (Starts in clean initial state without preloaded demo data)
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Executive Decision Intelligence & Machine Learning Platform"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- API ROUTES ----------------- #

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "has_dataset": state.loader is not None,
        "dataset_loaded": state.loader is not None and state.is_analyzed,
        "is_demo": state.is_demo_dataset,
        "is_analyzed": state.is_analyzed,
        "current_dataset": state.current_dataset_name,
        "gemini_api_configured": bool(settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 10)
    }

@app.get("/api/status")
def get_system_status():
    """Returns the current workflow state (no-data, uploaded-not-analyzed, analyzed, or demo)."""
    return {
        "has_dataset": state.loader is not None,
        "dataset_name": state.current_dataset_name,
        "is_demo": state.is_demo_dataset,
        "is_analyzed": state.is_analyzed,
        "validation": state.validation_result,
        "quality_report": state.loader.quality_report if state.loader else None
    }

@app.post("/api/dataset/load-demo")
@app.get("/api/dataset/sample")
def load_demo_dataset():
    """Explicitly loads bundled enterprise demo dataset upon user request."""
    init_default_dataset()
    return {
        "message": "Demo enterprise dataset loaded and analyzed successfully",
        "dataset_name": state.current_dataset_name,
        "is_demo": True,
        "is_analyzed": True,
        "validation": state.validation_result,
        "quality_report": state.loader.quality_report
    }

@app.post("/api/dataset/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """Handles custom user CSV uploads, audits schema, and produces validation panel metadata."""
    if not file.filename.lower().endswith((".csv", ".txt")):
        raise HTTPException(status_code=400, detail="Only valid CSV files (.csv) are supported.")
    
    try:
        contents = await file.read()
        if not contents or len(contents.strip()) == 0:
            raise HTTPException(status_code=400, detail="The uploaded file is empty. Please select a populated CSV file.")
        
        loader = DataLoader.from_csv_bytes(contents, filename=file.filename)
        validation = loader.get_validation_summary()

        if not validation["is_valid_for_analysis"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Upload failed: Dataset must contain at least 5 rows and recognizable metrics. Found {validation['total_rows']} rows and {validation['total_columns']} columns."
            )

        # Store validated loader; wait for explicit "Analyze Data" action before running heavy ML
        state.loader = loader
        state.current_dataset_name = file.filename
        state.is_demo_dataset = False
        state.is_analyzed = False
        state.validation_result = validation
        state.analytics = None
        state.ml = None
        state.anomalies = None
        state.recommendations = None

        return {
            "message": f"Successfully loaded and validated '{file.filename}'",
            "dataset_name": file.filename,
            "validation": validation,
            "quality_report": loader.quality_report
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Upload failed. Please check that your file is a valid CSV: {str(e)}")

@app.post("/api/dataset/analyze")
def analyze_dataset():
    """Executes full business KPI computation, K-Means clustering, and predictive ML models on the active dataset."""
    if not state.loader or state.loader.df is None:
        raise HTTPException(
            status_code=400,
            detail={
                "stage": "Dataset Ingestion",
                "error": "No dataset uploaded to analyze. Please upload a CSV first."
            }
        )
    
    try:
        results = execute_analysis_pipeline()
        return {
            "message": "Analysis completed successfully across all analytical and ML pipelines.",
            "dataset_name": state.current_dataset_name,
            "is_analyzed": True,
            "results": {
                "kpis": results["kpis"],
                "trends": results["trends"],
                "segmentation": results["segmentation"],
                "churn": results["churn"],
                "anomalies": results["anomalies"],
                "recommendations": results["recommendations"]
            }
        }
    except RuntimeError as e:
        msg = str(e)
        stage_name = "Analysis Pipeline"
        clean_msg = msg
        if ":" in msg:
            parts = msg.split(":", 1)
            stage_name = parts[0].replace(" failed", "").strip()
            clean_msg = parts[1].strip()

        raise HTTPException(
            status_code=422,
            detail={
                "stage": stage_name,
                "error": clean_msg
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "stage": "Analytics Engine",
                "error": f"Unexpected analysis error: {str(e)}"
            }
        )

@app.post("/api/dataset/reset")
def reset_dataset():
    """Resets the workspace to its clean initial state."""
    state.loader = None
    state.analytics = None
    state.ml = None
    state.anomalies = None
    state.recommendations = None
    state.ai_analyst = None
    state.current_dataset_name = None
    state.is_demo_dataset = False
    state.is_analyzed = False
    state.validation_result = None
    state.results = {}
    return {"message": "Workspace reset to initial state.", "has_dataset": False}

@app.get("/api/dataset/quality")
def get_data_quality():
    """Returns dataset profiling and quality audit results."""
    if not state.loader:
        raise HTTPException(status_code=400, detail="No dataset loaded.")
    return {
        "dataset_name": state.current_dataset_name,
        "is_demo": state.is_demo_dataset,
        "quality_report": state.loader.quality_report,
        "validation": state.validation_result or state.loader.get_validation_summary(),
        "schema": state.loader.schema
    }

@app.get("/api/analytics/executive")
def get_executive_kpis():
    """Returns deterministic macro executive KPIs."""
    _check_analyzed()
    if state.results and "kpis" in state.results:
        return state.results["kpis"]
    return state.analytics.compute_executive_kpis()

@app.get("/api/analytics/trends")
def get_trends_and_breakdowns():
    """Returns trend lines, category distribution, and risk cohort breakdowns."""
    _check_analyzed()
    if state.results and "trends" in state.results:
        return state.results["trends"]
    return state.analytics.compute_trends_and_breakdowns()

@app.get("/api/ml/segmentation")
def get_customer_segmentation(k: int = 4):
    """Executes K-Means behavioral segmentation and persona tagging."""
    _check_analyzed()
    if state.results and "segmentation" in state.results and k == 4:
        return state.results["segmentation"]
    return state.ml.perform_customer_segmentation(n_clusters=k)

@app.get("/api/ml/churn-model")
def get_churn_model():
    """Trains and returns Scikit-learn Random Forest model metrics & confusion matrix."""
    _check_analyzed()
    if state.results and "churn" in state.results:
        return state.results["churn"]
    return state.ml.train_churn_model()

class WhatIfRequest(BaseModel):
    days_since_last_active: float = 25.0
    order_count: float = 12.0
    avg_order_value: float = 2400.0
    support_tickets: float = 2.0
    avg_resolution_hrs: float = 14.0
    nps_score: float = 8.0
    discount_pct: float = 10.0
    contract_type: str = "Annual Prepaid"

@app.post("/api/ml/what-if")
def simulate_what_if(req: WhatIfRequest):
    """Dynamically simulates churn risk for adjusted customer scenario sliders."""
    _check_analyzed()
    return state.ml.simulate_churn_risk(req.model_dump())

@app.get("/api/anomalies")
def get_anomalies():
    """Returns detected business anomalies and risk alerts."""
    _check_analyzed()
    if state.results and "anomalies" in state.results:
        anoms = state.results["anomalies"]
    else:
        anoms = state.anomalies.detect_business_anomalies()
    return {
        "anomalies": anoms,
        "total_anomalies_flagged": len(anoms)
    }

@app.get("/api/recommendations")
def get_recommendations():
    """Returns structured 5-dimension managerial decision cards."""
    _check_analyzed()
    if state.results and "recommendations" in state.results:
        recs = state.results["recommendations"]
    else:
        kpis = state.results.get("kpis") if state.results else state.analytics.compute_executive_kpis()
        seg = state.results.get("segmentation") if state.results else state.ml.perform_customer_segmentation()
        ml_res = state.results.get("churn") if state.results else state.ml.train_churn_model()
        df_clean = state.loader.get_clean_dataframe()
        rec_engine = RecommendationEngine(df_clean, kpis, seg, ml_res)
        recs = rec_engine.generate_recommendations()
    return {
        "recommendations": recs,
        "total_recommendations": len(recs)
    }

class AnalystQuery(BaseModel):
    question: str

@app.post("/api/ai/analyst")
def ask_ai_analyst(query: AnalystQuery):
    """Answers managerial questions using grounded dataset analytics."""
    _check_analyzed()
    if state.ai_analyst is not None:
        return state.ai_analyst.query(query.question)
    
    kpis = state.results.get("kpis") if state.results else state.analytics.compute_executive_kpis()
    seg = state.results.get("segmentation") if state.results else state.ml.perform_customer_segmentation()
    ml_res = state.results.get("churn") if state.results else state.ml.train_churn_model()
    anoms = state.results.get("anomalies") if state.results else state.anomalies.detect_business_anomalies()
    recs = state.results.get("recommendations") if state.results else RecommendationEngine(state.loader.get_clean_dataframe(), kpis, seg, ml_res).generate_recommendations()

    analyst = AIBusinessAnalyst(kpis, seg, ml_res, anoms, recs)
    state.ai_analyst = analyst
    return analyst.query(query.question)

@app.get("/api/report")
def get_executive_report():
    """Generates a formal executive memo and model governance disclosure."""
    _check_analyzed()
    
    kpis = state.results.get("kpis") if state.results else state.analytics.compute_executive_kpis()
    quality = state.loader.quality_report
    seg = state.results.get("segmentation") if state.results else state.ml.perform_customer_segmentation()
    ml_res = state.results.get("churn") if state.results else state.ml.train_churn_model()
    anoms = state.results.get("anomalies") if state.results else state.anomalies.detect_business_anomalies()
    recs = state.results.get("recommendations") if state.results else RecommendationEngine(state.loader.get_clean_dataframe(), kpis, seg, ml_res).generate_recommendations()

    gen = ExecutiveReportGenerator(kpis, quality, seg, ml_res, anoms, recs, is_demo=state.is_demo_dataset)
    return gen.generate_report()

# ----------------- STATIC FRONTEND SERVING ----------------- #
frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if frontend_dist.exists() and (frontend_dist / "index.html").exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = frontend_dist / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(frontend_dist / "index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
