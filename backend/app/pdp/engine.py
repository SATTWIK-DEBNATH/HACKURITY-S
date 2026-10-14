import time
import uuid
import hmac
import hashlib
from typing import Dict, Any, Optional, List
from pydantic import BaseModel
from backend.app.config import settings
from backend.app.identity.provider import AgentIdentityClaims, idp
from backend.app.pdp.risk_scorer import risk_scorer
from backend.app.pdp.cedar_engine import cedar_engine
from backend.app.audit.ledger import audit_ledger

class AuthorizationVerdict:
    ALLOW = "ALLOW"
    STEP_UP_REQUIRED = "STEP_UP_REQUIRED"
    DENY = "DENY"

class ExecutionTicket(BaseModel):
    ticket_id: str
    tool_name: str
    arguments_hash: str
    session_id: str
    agent_id: str
    expires_at: float
    signature: str

class PendingApproval(BaseModel):
    request_id: str
    agent_id: str
    role: str
    session_id: str
    tool_name: str
    arguments: Dict[str, Any]
    risk_score: int
    risk_factors: List[str]
    created_at: float
    status: str # "PENDING", "APPROVED", "REJECTED"

class PolicyDecisionPoint:
    """
    Continuous Zero-Trust Policy Decision Point (PDP)
    """
    def __init__(self):
        self.pending_approvals: Dict[str, PendingApproval] = {}

    def _generate_execution_ticket(self, agent_id: str, session_id: str, tool_name: str, arguments: Dict[str, Any]) -> ExecutionTicket:
        ticket_id = f"TICK-{uuid.uuid4().hex[:12].upper()}"
        expires_at = time.time() + settings.STEP_UP_TOKEN_EXPIRE_SECONDS
        args_repr = str(sorted(arguments.items()))
        args_hash = hashlib.sha256(args_repr.encode('utf-8')).hexdigest()
        
        raw_msg = f"{ticket_id}:{agent_id}:{tool_name}:{args_hash}:{expires_at}"
        signature = hmac.new(
            settings.JWT_SECRET_KEY.encode('utf-8'),
            raw_msg.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        return ExecutionTicket(
            ticket_id=ticket_id,
            tool_name=tool_name,
            arguments_hash=args_hash,
            session_id=session_id,
            agent_id=agent_id,
            expires_at=expires_at,
            signature=signature
        )

    def verify_execution_ticket(self, ticket: ExecutionTicket, tool_name: str, arguments: Dict[str, Any]) -> bool:
        if time.time() > ticket.expires_at:
            return False
        
        args_repr = str(sorted(arguments.items()))
        args_hash = hashlib.sha256(args_repr.encode('utf-8')).hexdigest()
        if ticket.arguments_hash != args_hash or ticket.tool_name != tool_name:
            return False

        raw_msg = f"{ticket.ticket_id}:{ticket.agent_id}:{tool_name}:{args_hash}:{ticket.expires_at}"
        expected_sig = hmac.new(
            settings.JWT_SECRET_KEY.encode('utf-8'),
            raw_msg.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(ticket.signature, expected_sig)

    def evaluate_request(
        self,
        token: str,
        tool_name: str,
        arguments: Dict[str, Any],
        initial_intent: str = ""
    ) -> Dict[str, Any]:
        # 1. Attest Workload Identity
        claims = idp.verify_agent_token(token)
        if not claims:
            event = {
                "verdict": AuthorizationVerdict.DENY,
                "reason": "Cryptographic Workload Identity Invalid or Expired",
                "risk_score": 100,
                "tool_name": tool_name,
                "arguments": arguments,
                "agent_id": "UNKNOWN",
                "timestamp": time.time()
            }
            audit_ledger.append_event(event)
            return event

        # 2. Risk Calculation
        risk_score, factors, breakdown = risk_scorer.evaluate_risk(
            claims, tool_name, arguments, initial_intent
        )

        # 2b. Formally Verified AWS Cedar Policy Evaluation
        cedar_allowed, cedar_decision = cedar_engine.evaluate_cedar(
            agent_role=claims.role,
            tool_name=tool_name,
            resource_id=str(arguments.get("account_id") or "Core"),
            context_args=arguments
        )
        if not cedar_allowed and "Decision.Deny" in cedar_decision:
            factors.append(f"AWS Cedar Engine: {cedar_decision} (Formally Verified Forbid)")

        # 3. Decision Logic
        is_high_value_step_up = (
            tool_name in ["transfer_funds", "issue_refund", "process_refund"]
            and float(arguments.get("amount", 0.0)) > settings.HIGH_VALUE_THRESHOLD_USD
            and risk_score <= settings.RISK_STEP_UP_THRESHOLD
        )

        if risk_score > settings.RISK_STEP_UP_THRESHOLD:
            verdict = AuthorizationVerdict.DENY
            reason = f"High Risk Score ({risk_score}/100) triggered Zero-Trust Block"
            ticket = None
            req_id = None
        elif is_high_value_step_up or risk_score > settings.RISK_ALLOW_THRESHOLD:
            verdict = AuthorizationVerdict.STEP_UP_REQUIRED
            reason = f"Moderate/Elevated Risk Score ({risk_score}/100) requires Human-In-The-Loop Step-Up"
            req_id = f"REQ-{uuid.uuid4().hex[:8].upper()}"
            pending = PendingApproval(
                request_id=req_id,
                agent_id=claims.agent_id,
                role=claims.role,
                session_id=claims.session_id,
                tool_name=tool_name,
                arguments=arguments,
                risk_score=risk_score,
                risk_factors=factors,
                created_at=time.time(),
                status="PENDING"
            )
            self.pending_approvals[req_id] = pending
            ticket = None
        elif not cedar_allowed:
            verdict = AuthorizationVerdict.DENY
            reason = f"AWS Cedar Policy PDP Denied: {cedar_decision}"
            ticket = None
            req_id = None
        else:
            verdict = AuthorizationVerdict.ALLOW
            reason = f"Risk Score ({risk_score}/100) within trusted baseline"
            ticket = self._generate_execution_ticket(claims.agent_id, claims.session_id, tool_name, arguments)
            req_id = None
            # Update session velocity/amount
            amount = float(arguments.get("amount", 0.0)) if "amount" in arguments else 0.0
            is_refund = tool_name == "process_refund"
            risk_scorer.get_or_create_session(claims.session_id).record_action(amount, is_refund)

        # 4. Immutable Audit Ledger Entry
        decision_event = {
            "verdict": verdict,
            "cedar_decision": cedar_decision,
            "agent_id": claims.agent_id,
            "role": claims.role,
            "session_id": claims.session_id,
            "tool_name": tool_name,
            "arguments": arguments,
            "risk_score": risk_score,
            "risk_factors": factors,
            "reason": reason,
            "request_id": req_id,
            "timestamp": time.time()
        }
        block = audit_ledger.append_event(decision_event)

        return {
            "verdict": verdict,
            "cedar_decision": cedar_decision,
            "reason": reason,
            "risk_score": risk_score,
            "risk_factors": factors,
            "request_id": req_id,
            "execution_ticket": ticket.model_dump() if ticket else None,
            "audit_block_index": block.index,
            "audit_block_hash": block.block_hash
        }

    def resolve_step_up(self, request_id: str, approved: bool, supervisor_id: str = "Admin-SOC-01") -> Dict[str, Any]:
        pending = self.pending_approvals.get(request_id)
        if not pending:
            return {"error": "Pending approval request not found"}
        
        if pending.status != "PENDING":
            return {"error": f"Request already resolved with status '{pending.status}'"}

        if approved:
            pending.status = "APPROVED"
            ticket = self._generate_execution_ticket(
                pending.agent_id, pending.session_id, pending.tool_name, pending.arguments
            )
            amount = float(pending.arguments.get("amount", 0.0)) if "amount" in pending.arguments else 0.0
            risk_scorer.get_or_create_session(pending.session_id).record_action(amount, pending.tool_name == "process_refund")

            event = {
                "verdict": "STEP_UP_APPROVED",
                "request_id": request_id,
                "supervisor_id": supervisor_id,
                "agent_id": pending.agent_id,
                "tool_name": pending.tool_name,
                "arguments": pending.arguments,
                "timestamp": time.time()
            }
            audit_ledger.append_event(event)
            return {
                "status": "APPROVED",
                "execution_ticket": ticket.model_dump(),
                "message": f"Action approved by supervisor {supervisor_id}"
            }
        else:
            pending.status = "REJECTED"
            event = {
                "verdict": "STEP_UP_REJECTED",
                "request_id": request_id,
                "supervisor_id": supervisor_id,
                "agent_id": pending.agent_id,
                "tool_name": pending.tool_name,
                "arguments": pending.arguments,
                "timestamp": time.time()
            }
            audit_ledger.append_event(event)
            return {
                "status": "REJECTED",
                "execution_ticket": None,
                "message": f"Action rejected by supervisor {supervisor_id}"
            }

    def get_pending_approvals(self) -> List[PendingApproval]:
        return [p for p in self.pending_approvals.values() if p.status == "PENDING"]

pdp_engine = PolicyDecisionPoint()
