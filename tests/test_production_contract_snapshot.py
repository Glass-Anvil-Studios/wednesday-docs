from __future__ import annotations

import copy
import hashlib
import json
import unittest

from scripts import validate_production_contract_snapshot as validator


def _fingerprint(value: object) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode(
        "utf-8"
    )
    return hashlib.sha256(payload).hexdigest()


def _endpoint() -> dict[str, object]:
    return {
        "method": "GET",
        "path": "/widgets/{widget_id}",
        "deprecated": False,
        "parameters": [{"name": "widget_id", "in": "path", "required": True}],
        "request_required": False,
        "request_media_types": [],
        "response_statuses": ["200"],
        "response_media_types": ["application/json"],
        "structural_fingerprint": "a" * 64,
    }


def _snapshot() -> dict[str, object]:
    endpoints = [_endpoint()]
    return {
        "schema_version": 1,
        "contract_format": "wednesday-public-api-structural-v1",
        "source": "production-openapi",
        "endpoint_count": 1,
        "contract_fingerprint": _fingerprint(endpoints),
        "endpoints": endpoints,
    }


def _allowlist() -> dict[str, object]:
    return {
        "schema_version": 1,
        "approved_http_endpoints": [
            {"method": "GET", "path": "/widgets/{widget_id}"},
        ],
    }


class ProductionContractSnapshotTests(unittest.TestCase):
    def test_valid_snapshot_passes(self) -> None:
        self.assertEqual(validator.validate_snapshot(_snapshot(), _allowlist()), [])

    def test_non_allowlisted_endpoint_is_rejected(self) -> None:
        snapshot = _snapshot()
        endpoint = snapshot["endpoints"][0]  # type: ignore[index]
        endpoint["path"] = "/internal/admin"  # type: ignore[index]
        snapshot["contract_fingerprint"] = _fingerprint(snapshot["endpoints"])

        errors = validator.validate_snapshot(snapshot, _allowlist())
        self.assertTrue(any("non-allowlisted" in error for error in errors))
        self.assertTrue(any("missing allowlisted" in error for error in errors))

    def test_unapproved_metadata_field_is_rejected(self) -> None:
        snapshot = _snapshot()
        snapshot["private_source_sha"] = "should-never-be-public"

        errors = validator.validate_snapshot(snapshot, _allowlist())
        self.assertTrue(any("unapproved top-level fields" in error for error in errors))

    def test_contract_fingerprint_must_match_endpoint_records(self) -> None:
        snapshot = copy.deepcopy(_snapshot())
        snapshot["endpoints"][0]["response_statuses"] = ["201"]  # type: ignore[index]

        errors = validator.validate_snapshot(snapshot, _allowlist())
        self.assertTrue(any("contract_fingerprint does not match" in error for error in errors))

    def test_structural_fingerprint_must_be_sha256(self) -> None:
        snapshot = _snapshot()
        snapshot["endpoints"][0]["structural_fingerprint"] = "not-a-hash"  # type: ignore[index]
        snapshot["contract_fingerprint"] = _fingerprint(snapshot["endpoints"])

        errors = validator.validate_snapshot(snapshot, _allowlist())
        self.assertTrue(any("structural_fingerprint" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
