<div align="center">

# 🛡️ FinSentinel
### AI-Powered Transaction Intelligence Platform

**Built by [Ajit Mukund Joshi](https://github.com/Ajitjoshi07) — B.Tech Artificial Intelligence & Data Science**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-finsentinel--ui.onrender.com-blue?style=for-the-badge)](https://finsentinel-ui.onrender.com)
[![API Docs](https://img.shields.io/badge/📖%20API%20Docs-Swagger%20UI-green?style=for-the-badge)](https://finsentinel.onrender.com/docs)
[![GitHub](https://img.shields.io/badge/GitHub-Ajitjoshi07-black?style=for-the-badge&logo=github)](https://github.com/Ajitjoshi07)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ajit%20Joshi-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ajit-joshi-ai-engineer?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
[![LeetCode](https://img.shields.io/badge/LeetCode-ajit__joshi__-orange?style=for-the-badge)](https://leetcode.com/u/ajit_joshi_/)

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green?logo=fastapi)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![XGBoost](https://img.shields.io/badge/XGBoost-2.0-orange)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)

### 🌐 [Live Dashboard](https://finsentinel-ui.onrender.com) &nbsp;|&nbsp; 📖 [API Docs](https://finsentinel.onrender.com/docs) &nbsp;|&nbsp; 🔧 [Backend Health](https://finsentinel.onrender.com/api/v1/health)

</div>

---

## 👨‍💻 About the Builder

**Ajit Mukund Joshi** is an AI Engineer and Software Developer with a B.Tech in Artificial Intelligence & Data Science. He specializes in end-to-end machine learning pipelines, full-stack development, and building production-grade AI systems that solve real-world problems.

FinSentinel was built to demonstrate the depth of engineering required at companies like Mastercard — not just a fraud detection model, but the complete intelligence platform around it.

| Platform | Link |
|----------|------|
| 🐙 GitHub | [github.com/Ajitjoshi07](https://github.com/Ajitjoshi07) |
| 💼 LinkedIn | [Ajit Joshi — AI Engineer](https://www.linkedin.com/in/ajit-joshi-ai-engineer?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app) |
| 🧩 LeetCode | [leetcode.com/u/ajit_joshi_/](https://leetcode.com/u/ajit_joshi_/) |

---

## 🎯 What Is FinSentinel?

FinSentinel is a **full-stack, production-grade fraud detection and transaction intelligence platform** — the kind of system that companies like Mastercard, Visa, Stripe, and PayPal run internally to protect millions of card transactions every day.

Every transaction is:
1. **Scored in real-time** by XGBoost fraud classifier + Isolation Forest anomaly detector
2. **Explained** with SHAP feature attribution — the system tells you *why* it was flagged
3. **Routed to an alert queue** where analysts review, confirm fraud, or dismiss false positives
4. **Streamed live** to the dashboard via WebSocket

---

## 📊 Model Performance

| Metric | Score |
|--------|-------|
| **AUC-ROC** | **1.0000** |
| **Average Precision** | **0.9997** |
| **Fraud Recall** | **100%** |
| **Precision (fraud class)** | **98%** |
| **Training Samples** | 50,000 |
| **Real Fraud Rate** | 2.5% |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              React Dashboard — finsentinel-ui.onrender.com       │
│  Overview · Live Feed · Alert Queue · Transactions · ML · About  │
└──────────────────────┬──────────────────────────────────────────┘
                       │ REST API + WebSocket
┌──────────────────────▼──────────────────────────────────────────┐
│           FastAPI Backend — finsentinel.onrender.com             │
│  Transaction Router · Alert Engine · Analytics API · WebSocket  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  XGBoost Classifier · Isolation Forest · SHAP Explainer  │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────────┬───────────────────────────┘
           │                          │
    ┌──────▼──────┐            ┌──────▼──────┐
    │  PostgreSQL  │            │    Redis     │
    └─────────────┘            └─────────────┘
```

---

## ✨ Features

### 🏠 Intelligence Overview Dashboard
KPI cards, transaction volume chart, risk distribution donut, fraud by category, hourly activity heatmap, recent transactions feed — all updating live every 10 seconds.

### ⚡ Live Transaction Feed
Real-time WebSocket stream. Filter by risk level, toggle flagged-only, click any transaction for full SHAP explanation panel.

### 🚨 Alert Queue — Case Management
Full analyst workflow: OPEN → REVIEWING → CONFIRMED_FRAUD / FALSE_POSITIVE / ESCALATED. One-click confirm or dismiss with audit trail and notes.

### 🔍 Transaction Browser
Search by merchant/card, filter by risk level, paginated table, full SHAP detail on click.

### 🧠 SHAP Explanation Panel
Per-transaction waterfall chart showing exactly which features drove the fraud score — red = increases risk, green = decreases risk.

### 🤖 ML Intelligence Page
Model performance radar chart, feature importance bar chart, algorithm stack details, AUC-ROC score, training metadata.

### ⚡ Transaction Simulator
4 scenarios: Mixed Reality, Fraud Storm, Clean Traffic, Velocity Burst. Auto Mode generates 3 transactions every 2 seconds for live demos.

### 👤 About Me Page
Developer profile with skills, projects, education, and links.

---

## 🛠️ Tech Stack

**Backend:** FastAPI · XGBoost · Isolation Forest · SHAP · SQLAlchemy · PostgreSQL · Pydantic · Uvicorn

**Frontend:** React 18 · TypeScript · Zustand · Recharts · WebSocket · Custom CSS (Syne + Space Grotesk + JetBrains Mono)

**DevOps:** Docker · docker-compose · GitHub Actions CI/CD · Render · nginx · pytest (13/13 tests)

---

## 🚀 Quick Start (Local)

```bash
git clone https://github.com/Ajitjoshi07/finsentinel.git
cd finsentinel
```

**Terminal 1 — Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python -m app.ml.train
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
# Windows PowerShell:
$env:REACT_APP_API_URL="http://localhost:8000/api/v1"; npm start
```

Open `http://localhost:3000` → Go to **Simulator** → Click **Run** to generate data.

---

## 🌐 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Health check |
| `POST` | `/api/v1/transactions` | Score transaction with ML |
| `GET` | `/api/v1/transactions` | List with filters |
| `GET` | `/api/v1/alerts` | List alerts by status/risk |
| `PATCH` | `/api/v1/alerts/{id}` | Update alert status |
| `POST` | `/api/v1/simulate` | Generate synthetic transactions |
| `GET` | `/api/v1/analytics/dashboard` | KPI stats |
| `GET` | `/api/v1/analytics/risk-distribution` | Risk breakdown |
| `GET` | `/api/v1/analytics/category-breakdown` | Fraud by category |
| `GET` | `/api/v1/analytics/hourly` | Hourly volume |
| `GET` | `/api/v1/analytics/timeseries` | 30-min time series |
| `GET` | `/api/v1/model/info` | ML model metadata |
| `WS` | `/api/v1/ws/feed` | Live WebSocket stream |

Full Swagger docs: [finsentinel.onrender.com/docs](https://finsentinel.onrender.com/docs)

---

## ✅ Tests

```bash
cd backend && pytest tests/ -v
# 13 passed
```

---

## 📁 Project Structure

```
finsentinel/
├── backend/
│   ├── app/api/routes.py          # 16 endpoints + WebSocket
│   ├── app/ml/train.py            # XGBoost + Isolation Forest
│   ├── app/ml/inference.py        # Real-time prediction + SHAP
│   ├── app/models/db_models.py    # SQLAlchemy ORM
│   ├── app/services/simulator.py  # Transaction generator
│   ├── tests/test_api.py          # 13 tests
│   └── main.py
├── frontend/src/
│   ├── pages/                     # 7 pages
│   ├── components/dashboard/      # SHAP panel
│   └── store/                     # Zustand state
├── docker-compose.yml
├── render.yaml
└── .github/workflows/ci.yml
```

---

<div align="center">

**FinSentinel v1.0.0** · Built by **Ajit Mukund Joshi** · B.Tech AI & Data Science · 2026

*Portfolio project — transaction data is entirely synthetic*

</div>
