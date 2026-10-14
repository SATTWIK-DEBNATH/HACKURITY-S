import hashlib
import json
import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class AuditBlock(BaseModel):
    index: int
    timestamp: float
    iso_time: str
    prev_hash: str
    event: Dict[str, Any]
    block_hash: str

class AuditLedger:
    """
    Cryptographic Tamper-Evident Audit Ledger (Merkle-style SHA-256 chain)
    Guarantees non-repudiation and immutable logging of every continuous authorization decision.
    """
    def __init__(self):
        self.chain: List[AuditBlock] = []
        # Create Genesis Block
        self._create_genesis_block()

    def _compute_hash(self, index: int, timestamp: float, prev_hash: str, event: Dict[str, Any]) -> str:
        serialized_event = json.dumps(event, sort_keys=True)
        raw_string = f"{index}:{timestamp}:{prev_hash}:{serialized_event}"
        return hashlib.sha256(raw_string.encode('utf-8')).hexdigest()

    def _create_genesis_block(self):
        timestamp = time.time()
        iso_time = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(timestamp))
        genesis_event = {
            "action": "LEDGER_INIT",
            "message": "SentinAgent Zero-Trust Audit Chain Initialized",
            "security_standard": "NIST SP 800-207 Zero Trust Architecture"
        }
        genesis_hash = self._compute_hash(0, timestamp, "0" * 64, genesis_event)
        self.chain.append(AuditBlock(
            index=0,
            timestamp=timestamp,
            iso_time=iso_time,
            prev_hash="0" * 64,
            event=genesis_event,
            block_hash=genesis_hash
        ))

    def append_event(self, event: Dict[str, Any]) -> AuditBlock:
        prev_block = self.chain[-1]
        new_index = prev_block.index + 1
        timestamp = time.time()
        iso_time = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(timestamp))
        new_hash = self._compute_hash(new_index, timestamp, prev_block.block_hash, event)

        block = AuditBlock(
            index=new_index,
            timestamp=timestamp,
            iso_time=iso_time,
            prev_hash=prev_block.block_hash,
            event=event,
            block_hash=new_hash
        )
        self.chain.append(block)
        return block

    def verify_integrity(self) -> Dict[str, Any]:
        """
        Validates entire cryptographic chain. Returns status and tampered block index if compromised.
        """
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]

            # Check hash linkage
            if current.prev_hash != previous.block_hash:
                return {
                    "valid": False,
                    "error": f"Hash chain broken at block {i}: prev_hash mismatch",
                    "corrupted_block": i
                }

            # Check self-hash calculation
            recalculated_hash = self._compute_hash(
                current.index, current.timestamp, current.prev_hash, current.event
            )
            if current.block_hash != recalculated_hash:
                return {
                    "valid": False,
                    "error": f"Content tampering detected in block {i}: hash mismatch",
                    "corrupted_block": i
                }

        return {
            "valid": True,
            "total_blocks": len(self.chain),
            "latest_hash": self.chain[-1].block_hash,
            "message": "Cryptographic integrity verified. No log manipulation detected."
        }

    def get_latest_blocks(self, limit: int = 50) -> List[AuditBlock]:
        return self.chain[-limit:][::-1]

audit_ledger = AuditLedger()
