"""
FinSentinel ML Engine
- XGBoost fraud classifier
- Isolation Forest anomaly detector
- SHAP explainability
- Feature engineering pipeline
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report, roc_auc_score,
    precision_recall_curve, average_precision_score
)
from sklearn.pipeline import Pipeline
import xgboost as xgb
import shap
import pickle
import json
import os
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
os.makedirs(DATA_DIR, exist_ok=True)


def generate_synthetic_data(n_samples: int = 50000) -> pd.DataFrame:
    """Generate realistic synthetic transaction data."""
    np.random.seed(42)
    n_fraud = int(n_samples * 0.025)  # 2.5% fraud rate (realistic)
    n_legit = n_samples - n_fraud

    def make_transactions(n, is_fraud):
        hours = np.random.choice(
            np.arange(24),
            size=n,
            p=[0.01,0.01,0.01,0.01,0.02,0.02,0.04,0.06,0.07,0.07,0.07,0.07,
               0.07,0.07,0.06,0.06,0.05,0.05,0.04,0.04,0.03,0.03,0.02,0.02]
            if not is_fraud else None
        )
        categories = ["grocery","dining","travel","entertainment","retail",
                      "online","atm","transfer","utility","healthcare"]
        cat_weights_legit = [0.20,0.15,0.10,0.08,0.18,0.12,0.05,0.06,0.04,0.02]
        cat_weights_fraud = [0.05,0.05,0.20,0.20,0.10,0.25,0.08,0.05,0.01,0.01]

        if is_fraud:
            amount = np.random.choice(
                [np.random.uniform(0.01, 2.00),
                 np.random.uniform(500, 5000),
                 np.random.uniform(100, 800)],
                size=n
            )
            geo_distance = np.random.exponential(scale=1500, size=n)
            velocity_1h = np.random.poisson(lam=4, size=n)
            velocity_24h = np.random.poisson(lam=12, size=n)
            merchant_risk = np.random.beta(a=5, b=2, size=n)
            device_age_days = np.random.exponential(scale=10, size=n)
            is_new_merchant = np.random.binomial(1, 0.75, size=n)
            cross_border = np.random.binomial(1, 0.45, size=n)
            hour_sin = np.sin(2 * np.pi * hours / 24)
            hour_cos = np.cos(2 * np.pi * hours / 24)
        else:
            amount = np.abs(np.random.lognormal(mean=3.5, sigma=1.2, size=n))
            geo_distance = np.random.exponential(scale=50, size=n)
            velocity_1h = np.random.poisson(lam=1, size=n)
            velocity_24h = np.random.poisson(lam=4, size=n)
            merchant_risk = np.random.beta(a=2, b=8, size=n)
            device_age_days = np.random.exponential(scale=365, size=n)
            is_new_merchant = np.random.binomial(1, 0.15, size=n)
            cross_border = np.random.binomial(1, 0.08, size=n)
            hour_sin = np.sin(2 * np.pi * hours / 24)
            hour_cos = np.cos(2 * np.pi * hours / 24)

        category = np.random.choice(
            categories, size=n,
            p=cat_weights_fraud if is_fraud else cat_weights_legit
        )
        cat_map = {c: i for i, c in enumerate(categories)}
        category_encoded = np.array([cat_map[c] for c in category])

        return pd.DataFrame({
            "amount": np.clip(amount, 0.01, 50000),
            "amount_log": np.log1p(np.clip(amount, 0.01, 50000)),
            "hour": hours,
            "hour_sin": hour_sin,
            "hour_cos": hour_cos,
            "geo_distance_km": np.clip(geo_distance, 0, 20000),
            "velocity_1h": velocity_1h,
            "velocity_24h": velocity_24h,
            "merchant_risk_score": merchant_risk,
            "device_age_days": np.clip(device_age_days, 0, 3650),
            "is_new_merchant": is_new_merchant,
            "cross_border": cross_border,
            "category_encoded": category_encoded,
            "is_fraud": int(is_fraud),
        })

    legit_df = make_transactions(n_legit, is_fraud=False)
    fraud_df = make_transactions(n_fraud, is_fraud=True)
    df = pd.concat([legit_df, fraud_df]).sample(frac=1, random_state=42).reset_index(drop=True)
    return df


FEATURE_COLS = [
    "amount_log", "hour_sin", "hour_cos",
    "geo_distance_km", "velocity_1h", "velocity_24h",
    "merchant_risk_score", "device_age_days",
    "is_new_merchant", "cross_border", "category_encoded"
]


def train_xgboost(X_train, y_train, X_val, y_val):
    scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
    model = xgb.XGBClassifier(
        n_estimators=400,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        scale_pos_weight=scale_pos_weight,
        eval_metric="aucpr",
        early_stopping_rounds=30,
        random_state=42,
        n_jobs=-1,
        verbosity=0
    )
    model.fit(
        X_train, y_train,
        eval_set=[(X_val, y_val)],
        verbose=False
    )
    return model


def train_isolation_forest(X_train):
    iso = IsolationForest(
        n_estimators=200,
        contamination=0.025,
        random_state=42,
        n_jobs=-1
    )
    iso.fit(X_train)
    return iso


def compute_shap_explainer(model, X_sample):
    explainer = shap.TreeExplainer(model)
    return explainer


def main():
    print("Generating synthetic transaction data...")
    df = generate_synthetic_data(50000)
    print(f"  Total: {len(df)} | Fraud: {df.is_fraud.sum()} ({df.is_fraud.mean()*100:.1f}%)")

    X = df[FEATURE_COLS].values
    y = df["is_fraud"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )
    X_train, X_val, y_train, y_val = train_test_split(
        X_train, y_train, test_size=0.15, stratify=y_train, random_state=42
    )

    scaler = StandardScaler()
    X_train_sc = scaler.fit_transform(X_train)
    X_val_sc = scaler.transform(X_val)
    X_test_sc = scaler.transform(X_test)

    print("Training XGBoost classifier...")
    xgb_model = train_xgboost(X_train_sc, y_train, X_val_sc, y_val)

    print("Training Isolation Forest anomaly detector...")
    iso_model = train_isolation_forest(X_train_sc)

    y_pred_proba = xgb_model.predict_proba(X_test_sc)[:, 1]
    y_pred = (y_pred_proba >= 0.5).astype(int)

    auc_roc = roc_auc_score(y_test, y_pred_proba)
    avg_precision = average_precision_score(y_test, y_pred_proba)

    metrics = {
        "auc_roc": round(auc_roc, 4),
        "avg_precision": round(avg_precision, 4),
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
        "fraud_rate": round(float(y.mean()), 4),
        "trained_at": datetime.utcnow().isoformat(),
        "feature_cols": FEATURE_COLS
    }
    print(f"  AUC-ROC: {auc_roc:.4f} | Avg Precision: {avg_precision:.4f}")
    print(classification_report(y_test, y_pred, target_names=["legit","fraud"]))

    # Persist artifacts
    with open(f"{DATA_DIR}/xgb_model.pkl", "wb") as f:
        pickle.dump(xgb_model, f)
    with open(f"{DATA_DIR}/iso_model.pkl", "wb") as f:
        pickle.dump(iso_model, f)
    with open(f"{DATA_DIR}/scaler.pkl", "wb") as f:
        pickle.dump(scaler, f)
    with open(f"{DATA_DIR}/metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"Artifacts saved to {DATA_DIR}/")
    return metrics


if __name__ == "__main__":
    main()
