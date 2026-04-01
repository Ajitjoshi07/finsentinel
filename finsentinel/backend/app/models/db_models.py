"""
FinSentinel Database Models
SQLAlchemy ORM models for all entities
"""
from sqlalchemy import (
    Column, String, Float, Integer, Boolean,
    DateTime, Text, Enum, ForeignKey, Index
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

Base = declarative_base()


def gen_uuid():
    return str(uuid.uuid4())


class RiskLevel(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class AlertStatus(str, enum.Enum):
    OPEN = "OPEN"
    REVIEWING = "REVIEWING"
    CONFIRMED_FRAUD = "CONFIRMED_FRAUD"
    FALSE_POSITIVE = "FALSE_POSITIVE"
    ESCALATED = "ESCALATED"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, default=gen_uuid)
    card_last4 = Column(String(4), nullable=False)
    card_bin = Column(String(6))
    merchant_name = Column(String(200), nullable=False)
    merchant_category = Column(String(50))
    merchant_country = Column(String(3))
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Geo
    lat = Column(Float)
    lng = Column(Float)
    city = Column(String(100))
    country = Column(String(3), default="US")
    geo_distance_km = Column(Float, default=0)

    # Behavioral features
    hour = Column(Integer)
    velocity_1h = Column(Integer, default=0)
    velocity_24h = Column(Integer, default=0)
    is_new_merchant = Column(Boolean, default=False)
    cross_border = Column(Boolean, default=False)
    device_age_days = Column(Float, default=365)
    merchant_risk_score = Column(Float, default=0.1)

    # ML outputs
    fraud_probability = Column(Float, default=0)
    anomaly_score = Column(Float, default=0)
    ensemble_score = Column(Float, default=0)
    risk_level = Column(String(10), default="LOW")
    ml_explanation = Column(Text)
    shap_json = Column(Text)  # JSON blob

    # Status
    is_flagged = Column(Boolean, default=False)
    is_blocked = Column(Boolean, default=False)

    alerts = relationship("Alert", back_populates="transaction")

    __table_args__ = (
        Index("ix_txn_timestamp", "timestamp"),
        Index("ix_txn_risk", "risk_level"),
        Index("ix_txn_flagged", "is_flagged"),
        Index("ix_txn_card", "card_last4"),
    )


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, default=gen_uuid)
    transaction_id = Column(String, ForeignKey("transactions.id"), nullable=False)
    risk_level = Column(String(10))
    status = Column(String(20), default=AlertStatus.OPEN)
    fraud_probability = Column(Float)
    ensemble_score = Column(Float)
    explanation = Column(Text)
    top_risk_factors = Column(Text)  # JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    reviewed_by = Column(String(100))
    review_notes = Column(Text)
    resolved_at = Column(DateTime)

    transaction = relationship("Transaction", back_populates="alerts")

    __table_args__ = (
        Index("ix_alert_status", "status"),
        Index("ix_alert_risk", "risk_level"),
        Index("ix_alert_created", "created_at"),
    )


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=gen_uuid)
    entity_type = Column(String(50))  # "alert", "transaction"
    entity_id = Column(String)
    action = Column(String(50))
    actor = Column(String(100), default="system")
    details = Column(Text)  # JSON
    timestamp = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("ix_audit_entity", "entity_type", "entity_id"),
        Index("ix_audit_timestamp", "timestamp"),
    )


class ModelMetrics(Base):
    __tablename__ = "model_metrics"

    id = Column(String, primary_key=True, default=gen_uuid)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    auc_roc = Column(Float)
    avg_precision = Column(Float)
    total_predictions = Column(Integer, default=0)
    fraud_flagged = Column(Integer, default=0)
    false_positives = Column(Integer, default=0)
    true_positives = Column(Integer, default=0)
    model_version = Column(String(50), default="v1.0.0")
