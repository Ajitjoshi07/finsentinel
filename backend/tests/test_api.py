"""
FinSentinel Backend Tests
Tests for ML inference, API endpoints, and simulation
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import pytest
from fastapi.testclient import TestClient
from app.core.database import create_tables
from app.ml.inference import engine
from app.services.simulator import generate_transaction
from main import app

os.environ.setdefault("DATABASE_URL", "sqlite:////tmp/finsentinel_test.db")
create_tables()
engine.load()

client = TestClient(app)


# ── Health ───────────────────────────────────────────────────
def test_health():
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
    assert r.json()["ml_loaded"] is True


# ── ML Inference ─────────────────────────────────────────────
def test_inference_low_risk():
    txn = {
        "amount": 25.0, "hour": 14, "geo_distance_km": 5,
        "velocity_1h": 0, "velocity_24h": 2,
        "merchant_risk_score": 0.05, "device_age_days": 730,
        "is_new_merchant": False, "cross_border": False,
        "category": "grocery"
    }
    pred = engine.predict(txn)
    assert pred.risk_level in ("LOW", "MEDIUM")
    assert 0 <= pred.fraud_probability <= 1
    assert len(pred.shap_values) > 0


def test_inference_high_risk():
    txn = {
        "amount": 4999.0, "hour": 3, "geo_distance_km": 8000,
        "velocity_1h": 7, "velocity_24h": 18,
        "merchant_risk_score": 0.95, "device_age_days": 1,
        "is_new_merchant": True, "cross_border": True,
        "category": "online"
    }
    pred = engine.predict(txn)
    assert pred.risk_level in ("HIGH", "CRITICAL")
    assert pred.fraud_probability > 0.5


def test_inference_shap_values():
    txn = generate_transaction("random")
    pred = engine.predict(txn)
    assert isinstance(pred.shap_values, list)
    assert len(pred.shap_values) == 11
    for sv in pred.shap_values:
        assert "feature" in sv
        assert "shap_value" in sv


# ── Simulator ────────────────────────────────────────────────
def test_simulator_scenarios():
    for scenario in ["random", "high_fraud", "normal", "burst"]:
        txn = generate_transaction(scenario)
        assert "amount" in txn
        assert txn["amount"] > 0
        assert txn["merchant_name"] != ""


# ── API Endpoints ────────────────────────────────────────────
def test_simulate_endpoint():
    r = client.post("/api/v1/simulate", json={"scenario": "random", "count": 3})
    assert r.status_code == 200
    data = r.json()
    assert data["simulated"] == 3
    assert len(data["transactions"]) == 3
    for txn in data["transactions"]:
        assert "risk_level" in txn
        assert "fraud_probability" in txn
        assert "shap_values" in txn


def test_transactions_list():
    r = client.get("/api/v1/transactions?limit=10")
    assert r.status_code == 200
    data = r.json()
    assert "total" in data
    assert "items" in data


def test_alerts_list():
    r = client.get("/api/v1/alerts?limit=10")
    assert r.status_code == 200
    data = r.json()
    assert "items" in data


def test_dashboard_stats():
    r = client.get("/api/v1/analytics/dashboard")
    assert r.status_code == 200
    data = r.json()
    assert "total_transactions" in data
    assert "model_auc_roc" in data
    assert data["model_auc_roc"] > 0.9


def test_risk_distribution():
    r = client.get("/api/v1/analytics/risk-distribution")
    assert r.status_code == 200
    data = r.json()
    assert set(data.keys()) == {"LOW", "MEDIUM", "HIGH", "CRITICAL"}


def test_model_info():
    r = client.get("/api/v1/model/info")
    assert r.status_code == 200
    data = r.json()
    assert data["auc_roc"] > 0.95
    assert data["avg_precision"] > 0.95
    assert len(data["features"]) == 11


def test_create_transaction_api():
    payload = {
        "card_last4": "1234", "merchant_name": "Test Merchant",
        "merchant_category": "retail", "amount": 99.99,
        "country": "US", "velocity_1h": 0, "velocity_24h": 1,
        "is_new_merchant": False, "cross_border": False,
        "device_age_days": 365, "merchant_risk_score": 0.1,
        "geo_distance_km": 10
    }
    r = client.post("/api/v1/transactions", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert "id" in data
    assert "risk_level" in data
    assert "fraud_probability" in data


def test_hourly_stats():
    r = client.get("/api/v1/analytics/hourly")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 24
    for h in data:
        assert "hour" in h
        assert "total" in h
