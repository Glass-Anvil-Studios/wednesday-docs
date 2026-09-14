from __future__ import annotations

import copy
import hashlib
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

import validate_runtime_corpus as validator  # noqa: E402


class RuntimeCorpusValidationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.base = json.loads((ROOT / "runtime-corpus.json").read_text(encoding="utf-8"))

    def payload(self) -> dict[str, object]:
        return copy.deepcopy(self.base)

    @staticmethod
    def refresh_content_hash(chunk: dict[str, object]) -> None:
        content = str(chunk["content"])
        chunk["content_hash"] = hashlib.sha256(content.encode("utf-8")).hexdigest()

    @staticmethod
    def refresh_corpus_hash(payload: dict[str, object]) -> None:
        chunks = payload["chunks"]
        assert isinstance(chunks, list)
        canonical = json.dumps(
            chunks,
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
        ).encode("utf-8")
        payload["corpus_hash"] = hashlib.sha256(canonical).hexdigest()

    def test_current_committed_corpus_is_valid(self) -> None:
        validated = validator.validate_runtime_corpus(self.payload())
        self.assertEqual(validated["chunk_count"], len(validated["chunks"]))

    def test_unknown_top_level_field_is_rejected(self) -> None:
        payload = self.payload()
        payload["unexpected"] = True
        with self.assertRaisesRegex(validator.RuntimeCorpusValidationError, "top-level fields"):
            validator.validate_runtime_corpus(payload)

    def test_content_hash_tampering_is_rejected(self) -> None:
        payload = self.payload()
        chunks = payload["chunks"]
        assert isinstance(chunks, list)
        chunks[0]["content"] = f"{chunks[0]['content']} altered"
        self.refresh_corpus_hash(payload)
        with self.assertRaisesRegex(validator.RuntimeCorpusValidationError, "content hash mismatch"):
            validator.validate_runtime_corpus(payload)

    def test_corpus_fingerprint_tampering_is_rejected(self) -> None:
        payload = self.payload()
        payload["corpus_hash"] = "0" * 64
        with self.assertRaisesRegex(validator.RuntimeCorpusValidationError, "fingerprint mismatch"):
            validator.validate_runtime_corpus(payload)

    def test_duplicate_chunk_id_is_rejected(self) -> None:
        payload = self.payload()
        chunks = payload["chunks"]
        assert isinstance(chunks, list)
        chunks[1]["id"] = chunks[0]["id"]
        self.refresh_corpus_hash(payload)
        with self.assertRaisesRegex(validator.RuntimeCorpusValidationError, "duplicate runtime corpus chunk id"):
            validator.validate_runtime_corpus(payload)

    def test_unapproved_source_path_is_rejected(self) -> None:
        payload = self.payload()
        chunks = payload["chunks"]
        assert isinstance(chunks, list)
        chunks[0]["source_path"] = "not-published/index.md"
        self.refresh_corpus_hash(payload)
        with self.assertRaisesRegex(validator.RuntimeCorpusValidationError, "source path is not an approved public page"):
            validator.validate_runtime_corpus(payload)

    def test_private_ip_leak_is_rejected_even_with_valid_hashes(self) -> None:
        payload = self.payload()
        chunks = payload["chunks"]
        assert isinstance(chunks, list)
        chunk = chunks[0]
        chunk["content"] = "Connect to 10.0.0.1 for this operation."
        self.refresh_content_hash(chunk)
        self.refresh_corpus_hash(payload)
        with self.assertRaisesRegex(validator.RuntimeCorpusValidationError, "failed public release firewall: private-ip"):
            validator.validate_runtime_corpus(payload)

    def test_unapproved_wednesday_origin_is_rejected_even_with_valid_hashes(self) -> None:
        payload = self.payload()
        chunks = payload["chunks"]
        assert isinstance(chunks, list)
        chunk = chunks[0]
        chunk["content"] = "Use https://secret.wednesdaychat.com/example for this operation."
        self.refresh_content_hash(chunk)
        self.refresh_corpus_hash(payload)
        with self.assertRaisesRegex(validator.RuntimeCorpusValidationError, "failed public release firewall"):
            validator.validate_runtime_corpus(payload)

    def test_private_route_leak_is_rejected_even_with_valid_hashes(self) -> None:
        payload = self.payload()
        chunks = payload["chunks"]
        assert isinstance(chunks, list)
        chunk = chunks[0]
        chunk["content"] = "GET /admin/export"
        self.refresh_content_hash(chunk)
        self.refresh_corpus_hash(payload)
        with self.assertRaisesRegex(validator.RuntimeCorpusValidationError, "failed public release firewall"):
            validator.validate_runtime_corpus(payload)


if __name__ == "__main__":
    unittest.main()
