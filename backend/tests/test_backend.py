import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_initial_state_and_guards():
    # 1. Test clean initial state - no dataset loaded
    res_status = client.get("/api/status")
    assert res_status.status_code == 200
    assert res_status.json()["has_dataset"] is False

    # 2. Test that analytical endpoints return 400 before loading data
    res_kpis = client.get("/api/analytics/executive")
    assert res_kpis.status_code == 400
    assert "No analyzed dataset available" in res_kpis.json()["detail"]

    # 3. Explicitly load demo dataset
    res_demo = client.post("/api/dataset/load-demo")
    assert res_demo.status_code == 200
    demo_data = res_demo.json()
    assert demo_data["is_demo"] is True
    assert demo_data["is_analyzed"] is True
    assert "validation" in demo_data

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["dataset_loaded"] is True

def test_dataset_quality():
    response = client.get("/api/dataset/quality")
    assert response.status_code == 200
    data = response.json()
    assert "quality_report" in data
    assert data["quality_report"]["total_rows"] >= 1000
    assert data["quality_report"]["quality_score"] > 80

def test_executive_kpis():
    response = client.get("/api/analytics/executive")
    assert response.status_code == 200
    data = response.json()
    assert data["total_revenue"] > 1000000
    assert data["total_customers"] >= 1000
    assert data["churn_rate"] > 0
    assert data["retention_rate"] > 50

def test_trends_and_breakdowns():
    response = client.get("/api/analytics/trends")
    assert response.status_code == 200
    data = response.json()
    assert len(data["trend_series"]) > 0
    assert len(data["category_breakdown"]) > 0

def test_customer_segmentation():
    response = client.get("/api/ml/segmentation?k=4")
    assert response.status_code == 200
    data = response.json()
    assert len(data["segment_summaries"]) == 4
    # Check persona names
    persona_names = [s["persona_name"] for s in data["segment_summaries"]]
    assert any("Champion" in p for p in persona_names)
    assert len(data["scatter_points"]) > 50

def test_churn_model():
    response = client.get("/api/ml/churn-model")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert data["metrics"]["accuracy"] > 0.70
    assert data["metrics"]["roc_auc"] > 0.70
    assert "confusion_matrix" in data
    assert len(data["feature_importances"]) > 0

def test_what_if_simulator():
    payload = {
        "days_since_last_active": 65.0,
        "order_count": 4.0,
        "avg_order_value": 1200.0,
        "support_tickets": 6.0,
        "avg_resolution_hrs": 28.0,
        "nps_score": 3.0,
        "discount_pct": 25.0,
        "contract_type": "Month-to-Month"
    }
    response = client.post("/api/ml/what-if", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["churn_percentage"] > 40.0
    assert "Critical" in data["risk_tier"] or "Elevated" in data["risk_tier"]

def test_anomalies():
    response = client.get("/api/anomalies")
    assert response.status_code == 200
    data = response.json()
    assert "anomalies" in data
    assert len(data["anomalies"]) > 0

def test_recommendations():
    response = client.get("/api/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert len(data["recommendations"]) >= 3
    rec = data["recommendations"][0]
    assert "finding" in rec
    assert "evidence" in rec
    assert "business_impact" in rec
    assert "recommended_action" in rec
    assert "priority" in rec

def test_ai_analyst_grounded_response():
    payload = {"question": "Why did revenue decline in the last period?"}
    response = client.post("/api/ai/analyst", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["data_backed_findings"]) > 0
    assert len(data["strategic_recommendations"]) > 0
    assert "grounding_confidence" in data

def test_executive_report():
    response = client.get("/api/report")
    assert response.status_code == 200
    data = response.json()
    assert "executive_summary" in data
    assert "kpi_scorecard" in data
    assert "ninety_day_action_roadmap" in data
    assert "model_governance_and_limitations" in data
