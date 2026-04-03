import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import create_tables
from app.ml.inference import engine as ml_engine
from app.api.routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    ml_engine.load()
    print("FinSentinel API ready")
    yield


app = FastAPI(
    title="FinSentinel API",
    description="AI-Powered Transaction Intelligence Platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.get("/")
def root():
    return {"service": "FinSentinel", "version": "1.0.0", "docs": "/docs"}
