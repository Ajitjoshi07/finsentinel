import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, text
from app.core.database import get_db, engine
from app.models.db_models import Transaction, Alert, AuditLog
from app.models.schemas import TransactionCreate, AlertUpdate, SimulateRequest
from app.ml.inference import engine as ml_engine
from app.services.simulator import generate_transaction

router = APIRouter()
IS_PG = "postgresql" in str(engine.url)

def bool_sum(col):
    if IS_PG:
        return "SUM(CASE WHEN " + col + "=true THEN 1 ELSE 0 END)"
    return "SUM(CASE WHEN " + col + "=1 THEN 1 ELSE 0 END)"

class ConnectionManager:
    def __init__(self):
        self.active = []
    async def connect(self, ws):
        await ws.accept()
        self.active.append(ws)
    def disconnect(self, ws):
        if ws in self.active:
            self.active.remove(ws)
    async def broadcast(self, data):
        dead = []
        for ws in self.active:
            try:
                await ws.send_json(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

ws_manager = ConnectionManager()

def txn_to_dict(txn):
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
        shap_json=json.dumps(prediction.shap_values),
        is_flagged=prediction.risk_level in ("HIGH", "CRITICAL"),
        is_blocked=prediction.risk_level == "CRITICAL" and prediction.fraud_probability > 0.9,
    )
    db.add(txn)
    db.flush()
    if txn.is_flagged:
        db.add(Alert(
            transaction_id=txn.id,
            risk_level=prediction.risk_level,
            status="OPEN",
            fraud_probability=prediction.fraud_probability,
            ensemble_score=prediction.ensemble_score,
            explanation=prediction.explanation,
            top_risk_factors=json.dumps(prediction.top_risk_factors),
        ))
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
def list_transactions(limit: int = Query(50, le=200), offset: int = 0,
    risk_level: Optional[str] = None, flagged_only: bool = False,
    db: Session = Depends(get_db)):
    q = db.query(Transaction)
    if risk_level:
        q = q.filter(Transaction.risk_level == risk_level.upper())
    if flagged_only:
        q = q.filter(Transaction.is_flagged == True)
    total = q.count()
    txns = q.order_by(desc(Transaction.timestamp)).offset(offset).limit(limit).all()
    return {"total": total, "items": [txn_to_dict(t) for t in txns]}

@router.get("/transactions/{txn_id}")
def get_transaction(txn_id: str, db: Session = Depends(get_db)):
    txn = db.query(Transaction).filter(Transaction.id == txn_id).first()
    if not txn:
        raise HTTPException(404, "Transaction not found")
    return txn_to_dict(txn)

@router.get("/alerts")
def list_alerts(status: Optional[str] = None, risk_level: Optional[str] = None,
    limit: int = Query(50, le=200), offset: int = 0, db: Session = Depends(get_db)):
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
        action="status_changed_to_" + payload.status,
        actor=payload.reviewed_by,
        details=json.dumps({"notes": payload.review_notes}),
    ))
    db.commit()
    await ws_manager.broadcast({"type": "alert_updated", "data": {"id": alert_id, "status": payload.status}})
    return {"id": alert_id, "status": payload.status}

@router.get("/analytics/dashboard")
def dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Transaction.id)).scalar() or 0
    flagged = db.query(func.count(Transaction.id)).filter(Transaction.is_flagged == True).scalar() or 0
    blocked = db.query(func.count(Transaction.id)).filter(Transaction.is_blocked == True).scalar() or 0
    avg_prob = db.query(func.avg(Transaction.fraud_probability)).scalar() or 0
    open_alerts = db.query(func.count(Alert.id)).filter(Alert.status == "OPEN").scalar() or 0
    resolved = db.query(func.count(Alert.id)).filter(Alert.status.in_(["CONFIRMED_FRAUD", "FALSE_POSITIVE"])).scalar() or 0
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    txns_1h = db.query(func.count(Transaction.id)).filter(Transaction.timestamp >= one_hour_ago).scalar() or 0
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
    rows = db.query(Transaction.risk_level, func.count(Transaction.id)).group_by(Transaction.risk_level).all()
    dist = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
    for risk, cnt in rows:
        if risk in dist:
            dist[risk] = cnt
    return dist

@router.get("/analytics/category-breakdown")
def category_breakdown(db: Session = Depends(get_db)):
    fs = bool_sum("is_flagged")
    sql = "SELECT merchant_category, COUNT(*) as total, " + fs + " as fraud FROM transactions GROUP BY merchant_category ORDER BY total DESC"
    rows = db.execute(text(sql)).fetchall()
    results = []
    for row in rows:
        cat = row[0]
        total = int(row[1] or 0)
        fraud = int(row[2] or 0)
        results.append({"category": cat, "count": total, "fraud_count": fraud,
                        "fraud_rate": round(fraud / max(total, 1) * 100, 2)})
    return results

@router.get("/analytics/hourly")
def hourly_stats(db: Session = Depends(get_db)):
    fs = bool_sum("is_flagged")
    sql = "SELECT hour, COUNT(*) as total, " + fs + " as flagged FROM transactions GROUP BY hour ORDER BY hour"
    rows = db.execute(text(sql)).fetchall()
    counts = {}
    for r in rows:
        if r[0] is not None:
            counts[int(r[0])] = (int(r[1] or 0), int(r[2] or 0))
    return [{"hour": h, "total": counts.get(h, (0, 0))[0], "flagged": counts.get(h, (0, 0))[1]} for h in range(24)]

@router.get("/analytics/geo-bubbles")
def geo_bubbles(db: Session = Depends(get_db)):
    fs = bool_sum("is_flagged")
    sql = "SELECT city, country, lat, lng, COUNT(*) as total, " + fs + " as fraud FROM transactions WHERE city IS NOT NULL AND lat IS NOT NULL GROUP BY city, country, lat, lng ORDER BY total DESC"
    rows = db.execute(text(sql)).fetchall()
    return [{"city": r[0], "country": r[1], "lat": r[2], "lng": r[3],
             "count": int(r[4] or 0), "fraud_count": int(r[5] or 0)} for r in rows]

@router.get("/analytics/timeseries")
def timeseries(db: Session = Depends(get_db)):
    fs = bool_sum("is_flagged")
    now = datetime.utcnow()
    results = []
    for i in range(30, -1, -1):
        t_start = (now - timedelta(minutes=i + 1)).strftime("%Y-%m-%d %H:%M:%S")
        t_end = (now - timedelta(minutes=i)).strftime("%Y-%m-%d %H:%M:%S")
        label = (now - timedelta(minutes=i)).strftime("%H:%M")
        sql = "SELECT COUNT(*) as total, " + fs + " as flagged FROM transactions WHERE timestamp >= :ts AND timestamp < :te"
        row = db.execute(text(sql), {"ts": t_start, "te": t_end}).fetchone()
        total = int(row[0] or 0) if row else 0
        flagged = int(row[1] or 0) if row else 0
        results.append({"timestamp": label, "total": total, "flagged": flagged,
                        "fraud_rate": round(flagged / max(total, 1) * 100, 1)})
    return results

@router.get("/analytics/top-cards-at-risk")
def top_cards_at_risk(db: Session = Depends(get_db)):
    fs = bool_sum("is_flagged")
    sql = "SELECT card_last4, COUNT(*) as total, " + fs + " as fraud, AVG(ensemble_score) as avg_score FROM transactions GROUP BY card_last4 HAVING " + fs + " > 0 ORDER BY fraud DESC LIMIT 10"
    rows = db.execute(text(sql)).fetchall()
    return [{"card_last4": r[0], "total": int(r[1] or 0), "fraud_count": int(r[2] or 0),
             "avg_risk_score": round(float(r[3] or 0) * 100, 1),
             "fraud_rate": round(int(r[2] or 0) / max(int(r[1] or 1), 1) * 100, 1)} for r in rows]

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
        db.flush()
        if txn.is_flagged:
            db.add(Alert(
                transaction_id=txn.id,
                risk_level=prediction.risk_level,
                status="OPEN",
                fraud_probability=prediction.fraud_probability,
                ensemble_score=prediction.ensemble_score,
                explanation=prediction.explanation,
                top_risk_factors=json.dumps(prediction.top_risk_factors),
            ))
        db.commit()
        db.refresh(txn)
        result = txn_to_dict(txn)
        results.append(result)
        await ws_manager.broadcast({"type": "transaction", "data": result})
    return {"simulated": len(results), "transactions": results}

@router.websocket("/ws/feed")
async def websocket_feed(ws: WebSocket):
    await ws_manager.connect(ws)
    try:
        await ws.send_json({"type": "connected", "message": "FinSentinel live feed connected"})
        while True:
            try:
                await asyncio.wait_for(ws.receive_text(), timeout=30.0)
                await ws.send_json({"type": "ping", "ts": datetime.utcnow().isoformat()})
            except asyncio.TimeoutError:
                await ws.send_json({"type": "heartbeat", "ts": datetime.utcnow().isoformat()})
    except WebSocketDisconnect:
        ws_manager.disconnect(ws)

@router.get("/health")
def health():
    return {
        "status": "ok",
        "service": "FinSentinel API",
        "version": "1.0.0",
        "ml_loaded": ml_engine._loaded,
        "timestamp": datetime.utcnow().isoformat(),
    }
```

---

**Steps:**

**[1]** Open this URL:
```
https://github.com/Ajitjoshi07/finsentinel/edit/main/backend/app/api/routes.py
