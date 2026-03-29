<div align="center">

# 🛡️ FinSentinel
### AI-Powered Transaction Intelligence Platform

**Built by [Ajit Mukund Joshi](https://github.com/Ajitjoshi07) — B.Tech Artificial Intelligence & Data Science**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-finsentinel--ui.onrender.com-blue?style=for-the-badge)](https://finsentinel-ui.onrender.com)
[![API Docs](https://img.shields.io/badge/API%20Docs-Swagger%20UI-green?style=for-the-badge)](https://finsentinel-api.onrender.com/docs)
[![GitHub](https://img.shields.io/badge/GitHub-Ajitjoshi07-black?style=for-the-badge&logo=github)](https://github.com/Ajitjoshi07)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ajit%20Joshi-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ajit-joshi-ai-engineer)
[![LeetCode](https://img.shields.io/badge/LeetCode-ajit__joshi__-orange?style=for-the-badge)](https://leetcode.com/u/ajit_joshi_/)

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green?logo=fastapi)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![XGBoost](https://img.shields.io/badge/XGBoost-2.0-orange)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)

</div>

---

## 👨‍💻 About the Builder

**Ajit Mukund Joshi** is an AI Engineer and Software Developer with a B.Tech in Artificial Intelligence & Data Science. He specializes in end-to-end machine learning pipelines, full-stack development, and building production-grade AI systems that solve real-world problems.

FinSentinel was built to demonstrate the depth of engineering required at companies like Mastercard — not just a fraud detection model, but the complete intelligence platform around it: case management, real-time streaming, explainable AI, analyst workflows, and full DevOps.

- 🔗 GitHub: [github.com/Ajitjoshi07](https://github.com/Ajitjoshi07)
- 💼 LinkedIn: [linkedin.com/in/ajit-joshi-ai-engineer](https://www.linkedin.com/in/ajit-joshi-ai-engineer)
- 🧩 LeetCode: [leetcode.com/u/ajit_joshi_/](https://leetcode.com/u/ajit_joshi_/)

---

## 🎯 What Is FinSentinel?

FinSentinel is a **full-stack, production-grade fraud detection and transaction intelligence platform** — the kind of system that companies like Mastercard, Visa, Stripe, and PayPal run internally to protect millions of card transactions every day.

In simple terms: every time someone swipes a credit card, a system like FinSentinel runs in the background within milliseconds to decide — is this transaction legitimate or fraudulent? If it looks suspicious, it blocks the transaction or creates an alert for a human analyst to review.

### The Real-World Problem It Solves

Global card fraud costs the financial industry over **$33 billion per year**. Every payment company needs:

- ✅ A system that scores transactions in real-time (within 50-100ms)
- ✅ Machine learning models that catch fraud patterns humans cannot see
- ✅ Explainability — not just "fraud detected" but **WHY** it was flagged
- ✅ A case management system where fraud analysts review and action alerts
- ✅ Live dashboards showing fraud trends, geographic hotspots, and risk distribution

**FinSentinel solves all five of these problems in a single platform.**

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
| **Test Set Size** | 10,000 |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  React Dashboard (TypeScript)                    │
│  Overview · Live Feed · Alert Queue · Transactions · ML · About  │
└──────────────────────┬──────────────────────────────────────────┘
                       │ REST API + WebSocket
┌──────────────────────▼──────────────────────────────────────────┐
│                    FastAPI Backend (Python)                       │
│                                                                  │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────┐  │
│  │  Transaction  │  │ Alert Engine  │  │   Analytics API      │  │
│  │    Router    │  │  Case Mgmt    │  │  Timeseries/Geo/KPI  │  │
│  └──────┬───────┘  └───────────────┘  └──────────────────────┘  │
│         │                                                        │
│  ┌──────▼──────────────────────────────────────────────────┐    │
│  │                  ML Inference Engine                      │    │
│  │    XGBoost Classifier · Isolation Forest · SHAP          │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────┬──────────────────────────┬───────────────────────────┘
           │                          │
    ┌──────▼──────┐            ┌──────▼──────┐
    │  PostgreSQL  │            │    Redis     │
    │  (primary)  │            │   (cache)    │
    └─────────────┘            └─────────────┘
```

---

## ✨ Features — Every Page Explained

### 🏠 1. Intelligence Overview Dashboard (`/`)
The command centre — the first page a fraud operations manager sees every morning.

- **KPI Cards**: Total Transactions, Fraud Flagged, Transactions Blocked, Open Alerts — all updating live every 10 seconds
- **Transaction Volume Chart**: Area chart showing last 30 minutes of traffic with total vs flagged overlay
- **Risk Distribution Donut**: Visual breakdown of LOW/MEDIUM/HIGH/CRITICAL transactions
- **Fraud by Category**: Horizontal bar chart — which merchant categories have highest fraud rate
- **Hourly Activity**: Bar chart showing transaction volume by hour — spots off-hours attacks
- **Recent Transactions**: Live scrolling list with risk badges and one-click SHAP detail

### ⚡ 2. Live Transaction Feed (`/live`)
Real-time WebSocket stream of every transaction being processed.

- **WebSocket connection** — green dot = live, auto-reconnects if disconnected
- **Filter by risk level**: ALL / CRITICAL / HIGH / MEDIUM / LOW
- **Toggle Flagged Only** — show only suspicious transactions
- **Left border colour coding**: red = CRITICAL, orange = HIGH
- **Click any row** → full SHAP explanation panel opens
- **Cross-border** tagged with `XB`, blocked transactions tagged with `BLOCKED`
- Captures last **200 transactions** in memory

### 🚨 3. Alert Queue — Case Management (`/alerts`)
The most operationally important page. Every HIGH and CRITICAL transaction auto-creates an alert.

**Alert lifecycle:**
- `OPEN` → `REVIEWING` → `CONFIRMED_FRAUD` / `FALSE_POSITIVE` / `ESCALATED`

**Per alert:**
- Risk level badge, fraud probability %, transaction amount
- AI-generated plain-English explanation of why it was flagged
- Top risk factors as tags (e.g., "Geographic distance", "High velocity")
- Expandable panel with notes input
- One-click **Confirm Fraud** or **Dismiss** buttons
- Full audit trail — who reviewed, when, with what notes

### 🔍 4. Transaction Browser (`/transactions`)
Searchable, filterable database of every transaction — for investigations and compliance.

- Search by merchant name or card number (last 4 digits)
- Filter by risk level
- Toggle Flagged Only
- Pagination (50 per page)
- Click any row for full SHAP detail panel
- Status icons: ⊘ blocked, ⚑ flagged, ✓ clear

### 🧠 5. SHAP Explanation Panel (slide-over)
The feature that separates FinSentinel from a simple classifier. Opens on any transaction click.

- Transaction amount in large display with risk colour coding
- Three score bars: XGBoost fraud probability + Isolation Forest anomaly score + Ensemble combined
- Metadata grid: card, category, location, time, velocity, geo distance
- AI explanation paragraph in plain English
- **SHAP waterfall bar chart**: red = pushes toward fraud, green = pushes toward legitimate
- Bar length = importance of that feature to this specific decision

### 🤖 6. ML Intelligence (`/model`)
Exposes the model's internals for full transparency.

- Model performance cards: AUC-ROC, Average Precision, training samples, version
- Algorithm stack cards with hyperparameter details
- **Performance Radar Chart**: 6-dimensional quality view
- **Feature Importance chart**: which of 11 features matters most
- Full feature engineering pipeline list

### ⚡ 7. Transaction Simulator (`/simulate`)
Generates synthetic transactions to demo the system without real card data.

**Four scenarios:**
- **Mixed Reality**: 85% normal, 15% suspicious — real-world distribution
- **Fraud Storm**: High-velocity cross-border attacks and large anomalous amounts
- **Clean Traffic**: Low-risk domestic transactions
- **Velocity Burst**: Card testing attack pattern

**Auto Mode**: Generates 3 transactions every 2 seconds automatically — perfect for demos.

### 👤 8. About Me (`/about`)
Developer profile page with skills, projects, education, and links.

---

## 🔬 Feature Engineering Pipeline

| Feature | Description |
|---------|-------------|
| `amount_log` | Log-transformed transaction amount |
| `hour_sin` | Cyclical time encoding (sine) |
| `hour_cos` | Cyclical time encoding (cosine) |
| `geo_distance_km` | Haversine distance from home location |
| `velocity_1h` | Transaction count in last 1 hour |
| `velocity_24h` | Transaction count in last 24 hours |
| `merchant_risk_score` | Pre-computed merchant risk (0–1) |
| `device_age_days` | Days since device registration |
| `is_new_merchant` | First-time merchant flag |
| `cross_border` | International transaction flag |
| `category_encoded` | Merchant category encoding |

---

## 🛠️ Full Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | Async REST API + WebSocket server |
| **XGBoost** | Gradient-boosted fraud classifier |
| **Isolation Forest** | Unsupervised anomaly detection |
| **SHAP TreeExplainer** | Per-transaction feature attribution |
| **SQLAlchemy** | ORM with PostgreSQL/SQLite support |
| **Pydantic v2** | Request/response validation |
| **Pandas + NumPy** | Feature engineering pipeline |
| **Uvicorn** | Production ASGI server |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | Component-based UI framework |
| **TypeScript** | Type-safe development |
| **Zustand** | Lightweight global state management |
| **Recharts** | Area, Bar, Pie, Radar charts |
| **WebSocket API** | Real-time transaction streaming |
| **React Hot Toast** | User notifications |
| **Syne + Space Grotesk + JetBrains Mono** | Professional typography |

### DevOps & Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Docker + docker-compose** | Full local stack containerization |
| **GitHub Actions** | CI/CD — test → build → deploy |
| **Render** | Cloud deployment platform |
| **nginx** | Production static file serving |
| **pytest** | 13 automated tests — 100% pass |

---

## 📁 Project Structure

```
finsentinel/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py          # All 16 API endpoints + WebSocket
│   │   ├── core/
│   │   │   └── database.py        # SQLAlchemy setup
│   │   ├── ml/
│   │   │   ├── train.py           # XGBoost + Isolation Forest training
│   │   │   ├── inference.py       # Real-time prediction + SHAP
│   │   │   └── artifacts/         # Trained model binaries
│   │   ├── models/
│   │   │   ├── db_models.py       # Database ORM models
│   │   │   └── schemas.py         # Pydantic request/response schemas
│   │   └── services/
│   │       └── simulator.py       # Synthetic transaction generator
│   ├── tests/
│   │   └── test_api.py            # 13 tests — 100% passing
│   ├── main.py                    # FastAPI app entrypoint
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   └── src/
│       ├── api/client.ts          # Axios API client
│       ├── store/index.ts         # Zustand global state
│       ├── components/
│       │   ├── layout/Sidebar.tsx
│       │   └── dashboard/TransactionPanel.tsx
│       └── pages/
│           ├── Overview.tsx       # KPI dashboard
│           ├── LiveFeed.tsx       # Real-time feed
│           ├── AlertQueue.tsx     # Case management
│           ├── Transactions.tsx   # Transaction browser
│           ├── MLIntelligence.tsx # Model metrics
│           ├── Simulator.tsx      # Data generator
│           └── About.tsx          # Developer profile
│
├── docker-compose.yml
├── render.yaml
└── .github/workflows/ci.yml
```

---

## 🚀 Quick Start (Local)

### Option 1 — Docker (recommended)
```bash
git clone https://github.com/Ajitjoshi07/finsentinel.git
cd finsentinel
docker-compose up --build
```
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2 — Manual Setup

**Terminal 1 — Backend:**
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

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

# Mac/Linux:
REACT_APP_API_URL=http://localhost:8000/api/v1 npm start
```

Open `http://localhost:3000` → Go to **Simulator** page → Click **Run** to generate data.

---

## 🌐 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Health check |
| `POST` | `/api/v1/transactions` | Submit transaction for ML scoring |
| `GET` | `/api/v1/transactions` | List all transactions with filters |
| `GET` | `/api/v1/transactions/{id}` | Get transaction + SHAP values |
| `GET` | `/api/v1/alerts` | List alerts (filter by status/risk) |
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
| `WS` | `/api/v1/ws/feed` | Live transaction WebSocket stream |

Full interactive docs: `http://localhost:8000/docs`

---

## ✅ Running Tests

```bash
cd backend
pytest tests/ -v
# 13 passed in ~13s
```

---

## 🌍 Deployment (Render)

This project includes a `render.yaml` blueprint. See deployment steps in the project documentation.

---

## 📬 Connect with Me

| Platform | Link |
|----------|------|
| 🐙 GitHub | [github.com/Ajitjoshi07](https://github.com/Ajitjoshi07) |
| 💼 LinkedIn | [linkedin.com/in/ajit-joshi-ai-engineer](https://www.linkedin.com/in/ajit-joshi-ai-engineer) |
| 🧩 LeetCode | [leetcode.com/u/ajit_joshi_/](https://leetcode.com/u/ajit_joshi_/) |

---

<div align="center">

**FinSentinel v1.0.0** · Built by **Ajit Mukund Joshi** · B.Tech AI & Data Science · 2026

*This is a portfolio project. Transaction data is entirely synthetic.*

</div>
