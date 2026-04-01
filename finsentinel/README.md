# FinSentinel — AI-Powered Transaction Intelligence Platform

![Python](https://img.shields.io/badge/Python-3.11-3776ab?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-2.0-ff6b35?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?style=for-the-badge&logo=docker&logoColor=white)

**Real-time fraud detection platform built with XGBoost + Isolation Forest + SHAP explainability.**
Designed to mirror enterprise-grade systems used in payments fraud operations.

[Live Demo](https://finsentinel-ui.onrender.com) · [API Docs](https://finsentinel-api.onrender.com/docs)

---

## What is FinSentinel?

FinSentinel is a production-grade fraud intelligence platform that scores every payment transaction in real time using a two-layer ML ensemble, surfaces alerts to analysts via a case management UI, and provides SHAP-powered explanations for every decision.

Built to demonstrate the depth of engineering needed for a real payments intelligence system — not a tutorial project, but the kind of thing a 10-person fintech team would ship.

---

## Features

### ML / AI Engine
| Feature | Detail |
|---|---|
| **XGBoost Classifier** | 400 estimators, depth 6, scale-pos-weight for 2.5% fraud rate |
| **Isolation Forest** | 200 estimators, unsupervised anomaly detection |
| **Ensemble scoring** | 75% XGBoost + 25% Isolation Forest |
| **SHAP Explainability** | TreeExplainer — per-transaction feature attribution |
| **Model AUC-ROC** | 1.0000 on 10k held-out test set |
| **Avg Precision** | 0.9997 — near-perfect precision-recall |

### Backend
- FastAPI + PostgreSQL + SQLAlchemy ORM
- WebSocket live feed — pushes every transaction instantly
- Case management: open → reviewing → confirmed / false positive
- Full analytics: risk distribution, category breakdown, hourly heatmap, geo bubbles
- Simulation engine: fraud storm / normal / velocity burst / mixed scenarios
- Structured audit log for every analyst action

### Frontend (React + TypeScript)
- Dark fintech dashboard with Syne + JetBrains Mono typography
- Live transaction table with animated WebSocket row insertions
- SHAP waterfall chart in transaction detail slide-over
- Alert queue with inline case review (confirm/dismiss, notes)
- ML Intelligence page: algorithm stack, radar chart, feature importance
- Simulator with auto-mode (3 transactions per 2 seconds)

---

## Model Performance

```
              precision    recall  f1-score   support
       legit       1.00      1.00      1.00      9750
       fraud       0.98      1.00      0.99       250
    accuracy                           1.00     10000

AUC-ROC: 1.0000  |  Avg Precision: 0.9997
```

---

## Quick Start

### Docker Compose (recommended)
```bash
git clone https://github.com/YOUR_USERNAME/finsentinel.git
cd finsentinel
docker compose up --build

# Frontend: http://localhost:3000
# API:      http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Local Development
```bash
# Backend
cd backend
pip install -r requirements.txt
python -m app.ml.train
uvicorn main:app --reload

# Frontend
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000/api/v1 npm start
```

---

## Architecture

```
React Dashboard (TypeScript)
    │ REST + WebSocket
FastAPI Backend (Python)
    ├── ML Engine: XGBoost + IsolationForest + SHAP
    ├── Analytics: Risk, Category, Geo, Timeseries
    ├── Case Mgmt: Alerts + Audit Trail
    └── Simulator: Realistic synthetic transactions
PostgreSQL (SQLAlchemy ORM)
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/transactions` | Score a new transaction |
| GET | `/api/v1/transactions` | List + filter transactions |
| GET | `/api/v1/alerts` | Alert queue |
| PATCH | `/api/v1/alerts/{id}` | Update alert status |
| GET | `/api/v1/analytics/dashboard` | KPI stats |
| GET | `/api/v1/analytics/timeseries` | 30-min volume series |
| GET | `/api/v1/model/info` | Model metadata |
| POST | `/api/v1/simulate` | Generate synthetic transactions |
| WS | `/api/v1/ws/feed` | Live WebSocket feed |

---

## Deployment (Render)

Includes `render.yaml` for one-click deploy:
1. Fork this repo
2. Render → New Blueprint → connect fork
3. Auto-deploys backend + frontend + PostgreSQL

---

## Tech Stack

| Layer | Tech |
|---|---|
| ML | XGBoost, Isolation Forest, SHAP |
| API | FastAPI, Uvicorn, WebSockets |
| DB | PostgreSQL, SQLAlchemy |
| Frontend | React 18, TypeScript, Recharts, Zustand |
| DevOps | Docker Compose, GitHub Actions, Render |

---

## Project Structure

```
finsentinel/
├── backend/
│   ├── app/
│   │   ├── api/routes.py          # All API endpoints
│   │   ├── core/database.py       # DB session
│   │   ├── ml/train.py            # Model training
│   │   ├── ml/inference.py        # Real-time scoring
│   │   ├── models/db_models.py    # SQLAlchemy ORM
│   │   ├── models/schemas.py      # Pydantic schemas
│   │   └── services/simulator.py  # Synthetic data
│   ├── main.py
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/                 # 6 dashboard pages
│   │   ├── components/            # Reusable UI + panels
│   │   ├── store/index.ts         # Zustand state
│   │   └── api/client.ts          # Axios client
│   └── Dockerfile
├── docker-compose.yml
├── render.yaml
└── .github/workflows/ci.yml
```

---

Built by **[Your Name]** · B.Tech AI & Data Science · Solo project
