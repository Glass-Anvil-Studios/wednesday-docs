#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path

from scripts import public_release_firewall as firewall

ROOT = Path(__file__).resolve().parents[1]
TABLE_ENDPOINT_RE = re.compile(
    r"(?m)^\s*\|\s*`?(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)`?\s*\|\s*`?(/[^|`\s]+)`?\s*\|",
    re.I,
)


def line_for(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def extract_endpoints(text: str) -> list[tuple[str, str, int]]:
    found: list[tuple[str, str, int]] = []
    seen: set[tuple[int, int, str, str]] = set()
    for pattern in (firewall.ENDPOINT_MARKUP_RE, firewall.MARKDOWN_ENDPOINT_RE, TABLE_ENDPOINT_RE):
        for match in pattern.finditer(text):
            method = match.group(1).upper()
            path = firewall._normalize_endpoint_path(match.group(2))
            key = (match.start(), match.end(), method, path)
            if key in seen:
                continue
            seen.add(key)
            found.append((method, path, line_for(text, match.start())))
    return found


def validate_contract(root: Path = ROOT) -> tuple[list[str], set[tuple[str, str]]]:
    policy, allowlist, _exceptions = firewall.load_configuration()
    approved = firewall._approved_endpoints(allowlist)
    declared: set[tuple[str, str]] = set()
    errors: list[str] = []

    for path in firewall.collect_source_files(root, policy):
        if path.suffix.lower() not in {".md", ".html", ".txt"}:
            continue
        text = path.read_text(encoding="utf-8")
        rel = path.relative_to(root).as_posix()
        for method, endpoint, line in extract_endpoints(text):
            declared.add((method, endpoint))
            if (method, endpoint) not in approved:
                errors.append(f"{rel}:{line}: endpoint is not allowlisted: {method} {endpoint}")

    stale = sorted(approved - declared)
    for method, endpoint in stale:
        errors.append(f"policy/public_contract_allowlist.json: approved endpoint is not documented: {method} {endpoint}")

    return errors, declared


def main() -> int:
    errors, declared = validate_contract()
    if errors:
        print(f"PUBLIC CONTRACT VALIDATION: BLOCKED ({len(errors)} finding(s))", file=sys.stderr)
        for error in errors:
            print(f"BLOCK {error}", file=sys.stderr)
        return 1
    print(f"Public contract allowlist: OK ({len(declared)} documented endpoint declarations)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
