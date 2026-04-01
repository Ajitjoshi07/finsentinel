"""
FinSentinel API Schemas
Pydantic models for request/response validation
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class AlertStatus(str, Enum):
    OPEN = "OPEN"
    REVIEWING = "REVIEWING"
    CONFIRMED_FRAUD = "CONFIRMED_FRAUD"
    FALSE_POSITIVE = "FALSE_POSITIVE"
    ESCALATED = "ESCALATED"


# ── Transaction ──────────────────────────────────────────────
class TransactionCreate(BaseModel):
    card_last4: str = Field(..., min_length=4, max_length=4)
    card_bin: Optional[str] = "411111"
    merchant_name: str
    merchant_category: str = "retail"
    merchant_country: Optional[str] = "US"
    amount: float = Field(..., gt=0)
    currency: str = "USD"
    lat: Optional[float] = None
    lng: Optional[float] = None
    city: Optional[str] = None
    country: str = "US"
    geo_distance_km: float = 0
    hour: Optional[int] = None
    velocity_1h: int = 0
    velocity_24h: int = 0
    is_new_merchant: bool = False
    cross_border: bool = False
    device_age_days: float = 365
    merchant_risk_score: float = Field(0.1, ge=0, le=1)


class ShapValue(BaseModel):
    feature: str
    feature_key: str
    shap_value: float
    feature_value: float


class TransactionResponse(BaseModel):
    id: str
    card_last4: str
    merchant_name: str
    merchant_category: str
    amount: float
    currency: str
    timestamp: datetime
    city: Optional[str]
    country: str
    fraud_probability: float
    anomaly_score: float
    ensemble_score: float
    risk_level: str
    ml_explanation: Optional[str]
    shap_values: Optional[List[ShapValue]]
    is_flagged: bool
    is_blocked: bool

    class Config:
        from_attributes = True


class TransactionListItem(BaseModel):
    id: str
    card_last4: str
    merchant_name: str
    merchant_category: str
    amount: float
    currency: str
    timestamp: datetime
    city: Optional[str]
    country: str
    risk_level: str
    fraud_probability: float
    ensemble_score: float
    is_flagged: bool
    is_blocked: bool

    class Config:
        from_attributes = True


# ── Alert ────────────────────────────────────────────────────
class AlertResponse(BaseModel):
    id: str
    transaction_id: str
    risk_level: str
    status: str
    fraud_probability: float
    ensemble_score: float
    explanation: Optional[str]
    top_risk_factors: Optional[str]
    created_at: datetime
    updated_at: datetime
    reviewed_by: Optional[str]
    review_notes: Optional[str]
    resolved_at: Optional[datetime]
    transaction: Optional[TransactionListItem]

    class Config:
        from_attributes = True


class AlertUpdate(BaseModel):
    status: AlertStatus
    reviewed_by: str = "analyst"
    review_notes: Optional[str] = None


# ── Analytics ────────────────────────────────────────────────
class DashboardStats(BaseModel):
    total_transactions: int
    total_flagged: int
    total_blocked: int
    fraud_rate: float
    avg_fraud_probability: float
    total_alerts_open: int
    total_alerts_resolved: int
    transactions_last_hour: int
    high_risk_last_hour: int
    model_auc_roc: float
    model_avg_precision: float


class RiskDistribution(BaseModel):
    LOW: int
    MEDIUM: int
    HIGH: int
    CRITICAL: int


class CategoryBreakdown(BaseModel):
    category: str
    count: int
    fraud_count: int
    fraud_rate: float


class HourlyStats(BaseModel):
    hour: int
    total: int
    flagged: int


class GeoBubble(BaseModel):
    city: str
    country: str
    lat: float
    lng: float
    count: int
    fraud_count: int


class TimeSeriesPoint(BaseModel):
    timestamp: str
    total: int
    flagged: int
    fraud_rate: float


# ── Simulate ─────────────────────────────────────────────────
class SimulateRequest(BaseModel):
    scenario: str = "random"  # "random","high_fraud","normal","burst"
    count: int = Field(1, ge=1, le=20)


class ModelInfo(BaseModel):
    auc_roc: float
    avg_precision: float
    trained_at: str
    n_train: int
    fraud_rate: float
    model_version: str = "v1.0.0"
    features: List[str]
