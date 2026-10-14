import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

print("=== TESTING FASTAPI ENDPOINTS ===")

# Test 1: Health
res = client.get("/api/health")
print("[+] GET /api/health:", res.status_code, res.json())
assert res.status_code == 200

# Test 2: Scenarios list
res = client.get("/api/scenarios")
print(f"[+] GET /api/scenarios: {res.status_code}, Found {len(res.json())} scenarios")
assert res.status_code == 200
assert len(res.json()) >= 5

# Test 3: Run scenario endpoint
res = client.post("/api/scenarios/run", json={"scenario_id": "benign_balance_check", "repeat_count": 1})
print("[+] POST /api/scenarios/run (benign):", res.status_code, res.json()["runs"][0]["execution_result"]["verdict"])
assert res.status_code == 200
assert res.json()["runs"][0]["execution_result"]["verdict"] == "ALLOW"

# Test 4: Run Prompt Injection attack scenario
res = client.post("/api/scenarios/run", json={"scenario_id": "prompt_injection_pii", "repeat_count": 1})
print("[+] POST /api/scenarios/run (prompt injection):", res.status_code, res.json()["runs"][0]["execution_result"]["verdict"])
assert res.status_code == 200
assert res.json()["runs"][0]["execution_result"]["verdict"] == "DENY"

# Test 5: Pending Step-Ups
res = client.post("/api/scenarios/run", json={"scenario_id": "high_value_step_up", "repeat_count": 1})
step_res = client.get("/api/step-up/pending")
pending = step_res.json()
print(f"[+] GET /api/step-up/pending: {step_res.status_code}, {len(pending)} pending requests")
assert step_res.status_code == 200
assert len(pending) > 0

# Test 6: Resolve Step-Up via API
req_id = pending[-1]["request_id"]
resolve_res = client.post("/api/step-up/resolve", json={"request_id": req_id, "approved": True, "supervisor_id": "Judge-Alice"})
print(f"[+] POST /api/step-up/resolve: {resolve_res.status_code}, Status: {resolve_res.json().get('status')}")
assert resolve_res.status_code == 200

# Test 7: Verify Hash Chain via API
verify_res = client.post("/api/audit/verify")
print("[+] POST /api/audit/verify:", verify_res.status_code, verify_res.json())
assert verify_res.status_code == 200
assert verify_res.json()["valid"] is True

# Test 8: Stats
stats_res = client.get("/api/stats")
print("[+] GET /api/stats:", stats_res.status_code, stats_res.json())
assert stats_res.status_code == 200

print("\n>>> ALL 8 API ENDPOINTS VALIDATED SUCCESSFULLY! <<<")
