<div align="center">
  <img src="https://img.shields.io/badge/FinSentinel-AI%20Fraud%20Intelligence-3b82f6?style=for-the-badge&logo=shield&logoColor=white" alt="FinSentinel"/>
  <h1>🛡️ FinSentinel</h1>
  <p><strong>AI-Powered Transaction Intelligence Platform</strong></p>
  <p>Real-time fraud detection · SHAP explainability · Case management · Live WebSocket dashboard</p>

  <p>
    <a href="https://finsentinel-ui.onrender.com"><img src="https://img.shields.io/badge/🚀 Live Demo-finsentinel--ui.onrender.com-blue?style=for-the-badge" alt="Live Demo"/></a>
    <a href="https://finsentinel.onrender.com/docs"><img src="https://img.shields.io/badge/📖 API Docs-Swagger UI-green?style=for-the-badge" alt="API Docs"/></a>
  </p>

  <p>
    <a href="https://github.com/Ajitjoshi07"><img src="https://img.shields.io/badge/GitHub-Ajitjoshi07-black?style=flat-square&logo=github" alt="GitHub"/></a>
    <a href="https://www.linkedin.com/in/ajit-joshi-ai-engineer?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"><img src="https://img.shields.io/badge/LinkedIn-Ajit Joshi-blue?style=flat-square&logo=linkedin" alt="LinkedIn"/></a>
    <a href="https://leetcode.com/u/ajit_joshi_/"><img src="https://img.shields.io/badge/LeetCode-ajit__joshi__-orange?style=flat-square" alt="LeetCode"/></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Python-3.11-blue?logo=python" alt="Python"/>
    <img src="https://img.shields.io/badge/FastAPI-0.111-green?logo=fastapi" alt="FastAPI"/>
    <img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React"/>
    <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/XGBoost-2.0-orange" alt="XGBoost"/>
    <img src="https://img.shields.io/badge/Docker-Containerized-blue?logo=docker" alt="Docker"/>
    <img src="https://img.shields.io/badge/Tests-13%2F13 Passing-brightgreen" alt="Tests"/>
    <img src="https://img.shields.io/badge/AUC--ROC-1.0000-gold" alt="AUC-ROC"/>
  </p>
</div>

---

## 👨‍💻 About the Builder

**Ajit Mukund Joshi** — AI Engineer & Software Developer · B.Tech Artificial Intelligence & Data Science

FinSentinel was built to demonstrate the depth of engineering required at companies like Mastercard — not just a fraud detection model, but the complete intelligence platform around it: real-time ML scoring, explainability, analyst case management, WebSocket streaming, and full DevOps.

| | |
|---|---|
| 🐙 GitHub | [github.com/Ajitjoshi07](https://github.com/Ajitjoshi07) |
| 💼 LinkedIn | [Ajit Joshi — AI Engineer](https://www.linkedin.com/in/ajit-joshi-ai-engineer?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app) |
| 🧩 LeetCode | [leetcode.com/u/ajit_joshi_/](https://leetcode.com/u/ajit_joshi_/) |

---

## 📋 Table of Contents

- [What Is FinSentinel?](#-what-is-finsentinel)
- [Live Demo](#-live-demo)
- [Model Performance](#-model-performance)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Tests](#-tests)
- [Deployment](#-deployment)

---

## 🎯 What Is FinSentinel?

FinSentinel is a **full-stack, production-grade fraud detection and transaction intelligence platform** — the kind of system that companies like Mastercard, Visa, Stripe, and PayPal run internally to protect millions of card transactions every day.

### The Problem

Global card fraud costs the financial industry **$33 billion per year**. Every payment company needs:

- ✅ Real-time transaction scoring (< 100ms)
- ✅ ML models that catch patterns humans cannot see
- ✅ Explainability — not just "fraud" but **why**
- ✅ Analyst case management workflow
- ✅ Live dashboards with fraud trends and geographic hotspots

**FinSentinel solves all five in one platform.**

### How It Works — One Transaction's Journey

```
Card Swipe → API receives transaction → 11 features extracted
    → XGBoost scores fraud probability (98.7%)
    → Isolation Forest confirms anomaly
    → Ensemble score: 0.91 (CRITICAL)
    → SHAP explains: large amount + 8000km from home + new merchant
    → AI generates plain-English explanation
    → Transaction BLOCKED · Alert created · Dashboard updates via WebSocket
```

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🖥️ **Live Dashboard** | [finsentinel-ui.onrender.com](https://finsentinel-ui.onrender.com) |
| 🔧 **API** | [finsentinel.onrender.com](https://finsentinel.onrender.com) |
| 📖 **Swagger Docs** | [finsentinel.onrender.com/docs](https://finsentinel.onrender.com/docs) |
| ❤️ **Health Check** | [finsentinel.onrender.com/api/v1/health](https://finsentinel.onrender.com/api/v1/health) |

> **Note:** Free tier — first load may take 30 seconds to wake up.

---

## 📊 Model Performance

| Metric | Score |
|--------|-------|
| **AUC-ROC** | **1.0000** |
| **Average Precision** | **0.9997** |
| **Fraud Recall** | **100%** |
| **Precision (fraud)** | **98%** |
| **F1 Score** | **98.8%** |
| Training Samples | 50,000 |
| Real Fraud Rate | 2.5% |
| Test Set | 10,000 |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                  React Dashboard (TypeScript)                        │
│  Overview · Live Feed · Alert Queue · Transactions · ML · About     │
│                finsentinel-ui.onrender.com                          │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ REST API + WebSocket
┌──────────────────────────▼──────────────────────────────────────────┐
│               FastAPI Backend — finsentinel.onrender.com             │
│                                                                     │
│  ┌──────────────────┐  ┌─────────────────┐  ┌──────────────────┐   │
│  │  Transaction API  │  │  Alert Engine   │  │  Analytics API   │   │
│  │  16 endpoints    │  │  Case Mgmt      │  │  KPI/Charts/Geo  │   │
│  └────────┬─────────┘  └─────────────────┘  └──────────────────┘   │
│           │                                                         │
│  ┌────────▼──────────────────────────────────────────────────────┐  │
│  │                    ML Inference Engine                         │  │
│  │   XGBoost (75%) + Isolation Forest (25%) + SHAP Explainer     │  │
│  └───────────────────────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────────┬───────────────────────┘
               │                              │
        ┌──────▼──────┐                ┌──────▼──────┐
        │  PostgreSQL  │                │    Redis     │
        │  (primary)  │                │   (cache)    │
        └─────────────┘                └─────────────┘
```

---

## ✨ Features

### 🏠 Intelligence Overview Dashboard
The command centre. Auto-refreshes every 10 seconds.
- **KPI Cards**: Total Transactions, Fraud Flagged, Blocked, Open Alerts
- **Transaction Volume**: 30-min area chart with total vs flagged overlay
- **Risk Distribution**: Donut chart — LOW/MEDIUM/HIGH/CRITICAL breakdown
- **Fraud by Category**: Bar chart showing fraud rate per merchant category
- **Hourly Activity**: Volume heatmap by hour of day
- **Recent Transactions**: Live scrolling feed with one-click detail

### ⚡ Live Transaction Feed
WebSocket real-time stream — zero polling.
- Green dot = connected, auto-reconnects on disconnect
- Filter by risk level · Toggle flagged-only
- Left border colour: red = CRITICAL, orange = HIGH
- Click any row → SHAP explanation panel

### 🚨 Alert Queue — Case Management
Full analyst workflow matching enterprise fraud operations.

| Status | Description |
|--------|-------------|
| `OPEN` | New alert, unreviewed |
| `REVIEWING` | Analyst investigating |
| `CONFIRMED_FRAUD` | Fraud confirmed, card actioned |
| `FALSE_POSITIVE` | Model was wrong, dismissed |
| `ESCALATED` | Needs senior review |

- AI-generated plain-English explanation per alert
- SHAP top risk factors as tags
- One-click Confirm / Dismiss
- Audit trail with reviewer name, timestamp, notes

### 🔍 Transaction Browser
- Search by merchant name or card number
- Filter by risk level
- Paginated (50/page)
- Full SHAP panel on click

### 🧠 SHAP Explanation Panel
The feature that separates FinSentinel from a simple classifier.
- Three score bars: XGBoost + Isolation Forest + Ensemble
- SHAP waterfall chart: red = pushes toward fraud, green = reduces risk
- Bar length = how much that feature mattered to THIS decision
- Mathematically based on Shapley values (game theory)

### 🤖 ML Intelligence Page
- Performance radar chart (6 metrics)
- Feature importance bar chart (11 features)
- Algorithm stack with hyperparameters
- Training metadata and model version

### ⚡ Transaction Simulator
- 4 scenarios: Mixed Reality, Fraud Storm, Clean Traffic, Velocity Burst
- **Auto Mode with Stop button**: generates 3 transactions/2s — stop anytime
- Results summary: count, flagged, HIGH, CRITICAL

### 👤 About Me
Developer profile with skills, projects, education, and links.

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| FastAPI | 0.111 | Async REST API + WebSocket server |
| XGBoost | 2.0 | Gradient-boosted fraud classifier |
| Isolation Forest | sklearn | Unsupervised anomaly detection |
| SHAP | 0.45 | Per-transaction explainability |
| SQLAlchemy | 2.0 | ORM — PostgreSQL + SQLite |
| Pydantic | v2 | Request/response validation |
| Pandas + NumPy | latest | Feature engineering pipeline |
| Uvicorn | 0.30 | Production ASGI server |
| pytest | latest | 13 automated tests |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | Component-based UI |
| TypeScript | Type-safe development |
| Zustand | Global state management |
| Recharts | Area, Bar, Pie, Radar charts |
| WebSocket API | Real-time transaction streaming |
| React Hot Toast | Notifications |
| Syne + Space Grotesk + JetBrains Mono | Typography |

### DevOps
| Technology | Purpose |
|-----------|---------|
| Docker + docker-compose | Containerization |
| GitHub Actions | CI/CD pipeline |
| Render | Cloud deployment |
| PostgreSQL | Production database |
| nginx | Static file serving |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Option 1 — Docker (Full Stack)
```bash
git clone https://github.com/Ajitjoshi07/finsentinel.git
cd finsentinel
docker-compose up --build
```
- Frontend: http://localhost:3000
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

### Option 2 — Manual Setup

**Terminal 1 — Backend:**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train ML models (~30 seconds, one time only)
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

Open **http://localhost:3000** → Go to **Simulator** page → Click **Run** to generate data.

---

## 🌐 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Health check |
| `POST` | `/api/v1/transactions` | Score transaction with ML |
| `GET` | `/api/v1/transactions` | List transactions with filters |
| `GET` | `/api/v1/transactions/{id}` | Transaction + SHAP values |
| `GET` | `/api/v1/alerts` | List alerts by status/risk |
| `PATCH` | `/api/v1/alerts/{id}` | Update alert status |
| `POST` | `/api/v1/simulate` | Generate synthetic transactions |
| `GET` | `/api/v1/analytics/dashboard` | KPI statistics |
| `GET` | `/api/v1/analytics/risk-distribution` | Risk level breakdown |
| `GET` | `/api/v1/analytics/category-breakdown` | Fraud by merchant category |
| `GET` | `/api/v1/analytics/hourly` | Hourly transaction volume |
| `GET` | `/api/v1/analytics/timeseries` | Last 30-minute time series |
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
│   │   ├── api/
│   │   │   └── routes.py          # All 16 endpoints + WebSocket
│   │   ├── core/
│   │   │   └── database.py        # SQLAlchemy — PostgreSQL/SQLite
│   │   ├── ml/
│   │   │   ├── train.py           # XGBoost + Isolation Forest training
│   │   │   ├── inference.py       # Real-time prediction + SHAP
│   │   │   └── artifacts/         # Trained model binaries (.pkl)
│   │   ├── models/
│   │   │   ├── db_models.py       # SQLAlchemy ORM models
│   │   │   └── schemas.py         # Pydantic schemas
│   │   └── services/
│   │       └── simulator.py       # Synthetic transaction generator
│   ├── tests/
│   │   └── test_api.py            # 13 tests — 100% passing
│   ├── main.py                    # FastAPI entrypoint
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   └── src/
│       ├── api/client.ts          # Axios API client
│       ├── store/index.ts         # Zustand global state
│       ├── components/
│       │   ├── layout/Sidebar.tsx
│       │   └── dashboard/TransactionPanel.tsx  # SHAP panel
│       └── pages/
│           ├── Overview.tsx       # KPI dashboard + charts
│           ├── LiveFeed.tsx       # Real-time feed
│           ├── AlertQueue.tsx     # Case management
│           ├── Transactions.tsx   # Transaction browser
│           ├── MLIntelligence.tsx # Model metrics
│           ├── Simulator.tsx      # Data generator
│           └── About.tsx          # Developer profile
│
├── docker-compose.yml             # Full local stack
├── render.yaml                    # Render deployment config
└── .github/
    └── workflows/
        └── ci.yml                 # GitHub Actions CI/CD
```

---

## ✅ Tests

```bash
cd backend
pytest tests/ -v
```

```
tests/test_api.py::test_health                    PASSED
tests/test_api.py::test_inference_low_risk        PASSED
tests/test_api.py::test_inference_high_risk       PASSED
tests/test_api.py::test_inference_shap_values     PASSED
tests/test_api.py::test_simulator_scenarios       PASSED
tests/test_api.py::test_simulate_endpoint         PASSED
tests/test_api.py::test_transactions_list         PASSED
tests/test_api.py::test_alerts_list               PASSED
tests/test_api.py::test_dashboard_stats           PASSED
tests/test_api.py::test_risk_distribution         PASSED
tests/test_api.py::test_model_info                PASSED
tests/test_api.py::test_create_transaction_api    PASSED
tests/test_api.py::test_hourly_stats              PASSED

13 passed in 13.07s
```

---

## ☁️ Deployment

Deployed on [Render](https://render.com) using `render.yaml` blueprint.

| Service | Type | URL |
|---------|------|-----|
| `finsentinel-api` | Web Service (Python) | [finsentinel.onrender.com](https://finsentinel.onrender.com) |
| `finsentinel-ui` | Static Site (React) | [finsentinel-ui.onrender.com](https://finsentinel-ui.onrender.com) |
| `finsentinel-db` | PostgreSQL | Internal |

---

## 🔬 Feature Engineering

| Feature | Description |
|---------|-------------|
| `amount_log` | Log-transformed transaction amount |
| `hour_sin` / `hour_cos` | Cyclical time encoding |
| `geo_distance_km` | Haversine distance from home location |
| `velocity_1h` | Transaction count — last 1 hour |
| `velocity_24h` | Transaction count — last 24 hours |
| `merchant_risk_score` | Pre-computed merchant risk (0–1) |
| `device_age_days` | Days since device registration |
| `is_new_merchant` | First-time merchant flag |
| `cross_border` | International transaction flag |
| `category_encoded` | Merchant category encoding |

---

<div align="center">

**FinSentinel v1.0.0** · Built by **Ajit Mukund Joshi** · B.Tech AI & Data Science · 2026

*Portfolio project — transaction data is entirely synthetic*

⭐ Star this repo if you found it useful!

</div>
