import cedarpy

policies = """
permit (
    principal == Agent::"agent-bank-01",
    action == Action::"get_account_balance",
    resource == Resource::"ACC-101"
);

forbid (
    principal,
    action == Action::"export_customer_data",
    resource
);
"""

# Test 1: Permitted call
req1 = {
    "principal": 'Agent::"agent-bank-01"',
    "action": 'Action::"get_account_balance"',
    "resource": 'Resource::"ACC-101"',
    "context": {}
}

res1 = cedarpy.is_authorized(req1, policies, entities=[])
print("[+] Cedar Test 1 (Permitted):", res1.decision)

# Test 2: Forbidden call (export_customer_data)
req2 = {
    "principal": 'Agent::"agent-triage-01"',
    "action": 'Action::"export_customer_data"',
    "resource": 'Resource::"Database"',
    "context": {}
}

res2 = cedarpy.is_authorized(req2, policies, entities=[])
print("[+] Cedar Test 2 (Forbidden):", res2.decision)
