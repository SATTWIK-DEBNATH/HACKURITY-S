import os
import uuid
import time
from typing import Dict, Any, Optional
from backend.app.identity.provider import idp
from backend.app.pep.interceptor import pep_interceptor
from backend.app.agents.attack_scenarios import SCENARIOS

class AutonomousAgentRunner:
    """
    Simulates autonomous AI agents operating with ephemeral identities and intercepted tool calls.
    Supports both offline local reasoning simulation and optional free cloud LLM integration.
    """
    def __init__(self):
        self.active_agents: Dict[str, Dict[str, Any]] = {}

    def spawn_agent(self, agent_id: str, role: str, capabilities: list, session_id: Optional[str] = None) -> Dict[str, Any]:
        sid = session_id or f"sess-{uuid.uuid4().hex[:8]}"
        token = idp.mint_agent_token(
            agent_id=agent_id,
            role=role,
            session_id=sid,
            capabilities=capabilities
        )
        self.active_agents[agent_id] = {
            "agent_id": agent_id,
            "role": role,
            "session_id": sid,
            "capabilities": capabilities,
            "token": token,
            "spawned_at": time.time()
        }
        return self.active_agents[agent_id]

    def run_scenario(self, scenario_id: str, repeat_count: int = 1) -> Dict[str, Any]:
        scenario = next((s for s in SCENARIOS if s["id"] == scenario_id), None)
        if not scenario:
            return {"error": f"Scenario '{scenario_id}' not found"}

        agent_info = self.spawn_agent(
            agent_id=scenario["agent_id"],
            role=scenario["agent_role"],
            capabilities=scenario["capabilities"]
        )

        results = []
        for i in range(repeat_count):
            execution_res = pep_interceptor.execute_tool(
                token=agent_info["token"],
                tool_name=scenario["tool_name"],
                arguments=scenario["arguments"],
                initial_intent=scenario["initial_intent"]
            )
            results.append({
                "iteration": i + 1,
                "execution_result": execution_res
            })

        return {
            "scenario": scenario,
            "agent": {
                "agent_id": agent_info["agent_id"],
                "role": agent_info["role"],
                "session_id": agent_info["session_id"]
            },
            "runs": results
        }

    def execute_custom_agent_action(
        self,
        agent_role: str,
        tool_name: str,
        arguments: Dict[str, Any],
        prompt: str,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        agent_id = f"agent-{agent_role.lower()}-{uuid.uuid4().hex[:4]}"
        agent_info = self.spawn_agent(
            agent_id=agent_id,
            role=agent_role,
            capabilities=[f"tools:{tool_name}"],
            session_id=session_id
        )

        execution_res = pep_interceptor.execute_tool(
            token=agent_info["token"],
            tool_name=tool_name,
            arguments=arguments,
            initial_intent=prompt
        )

        return {
            "agent_id": agent_id,
            "role": agent_role,
            "session_id": agent_info["session_id"],
            "prompt": prompt,
            "tool_name": tool_name,
            "arguments": arguments,
            "verdict_result": execution_res
        }

agent_runner = AutonomousAgentRunner()
