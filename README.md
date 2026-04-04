<div align="center">

# 🛡️ FinSentinel
### AI-Powered Transaction Intelligence Platform

**Built by [Ajit Mukund Joshi](https://github.com/Ajitjoshi07) · B.Tech Artificial Intelligence & Data Science**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-finsentinel--ui.onrender.com-3b82f6?style=for-the-badge)](https://finsentinel-ui.onrender.com)
[![API Docs](https://img.shields.io/badge/📖_API_Docs-Swagger_UI-10b981?style=for-the-badge)](https://finsentinel.onrender.com/docs)
[![Health Check](https://img.shields.io/badge/❤️_Health-API_Status-8b5cf6?style=for-the-badge)](https://finsentinel.onrender.com/api/v1/health)

[![GitHub](https://img.shields.io/badge/GitHub-Ajitjoshi07-black?style=flat-square&logo=github)](https://github.com/Ajitjoshi07)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ajit_Joshi-0a66c2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/ajit-joshi-ai-engineer)
[![LeetCode](https://img.shields.io/badge/LeetCode-ajit__joshi__-f89f1b?style=flat-square)](https://leetcode.com/u/ajit_joshi_/)

![Python](https://img.shields.io/badge/Python-3.11-3776ab?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-2.0-ff6600)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ed?logo=docker&logoColor=white)
![AUC-ROC](https://img.shields.io/badge/AUC--ROC-1.0000-gold)
![Tests](https://img.shields.io/badge/Tests-13%2F13_Passing-brightgreen)

</div>

---

> ⚠️ **First time loading?** The backend runs on a free tier and sleeps after 15 minutes of inactivity.
> Open the [health check](https://finsentinel.onrender.com/api/v1/health) first, wait for `{"status":"ok"}`, then open the [live demo](https://finsentinel-ui.onrender.com).

---

## 👨‍💻 About the Builder

**Ajit Mukund Joshi** is an AI Engineer and Software Developer with a B.Tech in Artificial Intelligence & Data Science. He specializes in end-to-end ML pipelines, full-stack development, and building production-grade AI systems that solve real-world problems.

FinSentinel demonstrates the complete engineering depth required at companies like Mastercard — not just a model, but the entire fraud intelligence platform: real-time scoring, explainability, case management, WebSocket streaming, and full DevOps.

| Platform | Link |
|---|---|
| 🐙 GitHub | [github.com/Ajitjoshi07](https://github.com/Ajitjoshi07) |
| 💼 LinkedIn | [Ajit Joshi — AI Engineer](https://www.linkedin.com/in/ajit-joshi-ai-engineer) |
| 🧩 LeetCode | [ajit_joshi_](https://leetcode.com/u/ajit_joshi_/) |
| 🔗 CodeSync | [Real-time Collaborative Code Editor](https://ajitjoshi-codesync.onrender.com) |

---

## 🎯 What Is FinSentinel?

FinSentinel is a **full-stack, production-grade fraud detection and transaction intelligence platform** — the kind of system that Mastercard, Visa, Stripe, and PayPal run internally to protect millions of card transactions every day.

Every transaction processed by FinSentinel goes through this pipeline:
```
Card Transaction
      ↓
Feature Engineering (11 features extracted)
      ↓
XGBoost Classifier  →  Fraud Probability Score
Isolation Forest    →  Anomaly Score
      ↓
Ensemble Score = 75% XGBoost + 25% Isolation Forest
      ↓
Risk Level: LOW / MEDIUM / HIGH / CRITICAL
      ↓
SHAP Explainer → "Why was this flagged?"
      ↓
Alert Created → Analyst Queue → Dashboard Updated via WebSocket
```

---

## 📊 Model Performance

| Metric | Score |
|---|---|
| **AUC-ROC** | **1.0000** |
| **Average Precision** | **0.9997** |
| **Fraud Recall** | **100%** |
| **Precision (fraud)** | **98%** |
| **F1 Score** | **98.8%** |
| Training Samples | 50,000 |
| Fraud Rate in Data | 2.5% |
| Test Set Size | 10,000 |

---

## 🏗️ System Architecture
```
┌──────────────────────────────────────────────────────────────┐
│           React Dashboard · finsentinel-ui.onrender.com       │
│  Overview · Live Feed · Alerts · Transactions · ML · Guide   │
└─────────────────────┬────────────────────────────────────────┘
                      │  REST API + WebSocket (wss://)
┌─────────────────────▼────────────────────────────────────────┐
│          FastAPI Backend · finsentinel.onrender.com           │
│                                                              │
│  ┌─────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Transaction API  │  │ Alert Engine │  │ Analytics API  │  │
│  │  16 endpoints   │  │  Case Mgmt   │  │ KPI/Charts/Geo │  │
│  └────────┬────────┘  └──────────────┘  └────────────────┘  │
│           │                                                   │
│  ┌────────▼──────────────────────────────────────────────┐   │
│  │              ML Inference Engine                       │   │
│  │  XGBoost (75%) + Isolation Forest (25%) + SHAP        │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────┬───────────────────────┬───────────────────────┘
               │                       │
        ┌──────▼──────┐         ┌──────▼──────┐
        │  PostgreSQL  │         │    Redis     │
        └─────────────┘         └─────────────┘
```

---

## ✨ Features

### 🏠 Intelligence Overview Dashboard
The command centre for fraud operations. Auto-refreshes every 10 seconds.
- **8 KPI Cards** — Total Transactions, Fraud Flagged, Blocked, Open Alerts, Txns Last Hour, Avg Fraud Probability, AUC-ROC, Avg Precision
- **Transaction Volume** — 30-minute area chart with total vs flagged overlay
- **Risk Distribution** — Donut chart showing LOW / MEDIUM / HIGH / CRITICAL breakdown
- **Fraud by Category** — Bar chart showing fraud rate per merchant category
- **Hourly Activity** — Transaction volume heatmap by hour of day
- **Recent Transactions** — Live scrolling feed with one-click SHAP detail panel

### ⚡ Live Transaction Feed
Real-time WebSocket stream — zero polling, pure event-driven architecture.
- Green dot = connected, auto-reconnects every 3 seconds if disconnected
- Filter by risk level · Toggle flagged-only view
- Red border = CRITICAL, orange = HIGH risk
- Click any transaction row → SHAP explanation slide-over panel

### 🚨 Alert Queue — Case Management
Full fraud analyst workflow matching enterprise fraud operations.

| Status | Meaning |
|---|---|
| `OPEN` | New alert, unreviewed |
| `REVIEWING` | Analyst currently investigating |
| `CONFIRMED_FRAUD` | Fraud confirmed, card actioned |
| `FALSE_POSITIVE` | Model was wrong, dismissed |
| `ESCALATED` | Needs senior analyst review |

Each alert includes AI-generated plain-English explanation, SHAP top risk factors, full audit trail with reviewer name, timestamp, and notes.

### 🔍 Transaction Browser
- Search by merchant name or card number (last 4 digits)
- Filter by risk level · Toggle flagged-only
- Paginated (50 per page)
- Full SHAP detail panel on click

### 🧠 SHAP Explanation Panel
The feature that separates FinSentinel from a black-box classifier.
- Three score bars: XGBoost + Isolation Forest + Ensemble
- SHAP waterfall chart — red bars push toward fraud, green bars reduce risk
- Bar length shows how much each feature mattered to THIS specific decision
- Plain-English AI-generated explanation per transaction

### 🤖 ML Intelligence Page
- Performance radar chart across 6 dimensions
- Feature importance bar chart (11 features)
- Algorithm stack with hyperparameters
- Training metadata and model version info

### ⚡ Transaction Simulator
4 scenarios to stress-test the fraud engine:

| Scenario | Description |
|---|---|
| 📊 Mixed Reality | 85% normal, 15% suspicious — real-world distribution |
| ⚡ Fraud Storm | High-velocity cross-border attacks, large anomalous amounts |
| ✅ Clean Traffic | Low-risk domestic transactions of a trusted cardholder |
| 🚀 Velocity Burst | Card testing attack — rapid succession micro-transactions |

Auto Mode generates 3 transactions every 2 seconds — with a Stop button to pause anytime.

### 📖 User Guide
Built-in interactive step-by-step guide explaining every feature — perfect for first-time users and recruiter demos.

### 👤 About Me
Developer profile page with skills, projects, education, and all links.

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.111 | Async REST API + WebSocket server |
| XGBoost | 2.0 | Gradient-boosted fraud classifier |
| Isolation Forest | sklearn 1.5 | Unsupervised anomaly detection |
| SHAP | 0.45 | Per-transaction explainability |
| SQLAlchemy | 2.0 | ORM — PostgreSQL + SQLite |
| Pydantic | v2 | Request/response validation |
| Pandas + NumPy | latest | Feature engineering pipeline |
| Uvicorn | 0.30 | Production ASGI server |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | Component-based UI, fully type-safe |
| Zustand | Lightweight global state management |
| Recharts | Area, Bar, Pie, Radar charts |
| WebSocket API | Real-time transaction streaming |
| Axios | HTTP client with 30s timeout |
| React Hot Toast | User notifications |

### DevOps
| Technology | Purpose |
|---|---|
| Docker + docker-compose | Full local stack containerization |
| GitHub Actions | CI/CD — automated tests on every push |
| Render | Cloud deployment platform |
| PostgreSQL | Production database |
| pytest | 13 automated API tests |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Option 1 — Docker (Recommended)
```bash
git clone https://github.com/Ajitjoshi07/finsentinel.git
cd finsentinel
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs

### Option 2 — Manual Setup

**Terminal 1 — Backend:**
```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train ML models (runs once, takes ~30 seconds)
python -m app.ml.train

# Start API server
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps

# Windows PowerShell
$env:REACT_APP_API_URL="http://localhost:8000/api/v1"; npm start

# Mac/Linux
REACT_APP_API_URL=http://localhost:8000/api/v1 npm start
```

Open **http://localhost:3000** → Go to **Simulator** → Select **Mixed Reality** → Click **Run** → Explore all pages.

---

## 🌐 Live Demo Links

| Page | URL |
|---|---|
| 🏠 Dashboard | [finsentinel-ui.onrender.com](https://finsentinel-ui.onrender.com) |
| ⚡ Live Feed | [finsentinel-ui.onrender.com/live](https://finsentinel-ui.onrender.com/live) |
| 🚨 Alert Queue | [finsentinel-ui.onrender.com/alerts](https://finsentinel-ui.onrender.com/alerts) |
| ⚡ Simulator | [finsentinel-ui.onrender.com/simulate](https://finsentinel-ui.onrender.com/simulate) |
| 📖 User Guide | [finsentinel-ui.onrender.com/guide](https://finsentinel-ui.onrender.com/guide) |
| 📖 API Docs | [finsentinel.onrender.com/docs](https://finsentinel.onrender.com/docs) |
| ❤️ Health | [finsentinel.onrender.com/api/v1/health](https://finsentinel.onrender.com/api/v1/health) |

---

## 🌐 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Health check |
| `POST` | `/api/v1/transactions` | Score transaction with ML |
| `GET` | `/api/v1/transactions` | List with filters |
| `GET` | `/api/v1/transactions/{id}` | Transaction + SHAP values |
| `GET` | `/api/v1/alerts` | List alerts by status/risk |
| `PATCH` | `/api/v1/alerts/{id}` | Update alert status |
| `POST` | `/api/v1/simulate` | Generate synthetic transactions |
| `GET` | `/api/v1/analytics/dashboard` | KPI statistics |
| `GET` | `/api/v1/analytics/risk-distribution` | Risk level breakdown |
| `GET` | `/api/v1/analytics/category-breakdown` | Fraud by merchant category |
| `GET` | `/api/v1/analytics/hourly` | Hourly transaction volume |
| `GET` | `/api/v1/analytics/timeseries` | 30-minute time series |
| `GET` | `/api/v1/analytics/geo-bubbles` | Geographic fraud clusters |
| `GET` | `/api/v1/analytics/top-cards-at-risk` | Highest risk cards |
| `GET` | `/api/v1/model/info` | ML model metadata + metrics |
| `WS` | `/api/v1/ws/feed` | Live WebSocket stream |

Full interactive docs: [finsentinel.onrender.com/docs](https://finsentinel.onrender.com/docs)

---

## 📁 Project Structure
```
finsentinel/
├── backend/
│   ├── app/
│   │   ├── api/routes.py          # All 16 endpoints + WebSocket
│   │   ├── core/database.py       # SQLAlchemy — PostgreSQL/SQLite
│   │   ├── ml/
│   │   │   ├── train.py           # XGBoost + Isolation Forest training
│   │   │   ├── inference.py       # Real-time prediction + SHAP
│   │   │   └── artifacts/         # Trained model binaries (.pkl)
│   │   ├── models/
│   │   │   ├── db_models.py       # SQLAlchemy ORM models
│   │   │   └── schemas.py         # Pydantic schemas
│   │   └── services/simulator.py  # Synthetic transaction generator
│   ├── tests/test_api.py          # 13 tests — 100% passing
│   ├── main.py                    # FastAPI entrypoint
│   └── requirements.txt
├── frontend/src/
│   ├── api/client.ts              # Axios + WebSocket client
│   ├── store/index.ts             # Zustand global state
│   ├── components/layout/         # Sidebar navigation
│   └── pages/
│       ├── Overview.tsx           # KPI dashboard + 4 charts
│       ├── LiveFeed.tsx           # Real-time WebSocket feed
│       ├── AlertQueue.tsx         # Case management workflow
│       ├── Transactions.tsx       # Transaction browser
│       ├── MLIntelligence.tsx     # Model metrics + charts
│       ├── Simulator.tsx          # 4-scenario data generator
│       ├── UserGuide.tsx          # Interactive user manual
│       └── About.tsx              # Developer profile
├── docker-compose.yml
├── render.yaml
└── .github/workflows/ci.yml
```

---

## ✅ Running Tests
```bash
cd backend
pytest tests/ -v
# 13 passed
```

---

## 🎬 Demo Walkthrough for Recruiters

Follow these 8 steps to see every feature in under 5 minutes:

1. **Wake backend** → Open [health check](https://finsentinel.onrender.com/api/v1/health) → wait for `{"status":"ok"}`
2. **Generate data** → Go to [Simulator](https://finsentinel-ui.onrender.com/simulate) → Select **Fraud Storm** → Click **Run** (20 transactions)
3. **Watch live stream** → Go to [Live Feed](https://finsentinel-ui.onrender.com/live) → See CRITICAL transactions streaming in real-time
4. **Open SHAP panel** → Click any CRITICAL transaction → See exactly WHY it was flagged by the ML model
5. **Review dashboard** → Go to [Overview](https://finsentinel-ui.onrender.com) → See all 4 charts populated with live data
6. **Action an alert** → Go to [Alert Queue](https://finsentinel-ui.onrender.com/alerts) → Click an alert → Confirm Fraud
7. **Check ML metrics** → Go to [ML Intelligence](https://finsentinel-ui.onrender.com/model) → AUC-ROC: 1.0000
8. **Read the guide** → Go to [User Guide](https://finsentinel-ui.onrender.com/guide) → Full interactive feature walkthrough

---

## ☁️ Deployment

Deployed on [Render](https://render.com) free tier.

| Service | Type | URL |
|---|---|---|
| `finsentinel` | Web Service (Python) | [finsentinel.onrender.com](https://finsentinel.onrender.com) |
| `finsentinel-ui` | Static Site (React) | [finsentinel-ui.onrender.com](https://finsentinel-ui.onrender.com) |
| `finsentinel-db` | PostgreSQL | Internal |

> **Note:** Free tier services sleep after 15 minutes of inactivity. First request takes 30–60 seconds to wake up. Open the health check URL first before sharing the demo link with anyone.

---

## 🔬 Feature Engineering Pipeline

| Feature | Description |
|---|---|
| `amount_log` | Log-transformed transaction amount |
| `hour_sin` / `hour_cos` | Cyclical time encoding (prevents 23:59 → 00:00 discontinuity) |
| `geo_distance_km` | Haversine distance from cardholder's home location |
| `velocity_1h` | Number of transactions in the last 1 hour |
| `velocity_24h` | Number of transactions in the last 24 hours |
| `merchant_risk_score` | Pre-computed merchant risk score (0–1) |
| `device_age_days` | Days since device/account registration |
| `is_new_merchant` | First-time merchant flag |
| `cross_border` | International transaction flag |
| `category_encoded` | Merchant category label encoding |

---

## 🔗 Other Projects

| Project | Description | Links |
|---|---|---|
| **CodeSync** | Real-time collaborative code editor built with Yjs CRDT + WebSocket + Monaco Editor. Multiple developers can code together simultaneously in the browser. | [GitHub](https://github.com/Ajitjoshi07/Ajitjoshi-codesync) · [Live Demo](https://ajitjoshi-codesync.onrender.com) |

---

<div align="center">

**FinSentinel v1.0.0** · Built by **Ajit Mukund Joshi** · B.Tech Artificial Intelligence & Data Science · 2026

*All transaction data is entirely synthetic. No real financial data is used anywhere in this project.*

⭐ If you found this useful, consider starring the repo!

</div>
