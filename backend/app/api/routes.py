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

# (remaining code continues exactly same...)

@router.get("/health")
def health():
    return {
        "status": "ok",
        "service": "FinSentinel API",
        "version": "1.0.0",
        "ml_loaded": ml_engine._loaded,
        "timestamp": datetime.utcnow().isoformat(),
    }
