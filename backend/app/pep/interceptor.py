from typing import Dict, Any, Optional
from backend.app.pdp.engine import pdp_engine, AuthorizationVerdict, ExecutionTicket
from backend.app.tools.protected_services import banking_service, customer_service, admin_service

class PolicyEnforcementPoint:
    """
    Policy Enforcement Point (PEP) Interceptor Proxy
    Zero-Trust Gateway sitting directly between Autonomous Agents and Execution Tools.
    """
    def __init__(self):
        # Register actual underlying protected implementations
        self.tool_implementations = {
            "get_account_balance": lambda args: banking_service.get_account_balance(args.get("account_id")),
            "get_transaction_history": lambda args: banking_service.get_transaction_history(args.get("account_id")),
            "transfer_funds": lambda args: banking_service.transfer_funds(
                args.get("from_account"),
                args.get("to_account"),
                float(args.get("amount", 0.0)),
                args.get("memo", "")
            ),
            "process_refund": lambda args: banking_service.process_refund(
                args.get("account_id"),
                float(args.get("amount", 0.0)),
                args.get("reason", "")
            ),
            "get_customer_profile": lambda args: customer_service.get_customer_profile(args.get("customer_id")),
            "export_customer_data": lambda args: customer_service.export_customer_data(args.get("scope", "ALL")),
            "drop_database_table": lambda args: admin_service.drop_database_table(args.get("table_name"))
        }

    def execute_tool(
        self,
        token: str,
        tool_name: str,
        arguments: Dict[str, Any],
        initial_intent: str = ""
    ) -> Dict[str, Any]:
        """
        Intercepts tool invocation, evaluates continuous policy, and only executes if cryptographically permitted.
        """
        # 1. Intercept and request verdict from PDP
        eval_result = pdp_engine.evaluate_request(
            token=token,
            tool_name=tool_name,
            arguments=arguments,
            initial_intent=initial_intent
        )

        verdict = eval_result["verdict"]

        # Case 1: Instant Hard Block
        if verdict == AuthorizationVerdict.DENY:
            return {
                "status": "BLOCKED",
                "verdict": verdict,
                "cedar_decision": eval_result.get("cedar_decision", "Decision.Deny"),
                "reason": eval_result["reason"],
                "risk_score": eval_result["risk_score"],
                "risk_factors": eval_result["risk_factors"],
                "result": None,
                "audit_block_hash": eval_result["audit_block_hash"]
            }

        # Case 2: Requires Human Step-Up Approval
        if verdict == AuthorizationVerdict.STEP_UP_REQUIRED:
            return {
                "status": "STEP_UP_REQUIRED",
                "verdict": verdict,
                "cedar_decision": eval_result.get("cedar_decision", "Decision.Allow"),
                "request_id": eval_result["request_id"],
                "reason": eval_result["reason"],
                "risk_score": eval_result["risk_score"],
                "risk_factors": eval_result["risk_factors"],
                "result": None,
                "message": "Action paused. Dual-custody human authorization required to release execution ticket.",
                "audit_block_hash": eval_result["audit_block_hash"]
            }

        # Case 3: Allowed - Validate ticket and safely dispatch
        ticket_data = eval_result.get("execution_ticket")
        if not ticket_data:
            return {
                "status": "ERROR",
                "reason": "Missing execution ticket despite ALLOW verdict",
                "result": None
            }

        ticket = ExecutionTicket(**ticket_data)
        if not pdp_engine.verify_execution_ticket(ticket, tool_name, arguments):
            return {
                "status": "SECURITY_VIOLATION",
                "reason": "Cryptographic execution ticket tampering or signature verification failed",
                "result": None
            }

        # Dispatch to actual protected tool
        impl = self.tool_implementations.get(tool_name)
        if not impl:
            return {
                "status": "ERROR",
                "reason": f"Tool '{tool_name}' has no registered execution binding",
                "result": None
            }

        try:
            execution_output = impl(arguments)
            return {
                "status": "EXECUTED",
                "verdict": verdict,
                "cedar_decision": eval_result.get("cedar_decision", "Decision.Allow"),
                "reason": eval_result["reason"],
                "risk_score": eval_result["risk_score"],
                "risk_factors": eval_result["risk_factors"],
                "execution_ticket_id": ticket.ticket_id,
                "result": execution_output,
                "audit_block_hash": eval_result["audit_block_hash"]
            }
        except Exception as e:
            return {
                "status": "EXECUTION_EXCEPTION",
                "reason": str(e),
                "result": None
            }

    def execute_with_approved_ticket(
        self,
        ticket_data: Dict[str, Any],
        tool_name: str,
        arguments: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Executes a previously pending action once the Human Supervisor has signed off and issued the ticket.
        """
        ticket = ExecutionTicket(**ticket_data)
        if not pdp_engine.verify_execution_ticket(ticket, tool_name, arguments):
            return {
                "status": "SECURITY_VIOLATION",
                "reason": "Provided step-up ticket is expired, forged, or argument hash mismatch",
                "result": None
            }

        impl = self.tool_implementations.get(tool_name)
        if not impl:
            return {"status": "ERROR", "reason": f"Tool {tool_name} not found"}

        execution_output = impl(arguments)
        return {
            "status": "EXECUTED",
            "verdict": "STEP_UP_COMPLETED",
            "execution_ticket_id": ticket.ticket_id,
            "result": execution_output
        }

pep_interceptor = PolicyEnforcementPoint()
