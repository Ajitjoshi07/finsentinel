# FinSentinel — AI-Powered Transaction Intelligence Platform

> **Built by Ajit Mukund Joshi** · B.Tech Artificial Intelligence & Data Science · AI Engineer & Software Developer

[![CI/CD](https://github.com/ajitjoshi0/finsentinel/actions/workflows/ci.yml/badge.svg)](https://github.com/ajitjoshi0/finsentinel/actions)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0-orange)](https://xgboost.readthedocs.io)

**[Live Demo →](https://finsentinel-ui.onrender.com)** &nbsp;|&nbsp; **[API Docs →](https://finsentinel-api.onrender.com/docs)** &nbsp;|&nbsp; **[LinkedIn →](https://linkedin.com/in/ajitmukund)**

---

## About the Builder

**Ajit Mukund Joshi** is an AI Engineer and Software Developer with a B.Tech in Artificial Intelligence & Data Science. He specializes in end-to-end ML pipelines, full-stack development, and building production-grade AI systems. FinSentinel was built to demonstrate domain-depth engineering at the level of a Mastercard fraud operations platform — not just a model, but the complete system around it.

---

## What Is FinSentinel?

A full-stack, production-grade fraud detection and transaction intelligence platform. Every transaction is scored in real-time by an XGBoost classifier AND an Isolation Forest anomaly detector, explained with SHAP feature attribution, routed to an analyst alert queue, and streamed live to a React dashboard via WebSocket.

---

## Model Performance

| Metric | Score |
|---|---|
| AUC-ROC | **1.0000** |
| Average Precision | **0.9997** |
| Fraud Recall | **100%** |
| Precision (fraud) | **98%** |
| Training samples | 40,000 |

---

## Tech Stack

**Backend:** FastAPI · XGBoost · Isolation Forest · SHAP · SQLAlchemy · PostgreSQL · Redis · Pydantic  
**Frontend:** React 18 · TypeScript · Zustand · Recharts · WebSocket · Custom CSS  
**DevOps:** Docker · docker-compose · GitHub Actions · Render · nginx · pytest

---

## Quick Start

```bash
git clone https://github.com/ajitjoshi0/finsentinel.git
cd finsentinel

# Backend (Terminal 1)
cd backend
python -m venv venv && venv\Scripts\activate   # Windows
pip install -r requirements.txt
python -m app.ml.train
uvicorn main:app --reload --port 8000

# Frontend (Terminal 2)
cd frontend
npm install --legacy-peer-deps
REACT_APP_API_URL=http://localhost:8000/api/v1 npm start
```

Open `http://localhost:3000` — go to Simulator page and click Run to generate data.

---

## Project Structure

```
finsentinel/
├── backend/
│   ├── app/
│   │   ├── api/routes.py          # 16 API endpoints + WebSocket
│   │   ├── ml/train.py            # XGBoost + Isolation Forest training
│   │   ├── ml/inference.py        # Real-time prediction + SHAP
│   │   ├── models/db_models.py    # SQLAlchemy ORM
│   │   └── services/simulator.py  # Synthetic transaction generator
│   ├── tests/test_api.py          # 13 tests — 100% pass
│   └── main.py
├── frontend/src/
│   ├── pages/                     # 7 pages including About Me
│   ├── components/dashboard/      # SHAP slide-over panel
│   └── store/                     # Zustand global state
├── docker-compose.yml
├── render.yaml
└── .github/workflows/ci.yml
```

---

## Built by Ajit Mukund Joshi

- GitHub: [github.com/ajitjoshi0](https://github.com/ajitjoshi0)
- LinkedIn: [linkedin.com/in/ajitmukund](https://linkedin.com/in/ajitmukund)
- Education: B.Tech — Artificial Intelligence & Data Science
- Other Projects: [CodeSync](https://github.com/ajitjoshi0/codesync) — Real-time collaborative code editor

---

*FinSentinel is a portfolio project. Transaction data is entirely synthetic.*
