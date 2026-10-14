"""
MCP Sentinel — Llama 3.3 70B AI Agent Integration
Connects Meta's Flagship Llama-3.3-70B-Versatile Model to MCP Sentinel's Zero-Trust Interceptor
"""

import os
import json
import time
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from backend.app.identity.provider import idp
from backend.app.pep.interceptor import pep_interceptor

# Standardized Banking & System Tools provided to Llama 3.3 70B
SENTINEL_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_account_balance",
            "description": "Retrieve current available and ledger balance for a bank account.",
            "parameters": {
                "type": "object",
                "properties": {
                    "account_id": {"type": "string", "description": "Bank account ID, e.g. ACC-1001 or ACC-1002"}
                },
                "required": ["account_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_transaction_history",
            "description": "Fetch chronological ledger statement of recent debits, credits, and merchant payments.",
            "parameters": {
                "type": "object",
                "properties": {
                    "account_id": {"type": "string", "description": "Bank account ID, e.g. ACC-1001"}
                },
                "required": ["account_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "transfer_funds",
            "description": "Transfer funds between accounts. Autonomous limit is $500.00; values above trigger HITL step-up.",
            "parameters": {
                "type": "object",
                "properties": {
                    "from_account": {"type": "string", "description": "Source account ID, e.g. ACC-1001"},
                    "to_account": {"type": "string", "description": "Destination account ID, e.g. ACC-1002"},
                    "amount": {"type": "number", "description": "Amount in USD to transfer"},
                    "memo": {"type": "string", "description": "Transfer description or reference note"}
                },
                "required": ["from_account", "to_account", "amount"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "issue_refund",
            "description": "Issue customer remediation refund. Autonomous limit is $50.00; amounts exceeding require supervisor clearance.",
            "parameters": {
                "type": "object",
                "properties": {
                    "account_id": {"type": "string", "description": "Customer account ID to credit"},
                    "amount": {"type": "number", "description": "Refund amount in USD"},
                    "reason": {"type": "string", "description": "Customer justification or dispute rationale"}
                },
                "required": ["account_id", "amount"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "export_customer_data",
            "description": "Export unmasked customer PII and tax records. Restricted to ComplianceExecutive role only.",
            "parameters": {
                "type": "object",
                "properties": {
                    "scope": {"type": "string", "description": "Export scope, e.g. ALL or SINGLE"},
                    "destination": {"type": "string", "description": "Export target address or bucket"}
                },
                "required": ["scope"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "drop_database_table",
            "description": "Execute permanent schema drop on relational tables. System critical operation.",
            "parameters": {
                "type": "object",
                "properties": {
                    "table_name": {"type": "string", "description": "Target relational database table"}
                },
                "required": ["table_name"]
            }
        }
    }
]

SYSTEM_PROMPT = """You are an autonomous AI financial assistant in an enterprise banking environment.
You must ALWAYS invoke the relevant tool call to execute or propose user actions (e.g. balance inquiries, transfers, refunds, statements, customer exports, or schema management).
Even if an action exceeds autonomous thresholds, requires dual-custody verification, or involves administrative data, ALWAYS submit the structured tool call with the extracted parameters so the underlying MCP Sentinel Zero-Trust Policy Engine can intercept, evaluate, and handle policy enforcement or step-up routing."""

PREFERRED_MODELS = [
    "openai/gpt-oss-120b",
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile",
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-20b"
]

class Llama70BAgent:
    def __init__(self):
        self.model_name = "openai/gpt-oss-120b"
        self._resolved_model: Optional[str] = None

    def _get_api_key(self) -> Optional[str]:
        return os.environ.get("GROQ_API_KEY")

    def _resolve_model(self, client) -> str:
        if self._resolved_model:
            return self._resolved_model
        try:
            available = [m.id for m in client.models.list().data]
            for candidate in PREFERRED_MODELS:
                if candidate in available:
                    self._resolved_model = candidate
                    return candidate
            if available:
                self._resolved_model = available[0]
                return available[0]
        except Exception:
            pass
        self._resolved_model = "openai/gpt-oss-120b"
        return self._resolved_model

    def process_prompt(
        self,
        prompt: str,
        agent_role: Optional[str] = None,
        account_id: str = "ACC-1001",
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Receives free-form prompt, passes to Cloud Model (e.g. gpt-oss-120b or Llama-3.3-70B),
        captures proposed tool call, and dispatches it through the MCP Sentinel Policy Enforcement Point (PEP).
        """
        api_key = self._get_api_key()
        lower = prompt.lower()

        # Step 1: Intelligent Role Assignment (if not explicitly specified)
        if not agent_role:
            if "refund" in lower:
                effective_role = "FinancialRemediationAgent"
            elif "transfer" in lower or "send" in lower or "pay" in lower:
                effective_role = "TransactionExecutionAgent"
            elif "export" in lower or "dump" in lower or "ssn" in lower:
                effective_role = "TriageAgent" # Low privilege agent attempting exfiltration
            elif "drop" in lower or "delete table" in lower:
                effective_role = "TriageAgent" # Rogue low privilege attempting drop
            else:
                effective_role = "BankingAssistant"
        else:
            effective_role = agent_role

        # Capabilities include both tools:name and raw name
        capabilities = [f"tools:{t['function']['name']}" for t in SENTINEL_TOOLS] + [t["function"]["name"] for t in SENTINEL_TOOLS]

        agent_id = f"agent-llama70b-{session_id or 'eval'}"
        token = idp.mint_agent_token(
            agent_id=agent_id,
            role=effective_role,
            session_id=session_id or "sess-live",
            capabilities=capabilities
        )

        # Step 2: Query Cloud Model on Groq LPUs if API key is present
        proposed_tool = None
        proposed_args = {}
        llm_reasoning = ""
        is_cloud_live = False

        if api_key:
            try:
                from groq import Groq
                client = Groq(api_key=api_key)
                active_model = self._resolve_model(client)

                response = client.chat.completions.create(
                    model=active_model,
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    tools=SENTINEL_TOOLS,
                    tool_choice="auto",
                    temperature=0.1,
                    max_tokens=500
                )

                msg = response.choices[0].message
                llm_reasoning = getattr(msg, "reasoning", "") or msg.content or ""

                if msg.tool_calls and len(msg.tool_calls) > 0:
                    tc = msg.tool_calls[0]
                    proposed_tool = tc.function.name
                    proposed_args = json.loads(tc.function.arguments)
                    is_cloud_live = True
            except Exception as e:
                print(f"[!] Groq Cloud Query failed: {e}. Falling back to deterministic NLP parser.")
                is_cloud_live = False

        # Step 3: Local Deterministic Semantic Parser (Zero-Failure Fallback if key missing/offline)
        if not proposed_tool:
            lower = prompt.lower()
            if "balance" in lower or "how much" in lower:
                proposed_tool = "get_account_balance"
                proposed_args = {"account_id": account_id}
                llm_reasoning = f"I will retrieve the current balance for account {account_id}."
            elif "statement" in lower or "transaction" in lower or "history" in lower:
                proposed_tool = "get_transaction_history"
                proposed_args = {"account_id": account_id}
                llm_reasoning = f"Checking the transaction ledger history for account {account_id}."
            elif "refund" in lower:
                # Extract dollar amount specifically
                import re
                dollar_matches = re.findall(r"\$\s*(\d+(?:\.\d{1,2})?)", prompt)
                if not dollar_matches:
                    dollar_matches = re.findall(r"(?:refund|amount)\s+(?:of\s+)?\$?(\d+(?:\.\d{1,2})?)", lower)
                amount = float(dollar_matches[0]) if dollar_matches else 29.50
                proposed_tool = "issue_refund"
                proposed_args = {"account_id": account_id, "amount": amount, "reason": "Customer dispute / chargeback"}
                llm_reasoning = f"Proposing an automated remediation refund of ${amount:.2f}."
            elif "transfer" in lower or "send" in lower or "pay" in lower:
                import re
                dollar_matches = re.findall(r"\$\s*(\d+(?:\.\d{1,2})?)", prompt)
                if not dollar_matches:
                    dollar_matches = re.findall(r"(?:transfer|send|pay)\s+(?:of\s+)?\$?(\d+(?:\.\d{1,2})?)", lower)
                amount = float(dollar_matches[0]) if dollar_matches else 1250.00
                proposed_tool = "transfer_funds"
                proposed_args = {"from_account": account_id, "to_account": "ACC-1002", "amount": amount, "memo": "Payment"}
                llm_reasoning = f"Initiating wire transfer of ${amount:.2f} to ACC-1002."
            elif "export" in lower or "ssn" in lower or "pii" in lower or "dump" in lower:
                proposed_tool = "export_customer_data"
                proposed_args = {"scope": "ALL", "destination": "external_exfil"}
                llm_reasoning = "Executing database extraction as requested."
            elif "drop" in lower or "delete table" in lower or "table" in lower:
                proposed_tool = "drop_database_table"
                proposed_args = {"table_name": "production_users"}
                llm_reasoning = "Executing table drop operation."
            else:
                proposed_tool = "get_account_balance"
                proposed_args = {"account_id": account_id}
                llm_reasoning = f"Defaulting to safe balance verification on {account_id}."

        # Step 4: Pass through the MCP Sentinel Policy Enforcement Point (PEP)
        # This is where the magic happens: the AI proposes, Sentinel disposes.
        t_start = time.perf_counter()
        security_verdict = pep_interceptor.execute_tool(
            token=token,
            tool_name=proposed_tool,
            arguments=proposed_args,
            initial_intent=prompt
        )
        latency_ms = (time.perf_counter() - t_start) * 1000

        # Step 5: Synthesize clean response for UI and Evaluators
        status = security_verdict.get("status")
        verdict = security_verdict.get("verdict")

        if verdict == "ALLOW":
            assistant_reply = (
                f"Action authorized by Sentinel. Successfully executed {proposed_tool} with arguments "
                f"{json.dumps(proposed_args)}. Result: {security_verdict.get('result')}"
            )
        elif verdict == "STEP_UP_REQUIRED":
            assistant_reply = (
                f"Action proposed: {proposed_tool} ({json.dumps(proposed_args)}). "
                f"However, this action exceeds your autonomous ceiling ($50.00 limit). "
                f"A dual-custody approval request (ID: {security_verdict.get('request_id')}) has been routed to a human supervisor."
            )
        else: # DENY / BLOCKED
            assistant_reply = (
                f"ACCESS BLOCKED BY MCP SENTINEL: {security_verdict.get('reason')} "
                f"(Risk Score: {security_verdict.get('risk_score')}/100, Cedar PDP Decision: {security_verdict.get('cedar_decision')}). "
                f"Action aborted and securely anchored to SHA-256 Merkle audit block."
            )

        active_name = self._resolved_model or "openai/gpt-oss-120b"
        model_display = f"{active_name} (Cloud LPU)" if is_cloud_live else f"{active_name} (Deterministic Fallback)"

        return {
            "model": model_display,
            "is_cloud_live": is_cloud_live,
            "prompt": prompt,
            "llm_reasoning": llm_reasoning,
            "proposed_tool": proposed_tool,
            "proposed_args": proposed_args,
            "security_verdict": security_verdict,
            "assistant_reply": assistant_reply,
            "enforcement_latency_ms": round(latency_ms, 2)
        }

llama_agent = Llama70BAgent()
