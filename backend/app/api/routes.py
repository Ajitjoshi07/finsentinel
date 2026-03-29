"""
FinSentinel API Routes
All endpoints for transactions, alerts, analytics, websocket
"""
import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, text
import random

from app.core.database import get_db
from app.models.db_models import Transaction, Alert, AuditLog, ModelMetrics
from app.models.schemas import (
    TransactionCreate, TransactionResponse, TransactionListItem,
    AlertResponse, AlertUpdate, DashboardStats, RiskDistribution,
    CategoryBreakdown, HourlyStats, TimeSeriesPoint, SimulateRequest,
    ModelInfo, GeoBubble
)
from app.ml.inference import engine as ml_engine
from app.services.simulator import generate_transaction

router = APIRouter()

# ── WebSocket Manager ────────────────────────────────────────
class ConnectionManager:
    def __init__(self):
        self.active: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)

    async def broadcast(self, data: dict):
        dead = []
        for ws in self.active:
            try:
                await ws.send_json(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

ws_manager = ConnectionManager()


# ── Helper ───────────────────────────────────────────────────
def txn_to_dict(txn: Transaction) -> dict:
    shap = []
    if txn.shap_json:
        try:
            shap = json.loads(txn.shap_json)
        except Exception:
            pass
    return {
        "id": txn.id,
        "card_last4": txn.card_last4,
        "merchant_name": txn.merchant_name,
        "merchant_category": txn.merchant_category,
        "amount": txn.amount,
        "currency": txn.currency,
        "timestamp": txn.timestamp.isoformat() if txn.timestamp else None,
        "city": txn.city,
        "country": txn.country,
        "risk_level": txn.risk_level,
        "fraud_probability": txn.fraud_probability,
        "ensemble_score": txn.ensemble_score,
        "anomaly_score": txn.anomaly_score,
        "is_flagged": txn.is_flagged,
        "is_blocked": txn.is_blocked,
        "ml_explanation": txn.ml_explanation,
        "shap_values": shap,
        "geo_distance_km": txn.geo_distance_km,
        "cross_border": txn.cross_border,
        "velocity_1h": txn.velocity_1h,
        "velocity_24h": txn.velocity_24h,
    }


# ── Transactions ─────────────────────────────────────────────
@router.post("/transactions", response_model=dict)
async def create_transaction(payload: TransactionCreate, db: Session = Depends(get_db)):
    txn_dict = payload.dict()
    if txn_dict.get("hour") is None:
        txn_dict["hour"] = datetime.utcnow().hour

    prediction = ml_engine.predict(txn_dict)

    txn = Transaction(
        **{k: v for k, v in txn_dict.items() if hasattr(Transaction, k)},
        fraud_probability=prediction.fraud_probability,
        anomaly_score=prediction.anomaly_score,
        ensemble_score=prediction.ensemble_score,
        risk_level=prediction.risk_level,
        ml_explanation=prediction.explanation,
        shap_json=json.dumps([s for s in prediction.shap_values]),
        is_flagged=prediction.risk_level in ("HIGH", "CRITICAL"),
        is_blocked=prediction.risk_level == "CRITICAL" and prediction.fraud_probability > 0.9,
    )
    db.add(txn)
    db.flush()  # ensure txn.id is populated before creating alert

    if txn.is_flagged:
        alert = Alert(
            transaction_id=txn.id,
            risk_level=prediction.risk_level,
            status="OPEN",
            fraud_probability=prediction.fraud_probability,
            ensemble_score=prediction.ensemble_score,
            explanation=prediction.explanation,
            top_risk_factors=json.dumps(prediction.top_risk_factors),
        )
        db.add(alert)

    db.add(AuditLog(
        entity_type="transaction",
        entity_id=txn.id,
        action="created",
        details=json.dumps({"risk_level": txn.risk_level, "amount": txn.amount}),
    ))
    db.commit()
    db.refresh(txn)

    result = txn_to_dict(txn)
    await ws_manager.broadcast({"type": "transaction", "data": result})
    return result


@router.get("/transactions")
def list_transactions(
    limit: int = Query(50, le=200),
    offset: int = 0,
    risk_level: Optional[str] = None,
    flagged_only: bool = False,
    db: Session = Depends(get_db)
):
    q = db.query(Transaction)
    if risk_level:
        q = q.filter(Transaction.risk_level == risk_level.upper())
    if flagged_only:
        q = q.filter(Transaction.is_flagged == True)
    total = q.count()
    txns = q.order_by(desc(Transaction.timestamp)).offset(offset).limit(limit).all()
    return {
        "total": total,
        "items": [txn_to_dict(t) for t in txns]
    }


@router.get("/transactions/{txn_id}")
def get_transaction(txn_id: str, db: Session = Depends(get_db)):
    txn = db.query(Transaction).filter(Transaction.id == txn_id).first()
    if not txn:
        raise HTTPException(404, "Transaction not found")
    return txn_to_dict(txn)


# ── Alerts ───────────────────────────────────────────────────
@router.get("/alerts")
def list_alerts(
    status: Optional[str] = None,
    risk_level: Optional[str] = None,
    limit: int = Query(50, le=200),
    offset: int = 0,
    db: Session = Depends(get_db)
):
    q = db.query(Alert)
    if status:
        q = q.filter(Alert.status == status.upper())
    if risk_level:
        q = q.filter(Alert.risk_level == risk_level.upper())
    total = q.count()
    alerts = q.order_by(desc(Alert.created_at)).offset(offset).limit(limit).all()

    result = []
    for a in alerts:
        txn = db.query(Transaction).filter(Transaction.id == a.transaction_id).first()
        result.append({
            "id": a.id,
            "transaction_id": a.transaction_id,
            "risk_level": a.risk_level,
            "status": a.status,
            "fraud_probability": a.fraud_probability,
            "ensemble_score": a.ensemble_score,
            "explanation": a.explanation,
            "top_risk_factors": json.loads(a.top_risk_factors) if a.top_risk_factors else [],
            "created_at": a.created_at.isoformat() if a.created_at else None,
            "updated_at": a.updated_at.isoformat() if a.updated_at else None,
            "reviewed_by": a.reviewed_by,
            "review_notes": a.review_notes,
            "resolved_at": a.resolved_at.isoformat() if a.resolved_at else None,
            "transaction": txn_to_dict(txn) if txn else None,
        })
    return {"total": total, "items": result}


@router.patch("/alerts/{alert_id}")
async def update_alert(alert_id: str, payload: AlertUpdate, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(404, "Alert not found")

    alert.status = payload.status
    alert.reviewed_by = payload.reviewed_by
    alert.review_notes = payload.review_notes
    alert.updated_at = datetime.utcnow()
    if payload.status in ("CONFIRMED_FRAUD", "FALSE_POSITIVE"):
        alert.resolved_at = datetime.utcnow()

    db.add(AuditLog(
        entity_type="alert",
        entity_id=alert_id,
        action=f"status_changed_to_{payload.status}",
        actor=payload.reviewed_by,
        details=json.dumps({"notes": payload.review_notes}),
    ))
    db.commit()

    await ws_manager.broadcast({
        "type": "alert_updated",
        "data": {"id": alert_id, "status": payload.status}
    })
    return {"id": alert_id, "status": payload.status}


# ── Analytics ────────────────────────────────────────────────
@router.get("/analytics/dashboard")
def dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Transaction.id)).scalar() or 0
    flagged = db.query(func.count(Transaction.id)).filter(Transaction.is_flagged == True).scalar() or 0
    blocked = db.query(func.count(Transaction.id)).filter(Transaction.is_blocked == True).scalar() or 0
    avg_prob = db.query(func.avg(Transaction.fraud_probability)).scalar() or 0

    open_alerts = db.query(func.count(Alert.id)).filter(Alert.status == "OPEN").scalar() or 0
    resolved = db.query(func.count(Alert.id)).filter(
        Alert.status.in_(["CONFIRMED_FRAUD", "FALSE_POSITIVE"])
    ).scalar() or 0

    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    txns_1h = db.query(func.count(Transaction.id)).filter(
        Transaction.timestamp >= one_hour_ago
    ).scalar() or 0
    high_1h = db.query(func.count(Transaction.id)).filter(
        Transaction.timestamp >= one_hour_ago,
        Transaction.risk_level.in_(["HIGH", "CRITICAL"])
    ).scalar() or 0

    metrics = ml_engine.metrics
    return {
        "total_transactions": total,
        "total_flagged": flagged,
        "total_blocked": blocked,
        "fraud_rate": round(flagged / max(total, 1) * 100, 2),
        "avg_fraud_probability": round(float(avg_prob) * 100, 2),
        "total_alerts_open": open_alerts,
        "total_alerts_resolved": resolved,
        "transactions_last_hour": txns_1h,
        "high_risk_last_hour": high_1h,
        "model_auc_roc": metrics.get("auc_roc", 0),
        "model_avg_precision": metrics.get("avg_precision", 0),
    }


@router.get("/analytics/risk-distribution")
def risk_distribution(db: Session = Depends(get_db)):
    rows = db.query(Transaction.risk_level, func.count(Transaction.id)).group_by(
        Transaction.risk_level
    ).all()
    dist = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
    for risk, cnt in rows:
        if risk in dist:
            dist[risk] = cnt
    return dist


@router.get("/analytics/category-breakdown")
def category_breakdown(db: Session = Depends(get_db)):
    rows = db.execute(text(
        "SELECT merchant_category, COUNT(*) as total, "
        "SUM(CASE WHEN is_flagged=1 THEN 1 ELSE 0 END) as fraud "
        "FROM transactions GROUP BY merchant_category ORDER BY total DESC"
    )).fetchall()
    results = []
    for row in rows:
        cat, total, fraud = row[0], int(row[1] or 0), int(row[2] or 0)
        results.append({
            "category": cat, "count": total, "fraud_count": fraud,
            "fraud_rate": round(fraud / max(total, 1) * 100, 2),
        })
    return results


@router.get("/analytics/hourly")
def hourly_stats(db: Session = Depends(get_db)):
    rows = db.execute(text(
        "SELECT hour, COUNT(*) as total, "
        "SUM(CASE WHEN is_flagged=1 THEN 1 ELSE 0 END) as flagged "
        "FROM transactions GROUP BY hour"
    )).fetchall()
    counts = {int(r[0]): (int(r[1] or 0), int(r[2] or 0)) for r in rows if r[0] is not None}
    return [{"hour": h, "total": counts.get(h,(0,0))[0], "flagged": counts.get(h,(0,0))[1]} for h in range(24)]


@router.get("/analytics/geo-bubbles")
def geo_bubbles(db: Session = Depends(get_db)):
    cities = db.query(
        Transaction.city, Transaction.country,
        Transaction.lat, Transaction.lng
    ).distinct().all()

    results = []
    for (city, country, lat, lng) in cities:
        if not city or lat is None:
            continue
        count = db.query(func.count(Transaction.id)).filter(
            Transaction.city == city
        ).scalar() or 0
        fraud = db.query(func.count(Transaction.id)).filter(
            Transaction.city == city,
            Transaction.is_flagged == True
        ).scalar() or 0
        results.append({
            "city": city, "country": country,
            "lat": lat, "lng": lng,
            "count": count, "fraud_count": fraud
        })
    return sorted(results, key=lambda x: x["count"], reverse=True)


@router.get("/analytics/timeseries")
def timeseries(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    results = []
    for i in range(30, -1, -1):
        t_start = (now - timedelta(minutes=i+1)).strftime("%Y-%m-%d %H:%M:%S")
        t_end = (now - timedelta(minutes=i)).strftime("%Y-%m-%d %H:%M:%S")
        label = (now - timedelta(minutes=i)).strftime("%H:%M")
        row = db.execute(text(
            "SELECT COUNT(*) as total, SUM(CASE WHEN is_flagged=1 THEN 1 ELSE 0 END) as flagged "
            "FROM transactions WHERE timestamp >= :ts AND timestamp < :te"
        ), {"ts": t_start, "te": t_end}).fetchone()
        total = int(row[0] or 0) if row else 0
        flagged = int(row[1] or 0) if row else 0
        results.append({"timestamp": label, "total": total, "flagged": flagged,
                        "fraud_rate": round(flagged / max(total, 1) * 100, 1)})
    return results


@router.get("/analytics/top-cards-at-risk")
def top_cards_at_risk(db: Session = Depends(get_db)):
    cards = db.query(Transaction.card_last4).distinct().all()
    results = []
    for (card,) in cards:
        fraud_count = db.query(func.count(Transaction.id)).filter(
            Transaction.card_last4 == card,
            Transaction.is_flagged == True
        ).scalar() or 0
        total = db.query(func.count(Transaction.id)).filter(
            Transaction.card_last4 == card
        ).scalar() or 0
        avg_score = db.query(func.avg(Transaction.ensemble_score)).filter(
            Transaction.card_last4 == card
        ).scalar() or 0
        if fraud_count > 0:
            results.append({
                "card_last4": card,
                "fraud_count": fraud_count,
                "total": total,
                "avg_risk_score": round(float(avg_score) * 100, 1),
                "fraud_rate": round(fraud_count / max(total, 1) * 100, 1),
            })
    return sorted(results, key=lambda x: x["fraud_count"], reverse=True)[:10]


# ── Model Info ───────────────────────────────────────────────
@router.get("/model/info")
def model_info():
    if not ml_engine._loaded:
        ml_engine.load()
    m = ml_engine.metrics
    return {
        "auc_roc": m.get("auc_roc", 0),
        "avg_precision": m.get("avg_precision", 0),
        "trained_at": m.get("trained_at", ""),
        "n_train": m.get("n_train", 0),
        "fraud_rate": m.get("fraud_rate", 0),
        "model_version": "v1.0.0",
        "features": m.get("feature_cols", []),
        "algorithms": ["XGBoost (fraud classifier)", "Isolation Forest (anomaly detector)"],
        "explainability": "SHAP TreeExplainer",
    }


# ── Simulate ─────────────────────────────────────────────────
@router.post("/simulate")
async def simulate(req: SimulateRequest, db: Session = Depends(get_db)):
    results = []
    for _ in range(req.count):
        txn_data = generate_transaction(req.scenario)
        payload = TransactionCreate(**txn_data)
        txn_dict = payload.dict()
        if txn_dict.get("hour") is None:
            txn_dict["hour"] = datetime.utcnow().hour

        prediction = ml_engine.predict(txn_dict)
        txn = Transaction(
            **{k: v for k, v in txn_dict.items() if hasattr(Transaction, k)},
            fraud_probability=prediction.fraud_probability,
            anomaly_score=prediction.anomaly_score,
            ensemble_score=prediction.ensemble_score,
            risk_level=prediction.risk_level,
            ml_explanation=prediction.explanation,
            shap_json=json.dumps(prediction.shap_values),
            is_flagged=prediction.risk_level in ("HIGH", "CRITICAL"),
            is_blocked=prediction.risk_level == "CRITICAL" and prediction.fraud_probability > 0.9,
        )
        db.add(txn)
        db.flush()  # ensure txn.id is set before alert
        if txn.is_flagged:
            alert = Alert(
                transaction_id=txn.id,
                risk_level=prediction.risk_level,
                status="OPEN",
                fraud_probability=prediction.fraud_probability,
                ensemble_score=prediction.ensemble_score,
                explanation=prediction.explanation,
                top_risk_factors=json.dumps(prediction.top_risk_factors),
            )
            db.add(alert)
        db.commit()
        db.refresh(txn)
        result = txn_to_dict(txn)
        results.append(result)
        await ws_manager.broadcast({"type": "transaction", "data": result})

    return {"simulated": len(results), "transactions": results}


# ── WebSocket ────────────────────────────────────────────────
@router.websocket("/ws/feed")
async def websocket_feed(ws: WebSocket):
    await ws_manager.connect(ws)
    try:
        await ws.send_json({"type": "connected", "message": "FinSentinel live feed connected"})
        while True:
            try:
                data = await asyncio.wait_for(ws.receive_text(), timeout=30.0)
                await ws.send_json({"type": "ping", "ts": datetime.utcnow().isoformat()})
            except asyncio.TimeoutError:
                await ws.send_json({"type": "heartbeat", "ts": datetime.utcnow().isoformat()})
    except WebSocketDisconnect:
        ws_manager.disconnect(ws)


# ── Health ───────────────────────────────────────────────────
@router.get("/health")
def health():
    return {
        "status": "ok",
        "service": "FinSentinel API",
        "version": "1.0.0",
        "ml_loaded": ml_engine._loaded,
        "timestamp": datetime.utcnow().isoformat(),
    }
