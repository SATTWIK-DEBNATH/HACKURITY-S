from typing import Dict, List, Any
from pydantic import BaseModel

class ToolPolicyRule(BaseModel):
    tool_name: str
    allowed_roles: List[str]
    base_risk: int                       # 0 to 100
    requires_step_up_above_val: float    # e.g., 500.0 USD
    is_destructive: bool = False
    description: str

class PolicyMatrix:
    """
    Attribute-Based Access Control (ABAC) Policy Registry
    """
    def __init__(self):
        self.rules: Dict[str, ToolPolicyRule] = {
            "get_account_balance": ToolPolicyRule(
                tool_name="get_account_balance",
                allowed_roles=["TriageAgent", "BankingAssistant", "SupervisorAgent"],
                base_risk=5,
                requires_step_up_above_val=float("inf"),
                is_destructive=False,
                description="Read-only account balance check"
            ),
            "get_transaction_history": ToolPolicyRule(
                tool_name="get_transaction_history",
                allowed_roles=["BankingAssistant", "SupervisorAgent"],
                base_risk=10,
                requires_step_up_above_val=float("inf"),
                is_destructive=False,
                description="Read-only past transaction records"
            ),
            "process_refund": ToolPolicyRule(
                tool_name="process_refund",
                allowed_roles=["BankingAssistant", "SupervisorAgent"],
                base_risk=20,
                requires_step_up_above_val=150.0,
                is_destructive=False,
                description="Credit funds back to customer account"
            ),
            "transfer_funds": ToolPolicyRule(
                tool_name="transfer_funds",
                allowed_roles=["BankingAssistant", "TransactionExecutionAgent"],
                base_risk=25,
                requires_step_up_above_val=500.0,
                is_destructive=False,
                description="Direct financial transfer between accounts"
            ),
            "get_customer_profile": ToolPolicyRule(
                tool_name="get_customer_profile",
                allowed_roles=["TriageAgent", "BankingAssistant"],
                base_risk=15,
                requires_step_up_above_val=float("inf"),
                is_destructive=False,
                description="Fetch masked customer contact profile"
            ),
            "export_customer_data": ToolPolicyRule(
                tool_name="export_customer_data",
                allowed_roles=["ComplianceExecutive"], # Normal agents are forbidden!
                base_risk=95,
                requires_step_up_above_val=0.0,
                is_destructive=True,
                description="Bulk export of unmasked PII and Social Security Numbers"
            ),
            "drop_database_table": ToolPolicyRule(
                tool_name="drop_database_table",
                allowed_roles=["SuperAdmin"],
                base_risk=100,
                requires_step_up_above_val=0.0,
                is_destructive=True,
                description="Permanent deletion of production relational tables"
            )
        }

    def get_rule(self, tool_name: str) -> ToolPolicyRule:
        return self.rules.get(
            tool_name,
            ToolPolicyRule(
                tool_name=tool_name,
                allowed_roles=[],
                base_risk=80, # Unknown tools are treated as high risk
                requires_step_up_above_val=0.0,
                is_destructive=True,
                description="Unregistered or unrecognized tool"
            )
        )

    def update_rule(self, tool_name: str, allowed_roles: List[str], base_risk: int, step_up_val: float):
        if tool_name in self.rules:
            self.rules[tool_name].allowed_roles = allowed_roles
            self.rules[tool_name].base_risk = base_risk
            self.rules[tool_name].requires_step_up_above_val = step_up_val

policy_matrix = PolicyMatrix()
