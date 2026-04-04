from fastapi import APIRouter
import random

router = APIRouter()

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

@router.post("/simulate")
def simulate():
    return {
        "simulated": 5,
        "transactions": [
            {"id": 1, "amount": 500, "risk_level": "LOW", "is_flagged": False}
        ]
    }