from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np
import pickle
import logging
from datetime import datetime
from rules import apply_rules


app = FastAPI(
    title="FraudShield API",
    version="1.0.0",
    description="Hybrid ML + Rule Based Fraud Detection System"
)

MODEL_VERSION = "v1.0"


logging.basicConfig(
    filename="fraudshield.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


try:
    with open("fraud_model.pkl", "rb") as f:
        model = pickle.load(f)
except Exception as e:
    logging.error(f"Model loading failed: {e}")
    raise RuntimeError("Failed to load ML model")

class Transaction(BaseModel):
    amount: float = Field(..., gt=0)
    hour: int = Field(..., ge=0, le=23)
    location_match: int = Field(..., ge=0, le=1)
    device_match: int = Field(..., ge=0, le=1)
    failed_attempts: int = Field(..., ge=0)


@app.post("/predict")
def predict(tx: Transaction):
    try:
        features = np.array([[
            tx.amount,
            tx.hour,
            tx.location_match,
            tx.device_match,
            tx.failed_attempts
        ]])

        ml_prob = model.predict_proba(features)[0][1]
        ml_score = round(float(ml_prob * 100), 2)

        rule_result = apply_rules(tx.dict())
        rule_score = float(rule_result.get("rule_score", 0))
        flags = rule_result.get("flags", [])

        ml_weight = 0.6
        rule_weight = 0.4
        final_score = round((ml_score * ml_weight) + (rule_score * rule_weight), 2)

        if final_score >= 70:
            status = "BLOCKED"
        elif final_score >= 40:
            status = "FLAGGED"
        else:
            status = "ALLOWED"

        logging.info(
            f"Transaction: {tx.dict()} | "
            f"ML Score: {ml_score} | "
            f"Rule Score: {rule_score} | "
            f"Final Score: {final_score} | "
            f"Status: {status}"
        )

        return {
            "timestamp": datetime.utcnow(),
            "model_version": MODEL_VERSION,
            "risk_score": final_score,
            "status": status,
            "ml_score": ml_score,
            "rule_score": rule_score,
            "flags": flags
        }

    except Exception as e:
        logging.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

@app.get("/")
def home():
    return {
        "message": "FraudShield API is running",
        "model_version": MODEL_VERSION
    }