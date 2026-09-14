#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT_PATH = ROOT / "contracts" / "public-api-contract.json"
ALLOWLIST_PATH = ROOT / "policy" / "public_contract_allowlist.json"
HTTP_METHODS = {"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"}
PARAMETER_LOCATIONS = {"path", "query", "header", "cookie"}
HEX64 = re.compile(r"^[0-9a-f]{64}$")
STATUS = re.compile(r"^(?:[1-5][0-9]{2}|[1-5]XX|default)$", re.I)
TOP_LEVEL_KEYS = {
    "schema_version",
    "contract_format",
    "source",
    "endpoint_count",
    "contract_fingerprint",
    "endpoints",
}
ENDPOINT_KEYS = {
    "method",
    "path",
    "deprecated",
    "parameters",
    "request_required",
    "request_media_types",
    "response_statuses",
    "response_media_types",
    "structural_fingerprint",
}
PARAMETER_KEYS = {"name", "in", "required"}


def _canonical_bytes(value: Any) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode(
        "utf-8"
    )


def _sha256(value: Any) -> str:
    return hashlib.sha256(_canonical_bytes(value)).hexdigest()


def _load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"required file is missing: {path.relative_to(ROOT)}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path.relative_to(ROOT)}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path.relative_to(ROOT)} must contain a JSON object")
    return value


def _allowlisted_endpoint_set(allowlist: dict[str, Any]) -> set[tuple[str, str]]:
    if allowlist.get("schema_version") != 1:
        raise ValueError("unsupported public contract allowlist schema_version")
    endpoints: set[tuple[str, str]] = set()
    for raw in allowlist.get("approved_http_endpoints", []):
        if not isinstance(raw, dict):
            raise ValueError("approved_http_endpoints entries must be objects")
        method = str(raw.get("method", "")).upper()
        path = str(raw.get("path", ""))
        if method not in HTTP_METHODS or not path.startswith("/"):
            raise ValueError(f"invalid approved endpoint: {raw!r}")
        key = (method, path.rstrip("/") or "/")
        if key in endpoints:
            raise ValueError(f"duplicate approved endpoint: {method} {path}")
        endpoints.add(key)
    return endpoints


def _validate_string_list(value: Any, label: str, errors: list[str]) -> list[str]:
    if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
        errors.append(f"{label} must be a list of strings")
        return []
    if value != sorted(set(value)):
        errors.append(f"{label} must be sorted and contain no duplicates")
    return list(value)


def validate_snapshot(snapshot: dict[str, Any], allowlist: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    extra_top = set(snapshot) - TOP_LEVEL_KEYS
    missing_top = TOP_LEVEL_KEYS - set(snapshot)
    if extra_top:
        errors.append(f"snapshot contains unapproved top-level fields: {sorted(extra_top)}")
    if missing_top:
        errors.append(f"snapshot is missing required top-level fields: {sorted(missing_top)}")

    if snapshot.get("schema_version") != 1:
        errors.append("snapshot schema_version must be 1")
    if snapshot.get("contract_format") != "wednesday-public-api-structural-v1":
        errors.append("snapshot contract_format is not the approved structural format")
    if snapshot.get("source") != "production-openapi":
        errors.append("snapshot source must be production-openapi")

    endpoints = snapshot.get("endpoints")
    if not isinstance(endpoints, list):
        errors.append("snapshot endpoints must be a list")
        return errors

    if snapshot.get("endpoint_count") != len(endpoints):
        errors.append("endpoint_count does not match the number of endpoint records")

    published_set: set[tuple[str, str]] = set()
    for index, endpoint in enumerate(endpoints):
        label = f"endpoints[{index}]"
        if not isinstance(endpoint, dict):
            errors.append(f"{label} must be an object")
            continue

        extra = set(endpoint) - ENDPOINT_KEYS
        missing = ENDPOINT_KEYS - set(endpoint)
        if extra:
            errors.append(f"{label} contains unapproved fields: {sorted(extra)}")
        if missing:
            errors.append(f"{label} is missing required fields: {sorted(missing)}")

        method = str(endpoint.get("method", "")).upper()
        path = str(endpoint.get("path", ""))
        if method not in HTTP_METHODS:
            errors.append(f"{label}.method is invalid: {method!r}")
        if not path.startswith("/"):
            errors.append(f"{label}.path must begin with '/': {path!r}")
        key = (method, path.rstrip("/") or "/")
        if key in published_set:
            errors.append(f"duplicate snapshot endpoint: {method} {path}")
        published_set.add(key)

        if not isinstance(endpoint.get("deprecated"), bool):
            errors.append(f"{label}.deprecated must be boolean")
        if not isinstance(endpoint.get("request_required"), bool):
            errors.append(f"{label}.request_required must be boolean")

        parameters = endpoint.get("parameters")
        if not isinstance(parameters, list):
            errors.append(f"{label}.parameters must be a list")
        else:
            parameter_keys: set[tuple[str, str]] = set()
            for parameter_index, parameter in enumerate(parameters):
                parameter_label = f"{label}.parameters[{parameter_index}]"
                if not isinstance(parameter, dict):
                    errors.append(f"{parameter_label} must be an object")
                    continue
                if set(parameter) != PARAMETER_KEYS:
                    errors.append(
                        f"{parameter_label} must contain exactly {sorted(PARAMETER_KEYS)}"
                    )
                name = parameter.get("name")
                location = parameter.get("in")
                required = parameter.get("required")
                if not isinstance(name, str) or not name:
                    errors.append(f"{parameter_label}.name must be a non-empty string")
                if location not in PARAMETER_LOCATIONS:
                    errors.append(f"{parameter_label}.in is invalid: {location!r}")
                if not isinstance(required, bool):
                    errors.append(f"{parameter_label}.required must be boolean")
                if isinstance(name, str) and isinstance(location, str):
                    parameter_key = (location, name)
                    if parameter_key in parameter_keys:
                        errors.append(
                            f"{label} contains duplicate parameter {location}:{name}"
                        )
                    parameter_keys.add(parameter_key)

        _validate_string_list(
            endpoint.get("request_media_types"), f"{label}.request_media_types", errors
        )
        statuses = _validate_string_list(
            endpoint.get("response_statuses"), f"{label}.response_statuses", errors
        )
        for status in statuses:
            if not STATUS.fullmatch(status):
                errors.append(f"{label}.response_statuses contains invalid status {status!r}")
        _validate_string_list(
            endpoint.get("response_media_types"), f"{label}.response_media_types", errors
        )

        fingerprint = endpoint.get("structural_fingerprint")
        if not isinstance(fingerprint, str) or not HEX64.fullmatch(fingerprint):
            errors.append(f"{label}.structural_fingerprint must be a lowercase SHA-256")

    allowlisted = _allowlisted_endpoint_set(allowlist)
    if published_set != allowlisted:
        missing = sorted(allowlisted - published_set)
        extra = sorted(published_set - allowlisted)
        if missing:
            errors.append(f"snapshot is missing allowlisted endpoints: {missing}")
        if extra:
            errors.append(f"snapshot contains non-allowlisted endpoints: {extra}")

    sorted_endpoints = sorted(
        endpoints,
        key=lambda item: (
            str(item.get("path", "")) if isinstance(item, dict) else "",
            str(item.get("method", "")) if isinstance(item, dict) else "",
        ),
    )
    if endpoints != sorted_endpoints:
        errors.append("snapshot endpoints must be deterministically sorted by path then method")

    expected_contract_fingerprint = _sha256(endpoints)
    actual_contract_fingerprint = snapshot.get("contract_fingerprint")
    if not isinstance(actual_contract_fingerprint, str) or not HEX64.fullmatch(
        actual_contract_fingerprint
    ):
        errors.append("contract_fingerprint must be a lowercase SHA-256")
    elif actual_contract_fingerprint != expected_contract_fingerprint:
        errors.append("contract_fingerprint does not match endpoint records")

    return errors


def main() -> int:
    try:
        snapshot = _load_json(SNAPSHOT_PATH)
        allowlist = _load_json(ALLOWLIST_PATH)
        errors = validate_snapshot(snapshot, allowlist)
    except ValueError as exc:
        print(f"PRODUCTION CONTRACT SNAPSHOT: BLOCKED: {exc}", file=sys.stderr)
        return 1

    if errors:
        print(f"PRODUCTION CONTRACT SNAPSHOT: BLOCKED ({len(errors)} finding(s))", file=sys.stderr)
        for error in errors:
            print(f"BLOCK {error}", file=sys.stderr)
        return 1

    print(
        "Production contract snapshot: OK "
        f"({snapshot['endpoint_count']} endpoints, fingerprint "
        f"{str(snapshot['contract_fingerprint'])[:16]}…)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
