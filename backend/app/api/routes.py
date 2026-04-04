from fastapi import APIRouter
import random

router = APIRouter()  # ✅ THIS WAS MISSING

# =========================
# ANALYTICS ENDPOINTS
# =========================

@router.get("/analytics/dashboard")
def get_dashboard():
    return {
        "total_transactions": 1000,
        "fraud_transactions": 45,
        "fraud_rate": 4.5,
    }

@router.get("/analytics/risk-distribution")
def risk_distribution():
    return [
        {"risk": "LOW", "count": 700},
        {"risk": "MEDIUM", "count": 200},
        {"risk": "HIGH", "count": 80},
        {"risk": "CRITICAL", "count": 20},
    ]

@router.get("/analytics/category-breakdown")
def category_breakdown():
    return [
        {"category": "retail", "count": 400},
        {"category": "travel", "count": 300},
        {"category": "food", "count": 300},
    ]

@router.get("/analytics/hourly")
def hourly_stats():
    return [{"hour": i, "count": random.randint(10, 50)} for i in range(24)]

@router.get("/analytics/timeseries")
def timeseries():
    return [{"time": i, "value": random.randint(100, 500)} for i in range(10)]

@router.get("/analytics/geo-bubbles")
def geo():
    return [
        {"lat": 19.0760, "lng": 72.8777, "count": 120},
        {"lat": 28.7041, "lng": 77.1025, "count": 80},
    ]

@router.get("/analytics/top-cards-at-risk")
def top_cards():
    return [
        {"card": "1234", "risk": "HIGH"},
        {"card": "5678", "risk": "CRITICAL"},
    ]

# =========================
# SIMULATOR
# =========================

@router.post("/simulate")
def simulate():
    data = []
    for i in range(5):
        data.append({
            "id": i,
            "amount": random.randint(100, 10000),
            "risk_level": random.choice(["LOW", "MEDIUM", "HIGH"]),
            "is_flagged": random.choice([True, False])
        })
    return {
        "simulated": len(data),
        "transactions": data
    }