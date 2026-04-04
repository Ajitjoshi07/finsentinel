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

# =========================
# SIMULATOR
# =========================

@router.post("/simulate")
def simulate():
    import random
    return {
        "simulated": 5,
        "transactions": [
            {
                "id": i,
                "amount": random.randint(100, 10000),
                "risk_level": random.choice(["LOW", "MEDIUM", "HIGH"]),
                "is_flagged": random.choice([True, False])
            }
            for i in range(5)
        ]
    }