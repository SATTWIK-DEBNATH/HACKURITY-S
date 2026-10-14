import time
from typing import List, Optional, Dict, Any
import jwt
from pydantic import BaseModel
from backend.app.config import settings

class AgentIdentityClaims(BaseModel):
    agent_id: str
    role: str
    session_id: str
    capabilities: List[str]
    parent_agent_id: Optional[str] = None
    issued_at: float
    expires_at: float

class IdentityProvider:
    """
    Agent Identity Provider (A-IdP)
    Issues cryptographically verifiable, ephemeral Workload Identity tokens (Agent-WID)
    adhering to Zero-Trust architecture.
    """
    def __init__(self, secret_key: str = settings.JWT_SECRET_KEY, algorithm: str = settings.JWT_ALGORITHM):
        self.secret_key = secret_key
        self.algorithm = algorithm

    def mint_agent_token(
        self,
        agent_id: str,
        role: str,
        session_id: str,
        capabilities: List[str],
        parent_agent_id: Optional[str] = None,
        duration_minutes: int = settings.TOKEN_EXPIRE_MINUTES
    ) -> str:
        now = time.time()
        payload = {
            "sub": agent_id,
            "role": role,
            "session_id": session_id,
            "capabilities": capabilities,
            "parent_agent_id": parent_agent_id,
            "iat": now,
            "exp": now + (duration_minutes * 60),
            "iss": "SentinAgent-ZeroTrust-IdP"
        }
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        return token

    def verify_agent_token(self, token: str) -> Optional[AgentIdentityClaims]:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return AgentIdentityClaims(
                agent_id=payload["sub"],
                role=payload["role"],
                session_id=payload["session_id"],
                capabilities=payload.get("capabilities", []),
                parent_agent_id=payload.get("parent_agent_id"),
                issued_at=payload["iat"],
                expires_at=payload["exp"]
            )
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return None

idp = IdentityProvider()
