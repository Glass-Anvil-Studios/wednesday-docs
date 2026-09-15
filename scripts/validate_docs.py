#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "CNAME", "index.md", "404.html", "robots.txt", "sitemap.xml", "search.json",
    "llms.txt", "llms-full.txt", "_layouts/default.html", "_data/navigation.yml",
    "assets/css/site.css", "assets/js/site.js", "SECURITY.md", "CONTRIBUTING.md",
    "policy/public_release_policy.json", "policy/public_contract_allowlist.json",
    "policy/public_release_exceptions.json", "scripts/public_release_firewall.py",
    "scripts/validate_public_contract.py", "tests/test_public_release_firewall.py",
    "tests/test_public_contract.py",
]
REQUIRED_EXCLUDES = [
    "scripts", "tests", "policy", "docs", ".github", "CONTRIBUTING.md",
    "SECURITY.md", "README.md", "LICENSE",
]
PLACEHOLDER_RE = re.compile(r"\b(TODO|TBD|FIXME|LOREM IPSUM)\b", re.I)
SECRET_RE = re.compile(
    r"(?:ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|"
    r"sk-[A-Za-z0-9]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)"
)


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def split_front_matter(path: Path) -> tuple[dict[str, str], str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        fail(f"{path.relative_to(ROOT)} is missing YAML front matter")
    marker = "\n---\n"
    if marker not in text:
        fail(f"{path.relative_to(ROOT)} has malformed YAML front matter")
    head, body = text.split(marker, 1)
    values: dict[str, str] = {}
    for line in head.splitlines()[1:]:
        if ":" not in line or line.startswith(" "):
            continue
        key, value = line.split(":", 1)
        values[key.strip()] = value.strip().strip('"\'')
    return values, body


def public_source_roots() -> list[str]:
    policy_path = ROOT / "policy/public_release_policy.json"
    try:
        policy = json.loads(policy_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"cannot read public release policy: {exc}")
    roots = policy.get("public_source_roots")
    if not isinstance(roots, list) or not roots or not all(isinstance(root, str) and root for root in roots):
        fail("public release policy must define non-empty public_source_roots")
    return roots


def source_pages() -> list[Path]:
    pages = [ROOT / "index.md"]
    for root in public_source_roots():
        directory = ROOT / root
        if directory.exists():
            for path in directory.rglob("*.md"):
                if path.name == f"{path.parent.name}.md":
                    continue
                if path.name == "index.md":
                    pages.append(path)
    return sorted(set(pages))


def twin_for(permalink: str) -> Path | None:
    if permalink == "/":
        return None
    clean = permalink.strip("/")
    return ROOT / f"{clean}.md"


def validate_excludes() -> None:
    config = (ROOT / "_config.yml").read_text(encoding="utf-8")
    for entry in REQUIRED_EXCLUDES:
        if f"  - {entry}\n" not in config:
            fail(f"_config.yml must exclude non-public repository content: {entry}")


def llms_discovery_urls() -> set[str]:
    urls: set[str] = set()
    for line in (ROOT / "llms.txt").read_text(encoding="utf-8").splitlines():
        if not line.startswith("- https://docs.wednesdaychat.com"):
            continue
        urls.add(line[2:].split(" — ", 1)[0].strip())
    return urls


def main() -> None:
    for rel in REQUIRED:
        if not (ROOT / rel).exists():
            fail(f"required repository file is missing: {rel}")

    validate_excludes()

    if (ROOT / "CNAME").read_text(encoding="utf-8").strip() != "docs.wednesdaychat.com":
        fail("CNAME must contain exactly docs.wednesdaychat.com")

    pages = source_pages()
    if len(pages) < 18:
        fail(f"expected at least 18 published documentation pages, found {len(pages)}")

    seen: dict[str, Path] = {}
    for page in pages:
        meta, body = split_front_matter(page)
        rel = page.relative_to(ROOT)
        for field in ("title", "description", "permalink"):
            if not meta.get(field):
                fail(f"{rel} is missing required front-matter field {field}")
        permalink = meta["permalink"]
        if not permalink.startswith("/") or (permalink != "/" and not permalink.endswith("/")):
            fail(f"{rel} has noncanonical permalink {permalink}")
        if permalink in seen:
            fail(f"duplicate permalink {permalink}: {rel} and {seen[permalink].relative_to(ROOT)}")
        seen[permalink] = page
        if PLACEHOLDER_RE.search(body):
            fail(f"placeholder marker found in {rel}")
        if SECRET_RE.search(body):
            fail(f"secret-like credential found in {rel}")
        twin = twin_for(permalink)
        if twin is not None:
            if not twin.exists():
                fail(f"Markdown twin missing for {rel}: expected {twin.relative_to(ROOT)}")
            twin_body = twin.read_text(encoding="utf-8")
            if twin_body.strip() != body.strip():
                fail(f"Markdown twin is out of sync for {rel}")

    discovery_urls = llms_discovery_urls()
    for permalink, page in seen.items():
        canonical_url = f"https://docs.wednesdaychat.com{permalink}"
        if canonical_url not in discovery_urls:
            fail(
                "llms.txt is missing published documentation page "
                f"{page.relative_to(ROOT)} ({canonical_url})"
            )

    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    if "https://docs.wednesdaychat.com/sitemap.xml" not in robots:
        fail("robots.txt must advertise the canonical sitemap")

    corpus = "\n".join((ROOT / name).read_text(encoding="utf-8") for name in ("llms.txt", "llms-full.txt"))
    if PLACEHOLDER_RE.search(corpus) or SECRET_RE.search(corpus):
        fail("machine-readable corpus contains a placeholder or secret-like value")

    print(f"Documentation source contract: OK ({len(pages)} pages)")


if __name__ == "__main__":
    main()
