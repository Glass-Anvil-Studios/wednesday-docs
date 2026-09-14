#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

SITE = Path(sys.argv[1] if len(sys.argv) > 1 else "_site").resolve()


class Inspector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []
        self.assets: list[str] = []
        self.h1 = 0
        self.description = False
        self.canonical = False
        self.viewport = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == "a" and data.get("href"):
            self.links.append(data["href"] or "")
        if tag in {"img", "script"} and data.get("src"):
            self.assets.append(data["src"] or "")
        if tag == "link" and data.get("href"):
            self.assets.append(data["href"] or "")
            if data.get("rel") == "canonical":
                self.canonical = True
        if tag == "h1":
            self.h1 += 1
        if tag == "meta" and data.get("name") == "description" and data.get("content"):
            self.description = True
        if tag == "meta" and data.get("name") == "viewport":
            self.viewport = True


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def target_for(url: str) -> Path | None:
    if not url or url.startswith(("#", "mailto:", "tel:", "javascript:")):
        return None
    parsed = urlsplit(url)
    if parsed.scheme or parsed.netloc:
        return None
    path = unquote(parsed.path)
    if not path:
        return None
    target = SITE / path.lstrip("/")
    if path.endswith("/"):
        target = target / "index.html"
    elif not target.suffix and (target / "index.html").exists():
        target = target / "index.html"
    return target


def main() -> None:
    if not SITE.is_dir():
        fail(f"generated site directory missing: {SITE}")
    for rel in ["index.html", "404.html", "robots.txt", "sitemap.xml", "search.json", "llms.txt", "llms-full.txt", "assets/css/site.css", "assets/js/site.js"]:
        if not (SITE / rel).exists():
            fail(f"generated site missing {rel}")

    html_files = sorted(SITE.rglob("*.html"))
    if len(html_files) < 18:
        fail(f"generated site has only {len(html_files)} HTML files")

    broken: list[str] = []
    for page in html_files:
        inspector = Inspector()
        inspector.feed(page.read_text(encoding="utf-8"))
        if page.name != "404.html" and inspector.h1 != 1:
            fail(f"{page.relative_to(SITE)} must contain exactly one h1; found {inspector.h1}")
        if not inspector.description or not inspector.canonical or not inspector.viewport:
            fail(f"{page.relative_to(SITE)} is missing required SEO/document metadata")
        for url in inspector.links + inspector.assets:
            target = target_for(url)
            if target is not None and not target.exists():
                broken.append(f"{page.relative_to(SITE)} -> {url}")
    if broken:
        fail("broken internal links/assets:\n" + "\n".join(broken[:40]))

    try:
        search = json.loads((SITE / "search.json").read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"search.json is invalid: {exc}")
    if not isinstance(search, list) or len(search) < 18:
        fail("search.json does not contain the expected documentation corpus")
    required_keys = {"title", "description", "url", "section"}
    for item in search:
        if not isinstance(item, dict) or not required_keys.issubset(item):
            fail("search.json contains an invalid record")

    try:
        ET.parse(SITE / "sitemap.xml")
    except Exception as exc:
        fail(f"sitemap.xml is invalid: {exc}")

    if "docs.wednesdaychat.com" not in (SITE / "llms.txt").read_text(encoding="utf-8"):
        fail("llms.txt is missing canonical WEDNESDAY documentation URLs")
    if (SITE / "llms-full.txt").stat().st_size < 5000:
        fail("llms-full.txt is unexpectedly small")

    print(f"Generated site contract: OK ({len(html_files)} HTML files, {len(search)} search records)")


if __name__ == "__main__":
    main()
