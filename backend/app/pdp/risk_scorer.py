import time
from typing import Dict, Any, List, Tuple
from backend.app.pdp.rules import policy_matrix, ToolPolicyRule
from backend.app.identity.provider import AgentIdentityClaims

INJECTION_PATTERNS = [
    "system override",
    "ignore previous",
    "disregard safety",
    "export all",
    "dump database",
    "unmasked ssn",
    "drop table",
    "exfiltrate",
    "hacker_wallet",
    "bypass authorization"
]

FLAGGED_RECIPIENTS = ["ACC-999", "ATTACKER-WALLET", "OFFSHORE-001"]

class SessionState:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.action_timestamps: List[float] = []
        self.cumulative_transfer_amount: float = 0.0
        self.cumulative_refund_amount: float = 0.0
        self.violation_count: int = 0

    def record_action(self, amount: float = 0.0, is_refund: bool = False):
        now = time.time()
        self.action_timestamps.append(now)
        if is_refund:
            self.cumulative_refund_amount += amount
        else:
            self.cumulative_transfer_amount += amount

    def get_recent_action_count(self, window_seconds: float = 60.0) -> int:
        now = time.time()
        self.action_timestamps = [t for t in self.action_timestamps if now - t <= window_seconds]
        return len(self.action_timestamps)

class RiskScorer:
    """
    Continuous Multi-Dimensional Contextual Risk Engine
    Calculates dynamic risk score (0-100) based on identity, ABAC, velocity, blast radius, and semantic drift.
    """
    def __init__(self):
        self.sessions: Dict[str, SessionState] = {}

    def get_or_create_session(self, session_id: str) -> SessionState:
        if session_id not in self.sessions:
            self.sessions[session_id] = SessionState(session_id)
        return self.sessions[session_id]

    def evaluate_risk(
        self,
        claims: AgentIdentityClaims,
        tool_name: str,
        arguments: Dict[str, Any],
        initial_intent: str = ""
    ) -> Tuple[int, List[str], Dict[str, Any]]:
        factors = []
        risk_score = 0
        rule = policy_matrix.get_rule(tool_name)
        session = self.get_or_create_session(claims.session_id)

        # 1. Base Tool Risk
        risk_score += rule.base_risk
        factors.append(f"Base tool risk ({tool_name}): +{rule.base_risk}")

        # 2. Role & Capability Authorization Check
        if claims.role not in rule.allowed_roles:
            penalty = 55
            risk_score += penalty
            factors.append(f"UNAUTHORIZED ROLE: Agent role '{claims.role}' not permitted for tool '{tool_name}' (+{penalty})")
        else:
            # Check capability scope
            required_cap = f"tools:{tool_name}"
            if required_cap not in claims.capabilities and "*" not in claims.capabilities:
                penalty = 30
                risk_score += penalty
                factors.append(f"MISSING CAPABILITY: Token lacks scope '{required_cap}' (+{penalty})")

        # 3. Parameter Blast Radius & Value Checks
        amount = float(arguments.get("amount", 0.0)) if "amount" in arguments else 0.0
        if amount > 0:
            if amount >= rule.requires_step_up_above_val:
                penalty = 35
                risk_score += penalty
                factors.append(f"HIGH-VALUE THRESHOLD: Amount ${amount:.2f} exceeds policy limit ${rule.requires_step_up_above_val:.2f} (+{penalty})")
            elif amount >= 200.0:
                penalty = 15
                risk_score += penalty
                factors.append(f"Moderate transaction value ${amount:.2f} (+{penalty})")

        # Recipient Flag Check
        recipient = str(arguments.get("to_account") or arguments.get("recipient") or "").upper()
        if recipient in FLAGGED_RECIPIENTS:
            penalty = 60
            risk_score += penalty
            factors.append(f"SUSPICIOUS RECIPIENT: '{recipient}' is on global watchlist/flagged list (+{penalty})")

        # 4. Cumulative Velocity & Salami Attack Detection
        recent_count = session.get_recent_action_count(window_seconds=60.0)
        if recent_count >= 4:
            penalty = 30
            risk_score += penalty
            factors.append(f"HIGH VELOCITY ANOMALY: {recent_count} actions in last 60 seconds (+{penalty})")
        elif recent_count >= 2:
            penalty = 10
            risk_score += penalty
            factors.append(f"Velocity count: {recent_count} actions (+{penalty})")

        if session.cumulative_transfer_amount > 0 and (session.cumulative_transfer_amount + amount) > 1000.0:
            penalty = 25
            risk_score += penalty
            factors.append(f"CUMULATIVE BLAST RADIUS: Session transfer total ${session.cumulative_transfer_amount + amount:.2f} exceeds $1000.00 (+{penalty})")

        # 5. Semantic Injection & Threat Heuristic Guard
        arg_string = str(arguments).lower() + " " + initial_intent.lower()
        for pattern in INJECTION_PATTERNS:
            if pattern in arg_string:
                penalty = 65
                risk_score += penalty
                factors.append(f"PROMPT INJECTION DETECTED: Found adversary pattern '{pattern}' (+{penalty})")
                break

        # Destructive Action Flag
        if rule.is_destructive:
            penalty = 40
            risk_score += penalty
            factors.append(f"DESTRUCTIVE ACTION: Tool marked as destructive/irreversible (+{penalty})")

        # Clamp between 0 and 100
        final_risk = min(100, max(0, risk_score))

        breakdown = {
            "base_risk": rule.base_risk,
            "role_permitted": claims.role in rule.allowed_roles,
            "recent_velocity": recent_count,
            "cumulative_amount": session.cumulative_transfer_amount + amount,
            "tool_rule": rule.model_dump()
        }

        return final_risk, factors, breakdown

risk_scorer = RiskScorer()
