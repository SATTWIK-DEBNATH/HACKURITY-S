import sys
import os

# Add workspace to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.app.agents.agent_runner import agent_runner
from backend.app.audit.ledger import audit_ledger
from backend.app.pdp.engine import pdp_engine

print("=== TESTING SENTINAGENT CORE ZERO-TRUST ENGINE ===")

# Test 1: Benign Workflow
print("\n[+] Test 1: Running Benign Balance Check...")
res1 = agent_runner.run_scenario("benign_balance_check")
verdict1 = res1["runs"][0]["execution_result"]["verdict"]
print(f" -> Result Verdict: {verdict1} (Expected: ALLOW)")
assert verdict1 == "ALLOW", f"Expected ALLOW but got {verdict1}"

# Test 2: Prompt Injection Attack
print("\n[+] Test 2: Running Indirect Prompt Injection & PII Exfiltration...")
res2 = agent_runner.run_scenario("prompt_injection_pii")
verdict2 = res2["runs"][0]["execution_result"]["verdict"]
risk2 = res2["runs"][0]["execution_result"]["risk_score"]
print(f" -> Result Verdict: {verdict2} (Risk Score: {risk2}/100) (Expected: DENY)")
assert verdict2 == "DENY", f"Expected DENY but got {verdict2}"

# Test 3: High-Value Financial Transfer Step-Up
print("\n[+] Test 3: Running High-Value Financial Transfer ($1250)...")
res3 = agent_runner.run_scenario("high_value_step_up")
verdict3 = res3["runs"][0]["execution_result"]["verdict"]
req_id = res3["runs"][0]["execution_result"]["request_id"]
print(f" -> Result Verdict: {verdict3} (Request ID: {req_id}) (Expected: STEP_UP_REQUIRED)")
assert verdict3 == "STEP_UP_REQUIRED", f"Expected STEP_UP_REQUIRED but got {verdict3}"

# Test Human Resolution of Step-Up
print(f"\n[+] Test 3b: Resolving Step-Up Request {req_id} (Approval)...")
resolve_res = pdp_engine.resolve_step_up(req_id, approved=True, supervisor_id="Judge-Alice")
print(f" -> Resolution Status: {resolve_res['status']}")
assert resolve_res["status"] == "APPROVED"

# Test 4: Cryptographic Audit Ledger Integrity Verification
print("\n[+] Test 4: Verifying Cryptographic Tamper-Evident SHA-256 Hash Chain...")
verify_res = audit_ledger.verify_integrity()
print(f" -> Audit Chain Integrity Valid: {verify_res['valid']}, Total Blocks: {verify_res['total_blocks']}")
assert verify_res["valid"] is True

print("\n>>> ALL 4 CORE SENTINAGENT ZERO-TRUST TESTS PASSED SUCCESSFULLY! <<<")
