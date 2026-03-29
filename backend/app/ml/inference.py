"""
FinSentinel Inference Engine
Real-time fraud scoring with SHAP explanations
"""
import pickle
import json
import numpy as np
import shap
import os
from typing import Dict, Any, List, Tuple
from dataclasses import dataclass

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")

FEATURE_COLS = [
    "amount_log", "hour_sin", "hour_cos",
    "geo_distance_km", "velocity_1h", "velocity_24h",
    "merchant_risk_score", "device_age_days",
    "is_new_merchant", "cross_border", "category_encoded"
]

FEATURE_LABELS = {
    "amount_log": "Transaction amount",
    "hour_sin": "Time of day (sin)",
    "hour_cos": "Time of day (cos)",
    "geo_distance_km": "Geographic distance",
    "velocity_1h": "Txns in last 1 hour",
    "velocity_24h": "Txns in last 24 hours",
    "merchant_risk_score": "Merchant risk score",
    "device_age_days": "Device account age",
    "is_new_merchant": "New merchant",
    "cross_border": "Cross-border transaction",
    "category_encoded": "Merchant category"
}

CATEGORY_MAP = {
    0: "grocery", 1: "dining", 2: "travel", 3: "entertainment",
    4: "retail", 5: "online", 6: "atm", 7: "transfer", 8: "utility", 9: "healthcare"
}

@dataclass
class FraudPrediction:
    fraud_probability: float
    anomaly_score: float
    ensemble_score: float
    risk_level: str
    shap_values: List[Dict]
    top_risk_factors: List[str]
    explanation: str


class FraudInferenceEngine:
    def __init__(self):
        self.xgb_model = None
        self.iso_model = None
        self.scaler = None
        self.shap_explainer = None
        self.metrics = {}
        self._loaded = False

    def load(self):
        if self._loaded:
            return
        with open(f"{ARTIFACTS_DIR}/xgb_model.pkl", "rb") as f:
            self.xgb_model = pickle.load(f)
        with open(f"{ARTIFACTS_DIR}/iso_model.pkl", "rb") as f:
            self.iso_model = pickle.load(f)
        with open(f"{ARTIFACTS_DIR}/scaler.pkl", "rb") as f:
            self.scaler = pickle.load(f)
        with open(f"{ARTIFACTS_DIR}/metrics.json", "r") as f:
            self.metrics = json.load(f)
        self.shap_explainer = shap.TreeExplainer(self.xgb_model)
        self._loaded = True

    def _extract_features(self, txn: Dict[str, Any]) -> np.ndarray:
        cat_map = {v: k for k, v in CATEGORY_MAP.items()}
        hour = txn.get("hour", 12)
        features = [
            np.log1p(txn.get("amount", 0)),
            np.sin(2 * np.pi * hour / 24),
            np.cos(2 * np.pi * hour / 24),
            txn.get("geo_distance_km", 0),
            txn.get("velocity_1h", 0),
            txn.get("velocity_24h", 0),
            txn.get("merchant_risk_score", 0.1),
            txn.get("device_age_days", 365),
            int(txn.get("is_new_merchant", False)),
            int(txn.get("cross_border", False)),
            cat_map.get(txn.get("category", "retail"), 4),
        ]
        return np.array(features).reshape(1, -1)

    def predict(self, txn: Dict[str, Any]) -> FraudPrediction:
        if not self._loaded:
            self.load()

        X_raw = self._extract_features(txn)
        X_scaled = self.scaler.transform(X_raw)

        # XGBoost fraud probability
        fraud_prob = float(self.xgb_model.predict_proba(X_scaled)[0][1])

        # Isolation Forest anomaly score (-1 anomaly, 1 normal) -> normalize 0-1
        iso_raw = float(self.iso_model.score_samples(X_scaled)[0])
        # More negative = more anomalous
        anomaly_score = float(np.clip(1 - (iso_raw + 0.5) / 1.0, 0, 1))

        # Ensemble: weighted combination
        ensemble = 0.75 * fraud_prob + 0.25 * anomaly_score

        # Risk level
        if ensemble >= 0.80:
            risk_level = "CRITICAL"
        elif ensemble >= 0.60:
            risk_level = "HIGH"
        elif ensemble >= 0.35:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        # SHAP values
        shap_vals = self.shap_explainer.shap_values(X_scaled)[0]
        shap_list = [
            {
                "feature": FEATURE_LABELS[FEATURE_COLS[i]],
                "feature_key": FEATURE_COLS[i],
                "shap_value": round(float(shap_vals[i]), 4),
                "feature_value": round(float(X_raw[0][i]), 4),
            }
            for i in range(len(FEATURE_COLS))
        ]
        shap_list.sort(key=lambda x: abs(x["shap_value"]), reverse=True)

        # Top risk factors (positive SHAP = pushes toward fraud)
        top_risk = [
            s["feature"] for s in shap_list
            if s["shap_value"] > 0
        ][:3]

        explanation = self._generate_explanation(txn, fraud_prob, top_risk, risk_level, shap_list)

        return FraudPrediction(
            fraud_probability=round(fraud_prob, 4),
            anomaly_score=round(anomaly_score, 4),
            ensemble_score=round(ensemble, 4),
            risk_level=risk_level,
            shap_values=shap_list,
            top_risk_factors=top_risk,
            explanation=explanation,
        )

    def _generate_explanation(
        self, txn, prob, top_risk, risk_level, shap_list
    ) -> str:
        parts = []
        amount = txn.get("amount", 0)
        geo = txn.get("geo_distance_km", 0)
        v1h = txn.get("velocity_1h", 0)
        cross = txn.get("cross_border", False)
        new_merch = txn.get("is_new_merchant", False)
        merchant_risk = txn.get("merchant_risk_score", 0)

        if prob >= 0.80:
            parts.append(f"This transaction carries a CRITICAL fraud probability of {prob*100:.1f}%.")
        elif prob >= 0.60:
            parts.append(f"This transaction shows HIGH fraud risk at {prob*100:.1f}% probability.")
        elif prob >= 0.35:
            parts.append(f"Moderate fraud signals detected ({prob*100:.1f}% probability).")
        else:
            parts.append(f"Transaction appears legitimate ({prob*100:.1f}% fraud probability).")

        if geo > 500:
            parts.append(f"Geographic anomaly: card used {geo:.0f} km from home location.")
        if v1h >= 3:
            parts.append(f"High velocity: {v1h} transactions in the last hour.")
        if cross:
            parts.append("Cross-border transaction detected.")
        if new_merch:
            parts.append("First-time merchant — no prior transaction history.")
        if merchant_risk > 0.7:
            parts.append(f"Merchant risk score elevated at {merchant_risk:.2f}.")
        if amount > 2000:
            parts.append(f"Unusually large transaction amount (${amount:,.2f}).")
        elif amount < 2:
            parts.append("Micro-transaction probing pattern detected.")

        if not parts[1:]:
            parts.append("No major individual risk signals; ensemble model flagged subtle pattern combination.")

        return " ".join(parts)


# Singleton
engine = FraudInferenceEngine()
