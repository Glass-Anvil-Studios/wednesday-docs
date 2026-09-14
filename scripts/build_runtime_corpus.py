#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POLICY_PATH = ROOT / "policy" / "public_release_policy.json"
DEFAULT_OUTPUT = ROOT / "runtime-corpus.json"
SCHEMA_VERSION = "wednesday.docs.runtime_corpus.v1"
CORPUS_ID = "wednesday-public-docs"
CANONICAL_ORIGIN = "https://docs.wednesdaychat.com"
LANGUAGE = "en"
MAX_CONTENT_CHARS = 12_000
VALID_LIFECYCLES = {"stable", "preview", "deprecated"}

_FRONT_MATTER_BOUNDARY = "---"
_H1_RE = re.compile(r"^#\s+(.+?)\s*$")
_H2_RE = re.compile(r"^##\s+(.+?)\s*$")
_HEADING_RE = re.compile(r"^#{1,6}\s+(.+?)\s*$")
_HTML_TAG_RE = re.compile(r"<[^>]+>")
_MARKDOWN_LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
_MARKDOWN_IMAGE_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")
_INLINE_CODE_RE = re.compile(r"`([^`]+)`")
_NON_ID_RE = re.compile(r"[^a-z0-9]+")
_MULTI_BLANK_RE = re.compile(r"\n{3,}")


def _sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _slug(value: str, *, fallback: str = "section") -> str:
    normalized = _NON_ID_RE.sub("-", value.casefold()).strip("-")
    return normalized or fallback


def _parse_front_matter(text: str) -> tuple[dict[str, str], str]:
    lines = text.splitlines()
    if not lines or lines[0].strip() != _FRONT_MATTER_BOUNDARY:
        return {}, text

    try:
        closing = next(
            index
            for index, line in enumerate(lines[1:], start=1)
            if line.strip() == _FRONT_MATTER_BOUNDARY
        )
    except StopIteration:
        raise ValueError("unterminated front matter") from None

    metadata: dict[str, str] = {}
    for raw in lines[1:closing]:
        if not raw.strip() or raw.lstrip().startswith("#") or ":" not in raw:
            continue
        key, value = raw.split(":", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key:
            metadata[key] = value
    return metadata, "\n".join(lines[closing + 1 :]).strip()


def _clean_line(line: str) -> str:
    stripped = line.rstrip()
    if stripped.startswith("{%") or stripped.startswith("{{"):
        return ""
    stripped = _MARKDOWN_IMAGE_RE.sub(lambda match: match.group(1), stripped)
    stripped = _MARKDOWN_LINK_RE.sub(lambda match: f"{match.group(1)} ({match.group(2)})", stripped)
    stripped = _HTML_TAG_RE.sub(" ", stripped)
    heading = _HEADING_RE.match(stripped)
    if heading:
        stripped = heading.group(1)
    stripped = _INLINE_CODE_RE.sub(lambda match: match.group(1), stripped)
    stripped = re.sub(r"[ \t]+", " ", stripped).strip()
    return stripped


def _normalize_content(lines: list[str]) -> str:
    cleaned = [_clean_line(line) for line in lines]
    text = "\n".join(cleaned).strip()
    text = _MULTI_BLANK_RE.sub("\n\n", text)
    return text


def _split_long_content(content: str) -> list[str]:
    if len(content) <= MAX_CONTENT_CHARS:
        return [content]

    paragraphs = content.split("\n\n")
    parts: list[str] = []
    current: list[str] = []
    current_length = 0

    def flush() -> None:
        nonlocal current, current_length
        if current:
            parts.append("\n\n".join(current).strip())
            current = []
            current_length = 0

    for paragraph in paragraphs:
        if len(paragraph) > MAX_CONTENT_CHARS:
            flush()
            start = 0
            while start < len(paragraph):
                parts.append(paragraph[start : start + MAX_CONTENT_CHARS].strip())
                start += MAX_CONTENT_CHARS
            continue

        extra = len(paragraph) + (2 if current else 0)
        if current and current_length + extra > MAX_CONTENT_CHARS:
            flush()
        current.append(paragraph)
        current_length += len(paragraph) + (2 if len(current) > 1 else 0)

    flush()
    return [part for part in parts if part]


def _canonical_url(path: Path) -> str:
    relative = path.relative_to(ROOT)
    if relative == Path("index.md"):
        return f"{CANONICAL_ORIGIN}/"
    if relative.name != "index.md":
        raise ValueError(f"runtime corpus source must be an index page: {relative.as_posix()}")
    route = relative.parent.as_posix().strip("/")
    return f"{CANONICAL_ORIGIN}/{route}/"


def _page_key(path: Path) -> str:
    relative = path.relative_to(ROOT)
    if relative == Path("index.md"):
        return "overview"
    segments = [segment for segment in relative.parent.parts if segment]
    return ".".join(_slug(segment, fallback="page") for segment in segments)


def _tags_for(path: Path) -> list[str]:
    relative = path.relative_to(ROOT)
    if relative == Path("index.md"):
        return ["overview"]
    tags = [_slug(segment, fallback="docs") for segment in relative.parent.parts]
    return list(dict.fromkeys(tags))[:16]


def _iter_source_pages() -> list[Path]:
    policy = json.loads(POLICY_PATH.read_text(encoding="utf-8"))
    roots = [str(value) for value in policy.get("public_source_roots", [])]
    pages: set[Path] = set()

    root_index = ROOT / "index.md"
    if root_index.exists():
        pages.add(root_index)

    for source_root in roots:
        directory = ROOT / source_root
        if not directory.exists() or not directory.is_dir():
            continue
        pages.update(path for path in directory.rglob("index.md") if path.is_file())

    return sorted(pages, key=lambda path: path.relative_to(ROOT).as_posix())


def _sections(body: str, *, page_title: str) -> list[tuple[str, list[str]]]:
    sections: list[tuple[str, list[str]]] = []
    current_title = "Overview"
    current_lines: list[str] = []

    for raw in body.splitlines():
        h1 = _H1_RE.match(raw)
        if h1:
            if h1.group(1).strip() == page_title.strip():
                continue
        h2 = _H2_RE.match(raw)
        if h2:
            content = _normalize_content(current_lines)
            if content:
                sections.append((current_title, current_lines))
            current_title = h2.group(1).strip()
            current_lines = []
            continue
        current_lines.append(raw)

    content = _normalize_content(current_lines)
    if content:
        sections.append((current_title, current_lines))
    return sections


def build_runtime_corpus() -> dict[str, object]:
    chunks: list[dict[str, object]] = []

    for path in _iter_source_pages():
        relative = path.relative_to(ROOT).as_posix()
        metadata, body = _parse_front_matter(path.read_text(encoding="utf-8"))
        if metadata.get("search", "").casefold() == "false":
            continue

        title = metadata.get("title", "").strip()
        if not title:
            match = next((_H1_RE.match(line) for line in body.splitlines() if _H1_RE.match(line)), None)
            if match is None:
                raise ValueError(f"runtime corpus page has no title: {relative}")
            title = match.group(1).strip()

        lifecycle = metadata.get("lifecycle", "stable").strip().casefold() or "stable"
        if lifecycle not in VALID_LIFECYCLES:
            raise ValueError(f"unsupported lifecycle {lifecycle!r} in {relative}")

        page_key = _page_key(path)
        canonical_url = _canonical_url(path)
        tags = _tags_for(path)
        section_name_counts: dict[str, int] = {}
        ordinal = 0

        for section_title, raw_lines in _sections(body, page_title=title):
            normalized = _normalize_content(raw_lines)
            if not normalized:
                continue
            section_slug = _slug(section_title)
            section_name_counts[section_slug] = section_name_counts.get(section_slug, 0) + 1
            occurrence = section_name_counts[section_slug]
            section_id = f"{page_key}.{section_slug}"
            if occurrence > 1:
                section_id = f"{section_id}.{occurrence}"

            parts = _split_long_content(normalized)
            for part_index, part in enumerate(parts, start=1):
                chunk_id = section_id if len(parts) == 1 else f"{section_id}.part-{part_index}"
                url = canonical_url
                if section_title != "Overview":
                    url = f"{canonical_url}#{_slug(section_title)}"
                chunks.append(
                    {
                        "id": chunk_id,
                        "title": title,
                        "section": section_title,
                        "url": url,
                        "content": part,
                        "content_hash": _sha256_text(part),
                        "tags": tags,
                        "lifecycle": lifecycle,
                        "source_path": relative,
                        "ordinal": ordinal,
                    }
                )
                ordinal += 1

    if not chunks:
        raise ValueError("runtime corpus source set produced no chunks")

    identifiers = [str(chunk["id"]) for chunk in chunks]
    if len(identifiers) != len(set(identifiers)):
        duplicates = sorted({value for value in identifiers if identifiers.count(value) > 1})
        raise ValueError(f"runtime corpus chunk IDs are not unique: {duplicates}")

    canonical_chunk_bytes = json.dumps(
        chunks,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    corpus_hash = hashlib.sha256(canonical_chunk_bytes).hexdigest()

    return {
        "schema_version": SCHEMA_VERSION,
        "corpus_id": CORPUS_ID,
        "canonical_origin": CANONICAL_ORIGIN,
        "language": LANGUAGE,
        "corpus_hash": corpus_hash,
        "chunk_count": len(chunks),
        "chunks": chunks,
    }


def render_runtime_corpus(corpus: dict[str, object]) -> str:
    return json.dumps(corpus, ensure_ascii=False, indent=2, sort_keys=False) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Build the deterministic WEDNESDAY public docs runtime corpus.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--check", action="store_true", help="fail unless the committed output matches a fresh deterministic build")
    args = parser.parse_args()

    try:
        rendered = render_runtime_corpus(build_runtime_corpus())
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"RUNTIME CORPUS BUILD: ERROR: {exc}", file=sys.stderr)
        return 2

    output = args.output if args.output.is_absolute() else ROOT / args.output
    if args.check:
        if not output.exists():
            print(f"RUNTIME CORPUS BUILD: DRIFT: missing {output.relative_to(ROOT)}", file=sys.stderr)
            return 1
        committed = output.read_text(encoding="utf-8")
        if committed != rendered:
            print(f"RUNTIME CORPUS BUILD: DRIFT: regenerate {output.relative_to(ROOT)}", file=sys.stderr)
            return 1
        print(f"Runtime corpus: OK ({json.loads(rendered)['chunk_count']} chunks)")
        return 0

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(rendered, encoding="utf-8")
    print(f"Runtime corpus: wrote {output.relative_to(ROOT)} ({json.loads(rendered)['chunk_count']} chunks)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
