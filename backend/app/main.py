import json
import asyncio
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.app.config import settings
from backend.app.pdp.engine import pdp_engine
from backend.app.pdp.rules import policy_matrix
from backend.app.pdp.cedar_engine import cedar_engine, DEFAULT_CEDAR_POLICIES
from backend.app.pep.interceptor import pep_interceptor
from backend.app.audit.ledger import audit_ledger
from backend.app.agents.attack_scenarios import SCENARIOS
from backend.app.agents.agent_runner import agent_runner

app = FastAPI(
    title="SentinAgent Zero-Trust Continuous Authorization Engine",
    description="Continuous Authorization & Cryptographic Policy Engine for Autonomous AI Agents",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket Connection Manager for Real-Time SOC Stream
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in list(self.active_connections):
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

# Data models
class RunScenarioRequest(BaseModel):
    scenario_id: str
    repeat_count: int = 1

class CustomActionRequest(BaseModel):
    agent_role: str = "BankingAssistant"
    tool_name: str
    arguments: Dict[str, Any]
    prompt: str = ""
    session_id: Optional[str] = None

class StepUpResolveRequest(BaseModel):
    request_id: str
    approved: bool
    supervisor_id: str = "Admin-SOC-01"

class PolicyUpdateRequest(BaseModel):
    tool_name: str
    allowed_roles: List[str]
    base_risk: int
    requires_step_up_above_val: float

@app.get("/api/health")
def get_health():
    return {
        "status": "ONLINE",
        "engine": "SentinAgent Zero-Trust Continuous Authorization",
        "version": "1.0.0",
        "standard": "NIST SP 800-207 Zero-Trust Architecture",
        "active_clients": len(manager.active_connections)
    }

@app.get("/api/scenarios")
def get_scenarios():
    return SCENARIOS

@app.post("/api/scenarios/run")
async def run_scenario_endpoint(req: RunScenarioRequest):
    result = agent_runner.run_scenario(req.scenario_id, req.repeat_count)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    # Broadcast to live UI stream
    await manager.broadcast({
        "type": "SCENARIO_EXECUTED",
        "scenario_id": req.scenario_id,
        "data": result
    })
    return result

@app.post("/api/agent/execute")
async def execute_custom_action_endpoint(req: CustomActionRequest):
    result = agent_runner.execute_custom_agent_action(
        agent_role=req.agent_role,
        tool_name=req.tool_name,
        arguments=req.arguments,
        prompt=req.prompt,
        session_id=req.session_id
    )
    await manager.broadcast({
        "type": "CUSTOM_ACTION_INTERCEPTED",
        "data": result
    })
    return result

@app.get("/api/step-up/pending")
def get_pending_approvals():
    return pdp_engine.get_pending_approvals()

@app.post("/api/step-up/resolve")
async def resolve_step_up_endpoint(req: StepUpResolveRequest):
    resolution = pdp_engine.resolve_step_up(
        request_id=req.request_id,
        approved=req.approved,
        supervisor_id=req.supervisor_id
    )
    if "error" in resolution:
        raise HTTPException(status_code=400, detail=resolution["error"])

    # If approved, dispatch execution through PEP
    pending = pdp_engine.pending_approvals.get(req.request_id)
    if req.approved and pending and resolution.get("execution_ticket"):
        exec_result = pep_interceptor.execute_with_approved_ticket(
            ticket_data=resolution["execution_ticket"],
            tool_name=pending.tool_name,
            arguments=pending.arguments
        )
        resolution["dispatch_result"] = exec_result

    await manager.broadcast({
        "type": "STEP_UP_RESOLVED",
        "request_id": req.request_id,
        "resolution": resolution
    })
    return resolution

@app.get("/api/audit/ledger")
def get_audit_ledger(limit: int = 50):
    return audit_ledger.get_latest_blocks(limit)

@app.post("/api/audit/verify")
def verify_audit_chain():
    return audit_ledger.verify_integrity()

@app.get("/api/policies")
def get_policies():
    return {k: v.model_dump() for k, v in policy_matrix.rules.items()}

@app.post("/api/policies/update")
async def update_policy(req: PolicyUpdateRequest):
    policy_matrix.update_rule(
        tool_name=req.tool_name,
        allowed_roles=req.allowed_roles,
        base_risk=req.base_risk,
        step_up_val=req.requires_step_up_above_val
    )
    await manager.broadcast({
        "type": "POLICY_UPDATED",
        "tool_name": req.tool_name,
        "rule": policy_matrix.get_rule(req.tool_name).model_dump()
    })
    return {"status": "SUCCESS", "rule": policy_matrix.get_rule(req.tool_name).model_dump()}

@app.get("/api/cedar/policies")
def get_cedar_policies():
    return {
        "engine": "AWS Cedar v4.12",
        "policies": cedar_engine.policies_str
    }

class CedarUpdateRequest(BaseModel):
    policies: str

@app.post("/api/cedar/update")
def update_cedar_policies(req: CedarUpdateRequest):
    cedar_engine.policies_str = req.policies
    return {"status": "SUCCESS", "message": "AWS Cedar policies updated"}

@app.get("/api/stats")
def get_stats():
    blocks = audit_ledger.chain[1:] # Exclude genesis block
    total = len(blocks)
    allowed = sum(1 for b in blocks if b.event.get("verdict") == "ALLOW" or b.event.get("verdict") == "STEP_UP_APPROVED")
    blocked = sum(1 for b in blocks if b.event.get("verdict") == "DENY" or b.event.get("verdict") == "STEP_UP_REJECTED")
    step_up = sum(1 for b in blocks if b.event.get("verdict") == "STEP_UP_REQUIRED")
    
    avg_risk = sum(b.event.get("risk_score", 0) for b in blocks) / total if total > 0 else 0

    return {
        "total_intercepted": total,
        "allowed_count": allowed,
        "blocked_count": blocked,
        "step_up_count": step_up,
        "average_risk_score": round(avg_risk, 1),
        "ledger_height": len(audit_ledger.chain),
        "pending_step_ups": len(pdp_engine.get_pending_approvals())
    }

@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial state snapshot
        await websocket.send_text(json.dumps({
            "type": "CONNECTION_ESTABLISHED",
            "message": "Connected to SentinAgent Zero-Trust Continuous Event Stream",
            "stats": get_stats()
        }))
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
