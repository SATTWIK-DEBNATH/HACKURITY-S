import cedarpy
from typing import Dict, Any, Tuple

DEFAULT_CEDAR_POLICIES = """
// =========================================================================
// SENTINAGENT AWS CEDAR ZERO-TRUST POLICY REPOSITORY
// Formally verified authorization policies for Autonomous AI Agents
// =========================================================================

// Policy 1: Banking Assistant may read balances and past transactions
permit (
    principal == AgentRole::"BankingAssistant",
    action in [Action::"get_account_balance", Action::"get_transaction_history"],
    resource
);

// Policy 2: Triage Agent can only look up basic account balances
permit (
    principal == AgentRole::"TriageAgent",
    action in [Action::"get_account_balance"],
    resource
);

// Policy 3: Transaction Execution Agent can execute transfers <= $500
permit (
    principal == AgentRole::"TransactionExecutionAgent",
    action in [Action::"transfer_funds"],
    resource
)
when {
    context.amount <= 500
};

// Policy 4: FORBID high-value transfers without Step-Up clearance
forbid (
    principal,
    action in [Action::"transfer_funds"],
    resource
)
when {
    context.amount > 500
};

// Policy 5: CRITICAL FORBID - Exporting unmasked PII is strictly prohibited
forbid (
    principal,
    action in [Action::"export_customer_data"],
    resource
)
unless {
    principal == AgentRole::"ComplianceExecutive"
};

// Policy 6: CRITICAL FORBID - Dropping database tables is prohibited
forbid (
    principal,
    action in [Action::"drop_database_table"],
    resource
);

// Policy 7: Financial Remediation Agent permitted for refunds
permit (
    principal == AgentRole::"FinancialRemediationAgent",
    action in [Action::"issue_refund", Action::"process_refund"],
    resource
);

// Policy 8: Banking Assistant permitted for refunds
permit (
    principal == AgentRole::"BankingAssistant",
    action in [Action::"issue_refund", Action::"process_refund"],
    resource
);
"""

class CedarPolicyEngine:
    """
    AWS Cedar Policy Engine integration for SentinAgent
    Provides formally-verified ABAC and ReBAC decision enforcement.
    """
    def __init__(self, policies_str: str = DEFAULT_CEDAR_POLICIES):
        self.policies_str = policies_str

    def evaluate_cedar(
        self,
        agent_role: str,
        tool_name: str,
        resource_id: str = "Resource::Core",
        context_args: Dict[str, Any] = None
    ) -> Tuple[bool, str]:
        context = {}
        if context_args:
            # Cedar context requires primitive scalar values (int, float, bool, str)
            if "amount" in context_args:
                try:
                    context["amount"] = int(float(context_args["amount"]))
                except Exception:
                    pass

        request = {
            "principal": f'AgentRole::"{agent_role}"',
            "action": f'Action::"{tool_name}"',
            "resource": f'Resource::"{resource_id}"',
            "context": context
        }

        # Direct Cedar policy AST evaluation
        entities = []

        try:
            res = cedarpy.is_authorized(request, self.policies_str, entities)
            is_allow = res.decision == cedarpy.Decision.Allow
            return is_allow, str(res.decision)
        except Exception as e:
            # Fallback on parse/eval error
            return False, f"Cedar evaluation error: {str(e)}"

cedar_engine = CedarPolicyEngine()
