#!/usr/bin/env python3
from __future__ import annotations

import argparse
import datetime as dt
import html
import ipaddress
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
POLICY_PATH = ROOT / "policy" / "public_release_policy.json"
ALLOWLIST_PATH = ROOT / "policy" / "public_contract_allowlist.json"
EXCEPTIONS_PATH = ROOT / "policy" / "public_release_exceptions.json"

TEXT_SUFFIXES = {".md", ".html", ".txt", ".json", ".xml", ".yml", ".yaml", ".js", ".css"}

SECRET_RULES: tuple[tuple[str, re.Pattern[str], str], ...] = (
    ("private-key", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----"), "private key material"),
    ("github-token", re.compile(r"\b(?:ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b"), "GitHub credential"),
    ("cloud-token", re.compile(r"\b(?:dop_v1_[A-Za-z0-9]{24,}|AKIA[A-Z0-9]{16}|ASIA[A-Z0-9]{16})\b"), "cloud credential"),
    ("google-api-key", re.compile(r"\bAIza[0-9A-Za-z_-]{30,}\b"), "Google-style API credential"),
    ("stripe-secret", re.compile(r"\bsk_(?:live|test)_[0-9A-Za-z]{16,}\b"), "secret API credential"),
    ("slack-token", re.compile(r"\bxox[baprs]-[0-9A-Za-z-]{10,}\b"), "Slack-style credential"),
    ("jwt", re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b"), "JWT-like credential"),
    ("bearer-token", re.compile(r"\bBearer\s+[A-Za-z0-9._~+/-]{20,}\b", re.I), "Bearer credential"),
    (
        "database-url",
        re.compile(r"\b(?:postgres(?:ql)?|mysql|mariadb|mongodb(?:\+srv)?|redis|rediss)://[^\s<>'\"]+", re.I),
        "database/cache connection URL",
    ),
)

HOSTING_AND_RUNTIME_TERMS = (
    "digitalocean", "droplet", "doctl", "aws", "amazon web services", "azure", "gcp", "google cloud",
    "cloudflare", "heroku", "fly.io", "render.com", "railway", "vercel", "netlify",
    "postgres", "postgresql", "mysql", "mariadb", "redis", "mongodb", "dynamodb", "cassandra",
    "cockroachdb", "sqlite", "elasticsearch", "opensearch", "pinecone", "qdrant", "weaviate", "milvus",
    "fastapi", "flask", "django", "express.js", "nestjs", "ruby on rails", "spring boot",
    "uvicorn", "gunicorn", "celery", "nginx", "apache httpd", "caddy", "kubernetes", "kubectl",
    "docker compose", "docker-compose", "nomad", "terraform", "ansible",
)

AI_PROVIDER_TERMS = (
    "openai", "anthropic", "claude", "google gemini", "vertex ai", "azure openai", "aws bedrock",
    "xai", "grok", "mistral", "cohere", "groq", "together ai", "fireworks ai", "perplexity",
    "deepseek", "meta llama",
)

SOFT_LEAK_PATTERNS: tuple[tuple[str, re.Pattern[str], str], ...] = (
    (
        "implementation-technology",
        re.compile(r"\b(?:" + "|".join(re.escape(x) for x in HOSTING_AND_RUNTIME_TERMS) + r")\b", re.I),
        "implementation/hosting technology name",
    ),
    (
        "provider-brand",
        re.compile(r"\b(?:" + "|".join(re.escape(x) for x in AI_PROVIDER_TERMS) + r")\b", re.I),
        "upstream AI provider/product name",
    ),
    (
        "provider-model-id",
        re.compile(r"\b(?:gpt-[A-Za-z0-9_.-]+|claude-[A-Za-z0-9_.-]+|gemini-[A-Za-z0-9_.-]+|llama-[A-Za-z0-9_.-]+|o[134](?:-[A-Za-z0-9_.-]+)?)\b", re.I),
        "upstream/provider model identifier",
    ),
    (
        "operational-detail",
        re.compile(
            r"\b(?:backing services?|object storage|malware scanning|build sha|deployment environment|"
            r"model[- ]provider|provider family)\b",
            re.I,
        ),
        "operational implementation detail",
    ),
    (
        "private-repository",
        re.compile(r"\bWEDNESDAY-PRODUCTION-RELEASE\b", re.I),
        "private/internal repository identifier",
    ),
    (
        "private-path",
        re.compile(r"(?:^|[\s`'\"])(?:/etc/|/var/|/srv/|/home/|services/api/|\.env(?:\.[A-Za-z0-9_.-]+)?\b)", re.I | re.M),
        "private filesystem/repository/configuration path",
    ),
    (
        "deployment-command",
        re.compile(r"\b(?:ssh\s+\S+@|scp\s+|kubectl\s+|doctl\s+|systemctl\s+|docker\s+compose\s+|nginx\s+-t\b|certbot\s+)", re.I),
        "privileged deployment/operations command",
    ),
    (
        "roadmap-artifact",
        re.compile(r"\b(?:WEDNESDAY_MASTER_FRONTIER_ROADMAP|REC-\d{2,}|phase-\d+[a-z]?(?:-[a-z0-9-]+)?)\b", re.I),
        "internal roadmap/certification artifact identifier",
    ),
)

URL_RE = re.compile(r"https?://[^\s<>'\"\])}]+", re.I)
WEDNESDAY_HOST_RE = re.compile(r"\b(?:[a-z0-9-]+\.)*wednesdaychat\.com\b", re.I)
INTERNAL_HOST_RE = re.compile(r"\b(?:localhost|[a-z0-9.-]+\.(?:internal|local|lan|svc|cluster\.local))\b", re.I)
IPV4_RE = re.compile(r"(?<![\d.])(?:\d{1,3}\.){3}\d{1,3}(?![\d.])")
IPV6_BRACKET_RE = re.compile(r"\[([0-9A-Fa-f:]{2,})\]")
ENV_ASSIGNMENT_RE = re.compile(r"(?m)^\s*(?:export\s+)?([A-Z][A-Z0-9_]{2,})\s*=\s*([^\n#]+)")
SENSITIVE_ENV_RE = re.compile(r"(?:TOKEN|SECRET|PASSWORD|PASS|PRIVATE|DATABASE|REDIS|DSN|API_KEY|ACCESS_KEY|CLIENT_SECRET|WEBHOOK)", re.I)
ENDPOINT_MARKUP_RE = re.compile(
    r'class="method[^"]*">\s*(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\s*</span>.*?'
    r'class="endpoint-path">\s*([^<]+?)\s*</span>',
    re.I | re.S,
)
MARKDOWN_ENDPOINT_RE = re.compile(
    r"(?<![A-Za-z])(?:`)?(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\s+(?:`)?(/[A-Za-z0-9_{}?=&./:\-\u2026]+)",
    re.I,
)

@dataclass(frozen=True)
class Finding:
    path: str
    line: int
    rule: str
    message: str
    excerpt: str


def _load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise SystemExit(f"ERROR: required firewall configuration missing: {path.relative_to(ROOT)}")
    except json.JSONDecodeError as exc:
        raise SystemExit(f"ERROR: invalid JSON in {path.relative_to(ROOT)}: {exc}")


def load_configuration() -> tuple[dict, dict, dict]:
    policy = _load_json(POLICY_PATH)
    allowlist = _load_json(ALLOWLIST_PATH)
    exceptions = _load_json(EXCEPTIONS_PATH)
    for name, payload in (("policy", policy), ("allowlist", allowlist), ("exceptions", exceptions)):
        if payload.get("schema_version") != 1:
            raise SystemExit(f"ERROR: unsupported {name} schema_version")
    return policy, allowlist, exceptions


def _line_for(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def _excerpt(value: str, limit: int = 160) -> str:
    value = " ".join(value.strip().split())
    return value if len(value) <= limit else value[: limit - 1] + "…"


def _normalize_endpoint_path(raw: str) -> str:
    value = html.unescape(raw).strip().strip("`")
    value = value.split("?", 1)[0]
    value = value.rstrip(".,;")
    if len(value) > 1:
        value = value.rstrip("/")
    return value or "/"


def _approved_origins(allowlist: dict) -> set[str]:
    origins: set[str] = set()
    for origin in allowlist.get("approved_wednesday_origins", []):
        parsed = urlsplit(origin)
        if not parsed.scheme or not parsed.hostname:
            raise SystemExit(f"ERROR: invalid approved origin in allowlist: {origin}")
        origins.add(f"{parsed.scheme.lower()}://{parsed.hostname.lower()}" + (f":{parsed.port}" if parsed.port else ""))
    return origins


def _approved_hosts(allowlist: dict) -> set[str]:
    return {urlsplit(origin).hostname.lower() for origin in allowlist.get("approved_wednesday_origins", [])}


def _approved_endpoints(allowlist: dict) -> set[tuple[str, str]]:
    result: set[tuple[str, str]] = set()
    for entry in allowlist.get("approved_http_endpoints", []):
        method = str(entry.get("method", "")).upper()
        path = _normalize_endpoint_path(str(entry.get("path", "")))
        if method not in {"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"} or not path.startswith("/"):
            raise SystemExit(f"ERROR: invalid approved endpoint entry: {entry}")
        result.add((method, path))
    return result


def _exception_applies(exceptions: dict, finding: Finding) -> bool:
    today = dt.date.today()
    for item in exceptions.get("exceptions", []):
        required = {"id", "path", "rule", "exact_text", "justification", "approved_by", "expires_on"}
        if not required.issubset(item):
            raise SystemExit(f"ERROR: malformed public release exception: {item}")
        try:
            expiry = dt.date.fromisoformat(item["expires_on"])
        except ValueError:
            raise SystemExit(f"ERROR: invalid exception expiry date: {item['id']}")
        if expiry < today:
            continue
        if item["path"] == finding.path and item["rule"] == finding.rule and item["exact_text"] == finding.excerpt:
            return True
    return False


def scan_text(path: str, text: str, policy: dict, allowlist: dict) -> list[Finding]:
    findings: list[Finding] = []

    def add(rule: str, message: str, match: re.Match[str] | None = None, value: str | None = None, offset: int = 0) -> None:
        if match is not None:
            offset = match.start()
            value = match.group(0)
        findings.append(Finding(path, _line_for(text, offset), rule, message, _excerpt(value or "")))

    for rule, pattern, message in SECRET_RULES:
        for match in pattern.finditer(text):
            add(rule, message, match)

    for rule, pattern, message in SOFT_LEAK_PATTERNS:
        for match in pattern.finditer(text):
            add(rule, message, match)

    approved_origins = _approved_origins(allowlist)
    approved_hosts = _approved_hosts(allowlist)

    for match in URL_RE.finditer(text):
        candidate = match.group(0).rstrip(".,;:")
        parsed = urlsplit(candidate)
        host = (parsed.hostname or "").lower()
        if parsed.username or parsed.password:
            add("credential-url", "URL embeds credentials", match, candidate)
        if host in {"localhost", "localhost.localdomain"} or host.endswith((".internal", ".local", ".lan", ".svc", ".cluster.local")):
            add("internal-host", "internal/local hostname", match, candidate)
        if host == "wednesdaychat.com" or host.endswith(".wednesdaychat.com"):
            origin = f"{parsed.scheme.lower()}://{host}" + (f":{parsed.port}" if parsed.port else "")
            if origin not in approved_origins:
                add("unapproved-wednesday-origin", "WEDNESDAY origin is not allowlisted for public release", match, candidate)
        try:
            ip = ipaddress.ip_address(host.strip("[]"))
        except ValueError:
            pass
        else:
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
                add("private-ip", "private/reserved IP address", match, candidate)

    for match in WEDNESDAY_HOST_RE.finditer(text):
        host = match.group(0).lower()
        if host not in approved_hosts:
            add("unapproved-wednesday-host", "WEDNESDAY hostname is not allowlisted for public release", match)

    for match in INTERNAL_HOST_RE.finditer(text):
        add("internal-host", "internal/local hostname", match)

    for match in IPV4_RE.finditer(text):
        try:
            ip = ipaddress.ip_address(match.group(0))
        except ValueError:
            continue
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
            add("private-ip", "private/reserved IP address", match)

    for match in IPV6_BRACKET_RE.finditer(text):
        try:
            ip = ipaddress.ip_address(match.group(1))
        except ValueError:
            continue
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
            add("private-ip", "private/reserved IPv6 address", match)

    approved_env = {str(name) for name in allowlist.get("approved_environment_variables", [])}
    for match in ENV_ASSIGNMENT_RE.finditer(text):
        name = match.group(1)
        if name not in approved_env and (name.startswith("WEDNESDAY_") or SENSITIVE_ENV_RE.search(name)):
            add("environment-variable", f"non-public environment variable assignment: {name}", match)

    blocked_route_prefixes = [str(v).rstrip("/") for v in policy.get("blocked_route_prefixes", [])]
    for prefix in blocked_route_prefixes:
        if not prefix.startswith("/"):
            raise SystemExit(f"ERROR: blocked route prefix must start with '/': {prefix}")
        route_re = re.compile(rf"(?<![A-Za-z0-9_/:]){re.escape(prefix)}(?:/|\b)", re.I)
        for match in route_re.finditer(text):
            add("private-route", f"private/operational route family: {prefix}", match)

    approved_endpoints = _approved_endpoints(allowlist)
    seen_endpoint_spans: set[tuple[int, int]] = set()
    for pattern in (ENDPOINT_MARKUP_RE, MARKDOWN_ENDPOINT_RE):
        for match in pattern.finditer(text):
            method = match.group(1).upper()
            endpoint = _normalize_endpoint_path(match.group(2))
            span = match.span()
            if span in seen_endpoint_spans:
                continue
            seen_endpoint_spans.add(span)
            if (method, endpoint) not in approved_endpoints:
                add(
                    "unapproved-endpoint",
                    f"HTTP endpoint declaration is not in public contract allowlist: {method} {endpoint}",
                    value=f"{method} {endpoint}",
                    offset=match.start(),
                )

    return findings


def collect_source_files(root: Path, policy: dict) -> list[Path]:
    files: set[Path] = set()
    for rel in policy.get("public_root_files", []):
        path = root / rel
        if path.exists() and path.is_file():
            files.add(path)
    for source_root in policy.get("public_source_roots", []):
        directory = root / source_root
        if directory.exists():
            for path in directory.rglob("*"):
                if path.is_file() and path.suffix.lower() in TEXT_SUFFIXES:
                    files.add(path)
        twin = root / f"{source_root}.md"
        if twin.exists():
            files.add(twin)
    return sorted(files)


def collect_generated_files(root: Path) -> list[Path]:
    return sorted(
        path
        for path in root.rglob("*")
        if path.is_file() and (path.suffix.lower() in TEXT_SUFFIXES or path.name in {"CNAME"})
    )


def scan_paths(paths: list[Path], display_root: Path, policy: dict, allowlist: dict, exceptions: dict) -> list[Finding]:
    findings: list[Finding] = []
    for path in paths:
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        rel = path.relative_to(display_root).as_posix()
        for finding in scan_text(rel, text, policy, allowlist):
            if not _exception_applies(exceptions, finding):
                findings.append(finding)
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description="Fail-closed public release firewall for WEDNESDAY documentation.")
    parser.add_argument("--generated", metavar="DIR", help="scan a generated site tree instead of source publication files")
    args = parser.parse_args()

    policy, allowlist, exceptions = load_configuration()

    if args.generated:
        scan_root = Path(args.generated).resolve()
        if not scan_root.exists():
            print(f"ERROR: generated site directory does not exist: {scan_root}", file=sys.stderr)
            return 2
        paths = collect_generated_files(scan_root)
        label = "generated"
    else:
        scan_root = ROOT
        paths = collect_source_files(scan_root, policy)
        label = "source"

    if not paths:
        print(f"ERROR: public release firewall found no {label} files to scan", file=sys.stderr)
        return 2

    findings = scan_paths(paths, scan_root, policy, allowlist, exceptions)
    if findings:
        print(f"PUBLIC RELEASE FIREWALL: BLOCKED ({len(findings)} finding(s))", file=sys.stderr)
        for finding in findings:
            print(
                f"::error file={finding.path},line={finding.line},title={finding.rule}::"
                f"{finding.message} | {finding.excerpt}",
                file=sys.stderr,
            )
        return 1

    print(f"Public release firewall: OK ({label}, {len(paths)} files scanned)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
