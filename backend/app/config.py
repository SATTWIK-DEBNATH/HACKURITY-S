import os
from pydantic import BaseModel

class SecuritySettings(BaseModel):
    # Cryptographic keys
    JWT_SECRET_KEY: str = "sentinagent-secret-zero-trust-2026-hackathon"
    JWT_ALGORITHM: str = "HS256"
    TOKEN_EXPIRE_MINUTES: int = 15
    STEP_UP_TOKEN_EXPIRE_SECONDS: int = 60

    # Risk Scoring Thresholds
    RISK_ALLOW_THRESHOLD: int = 30       # 0 - 30: Direct Allow
    RISK_STEP_UP_THRESHOLD: int = 80     # 31 - 80: Step-Up (HITL Human Approval)
                                         # > 80: Immediate Hard Deny (Prompt Injection, Destructive)

    # Blast Radius & Cumulative Velocity Limits
    MAX_ACTIONS_PER_MINUTE: int = 5
    MAX_CUMULATIVE_TRANSFER_USD: float = 1000.0
    HIGH_VALUE_THRESHOLD_USD: float = 500.0

    # Demo Simulation Settings
    SIMULATION_LATENCY_MS: int = 150

settings = SecuritySettings()
