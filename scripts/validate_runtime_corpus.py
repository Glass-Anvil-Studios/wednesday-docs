#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import sys
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlsplit

import build_runtime_corpus as builder
import public_release_firewall as firewall

ROOT = Path(__file__).resolve().parents[1]
CORPUS_PATH = ROOT / "runtime-corpus.json"

TOP_LEVEL_KEYS = {
    "schema_version",
    "corpus_id",
    "canonical_origin",
    "language",
    "corpus_hash",
    "chunk_count",
    "chunks",
}
CHUNK_KEYS = {
    "id",
    "title",
    "section",
    "url",
    "content",
    "content_hash",
    "tags",
    "lifecycle",
    "source_path",
    "ordinal",
}
ID_RE = re.compile(r"^[a-z0-9][a-z0-9._-]{2,159}$")
TAG_RE = re.compile(r"^[a-z0-9][a-z0-9._-]{0,63}$")
HASH_RE = re.compile(r"^[a-f0-9]{64}$")


class RuntimeCorpusValidationError(ValueError):
    pass


def _require(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeCorpusValidationError(message)


def _canonical_chunk_hash(chunks: list[dict[str, object]]) -> str:
    payload = json.dumps(
        chunks,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def _approved_source_paths() -> set[str]:
    return {
        path.relative_to(ROOT).as_posix()
        for path in builder._iter_source_pages()
    }


def _validate_chunk_shape(chunk: dict[str, object], index: int) -> None:
    _require(set(chunk) == CHUNK_KEYS, f"chunk {index} has unexpected or missing fields")

    identifier = chunk["id"]
    _require(isinstance(identifier, str) and ID_RE.fullmatch(identifier) is not None, f"chunk {index} has invalid id")

    for field in ("title", "section", "url", "content", "content_hash", "lifecycle", "source_path"):
        _require(isinstance(chunk[field], str), f"chunk {identifier} field {field} must be a string")

    _require(1 <= len(str(chunk["title"])) <= 200, f"chunk {identifier} title is out of bounds")
    _require(1 <= len(str(chunk["section"])) <= 200, f"chunk {identifier} section is out of bounds")
    _require(1 <= len(str(chunk["content"])) <= builder.MAX_CONTENT_CHARS, f"chunk {identifier} content is out of bounds")
    _require(HASH_RE.fullmatch(str(chunk["content_hash"])) is not None, f"chunk {identifier} has invalid content hash")
    _require(str(chunk["lifecycle"]) in builder.VALID_LIFECYCLES, f"chunk {identifier} has invalid lifecycle")

    ordinal = chunk["ordinal"]
    _require(isinstance(ordinal, int) and not isinstance(ordinal, bool) and ordinal >= 0, f"chunk {identifier} has invalid ordinal")

    tags = chunk["tags"]
    _require(isinstance(tags, list), f"chunk {identifier} tags must be a list")
    _require(len(tags) <= 16, f"chunk {identifier} has too many tags")
    _require(len(tags) == len(set(tags)), f"chunk {identifier} has duplicate tags")
    for tag in tags:
        _require(isinstance(tag, str) and TAG_RE.fullmatch(tag) is not None, f"chunk {identifier} has invalid tag")


def _validate_chunk_integrity(
    chunk: dict[str, object],
    *,
    approved_sources: set[str],
    policy: dict,
    allowlist: dict,
) -> None:
    identifier = str(chunk["id"])
    content = str(chunk["content"])
    expected_content_hash = hashlib.sha256(content.encode("utf-8")).hexdigest()
    _require(chunk["content_hash"] == expected_content_hash, f"chunk {identifier} content hash mismatch")

    source_path = str(chunk["source_path"])
    _require(source_path in approved_sources, f"chunk {identifier} source path is not an approved public page")

    source = ROOT / source_path
    expected_page_url = builder._canonical_url(source)
    url = str(chunk["url"])
    parsed = urlsplit(url)
    _require(parsed.scheme == "https" and parsed.netloc == "docs.wednesdaychat.com", f"chunk {identifier} URL is outside canonical docs origin")
    if str(chunk["section"]) == "Overview":
        _require(url == expected_page_url, f"chunk {identifier} overview URL does not match source page")
    else:
        _require(url.startswith(f"{expected_page_url}#"), f"chunk {identifier} section URL does not match source page")

    serialized = json.dumps(chunk, ensure_ascii=False, sort_keys=True)
    findings = firewall.scan_text(
        f"runtime-corpus:{identifier}",
        serialized,
        policy,
        allowlist,
    )
    _require(not findings, f"chunk {identifier} failed public release firewall: {findings[0].rule if findings else 'unknown'}")


def validate_runtime_corpus(payload: object) -> dict[str, object]:
    _require(isinstance(payload, dict), "runtime corpus must be a JSON object")
    corpus = payload
    _require(set(corpus) == TOP_LEVEL_KEYS, "runtime corpus has unexpected or missing top-level fields")
    _require(corpus["schema_version"] == builder.SCHEMA_VERSION, "runtime corpus schema version mismatch")
    _require(corpus["corpus_id"] == builder.CORPUS_ID, "runtime corpus id mismatch")
    _require(corpus["canonical_origin"] == builder.CANONICAL_ORIGIN, "runtime corpus canonical origin mismatch")
    _require(corpus["language"] == builder.LANGUAGE, "runtime corpus language mismatch")
    _require(isinstance(corpus["chunk_count"], int) and not isinstance(corpus["chunk_count"], bool), "runtime corpus chunk_count must be an integer")
    _require(isinstance(corpus["chunks"], list) and corpus["chunks"], "runtime corpus chunks must be a non-empty list")

    raw_chunks = corpus["chunks"]
    _require(all(isinstance(chunk, dict) for chunk in raw_chunks), "runtime corpus chunks must be objects")
    chunks = list(raw_chunks)
    _require(corpus["chunk_count"] == len(chunks), "runtime corpus chunk_count mismatch")

    corpus_hash = corpus["corpus_hash"]
    _require(isinstance(corpus_hash, str) and HASH_RE.fullmatch(corpus_hash) is not None, "runtime corpus has invalid corpus hash")

    policy, allowlist, _exceptions = firewall.load_configuration()
    approved_sources = _approved_source_paths()
    identifiers: set[str] = set()
    ordinals: dict[str, list[int]] = defaultdict(list)

    for index, chunk in enumerate(chunks):
        _validate_chunk_shape(chunk, index)
        identifier = str(chunk["id"])
        _require(identifier not in identifiers, f"duplicate runtime corpus chunk id: {identifier}")
        identifiers.add(identifier)
        _validate_chunk_integrity(
            chunk,
            approved_sources=approved_sources,
            policy=policy,
            allowlist=allowlist,
        )
        ordinals[str(chunk["source_path"])].append(int(chunk["ordinal"]))

    for source_path, source_ordinals in ordinals.items():
        _require(
            source_ordinals == list(range(len(source_ordinals))),
            f"runtime corpus ordinals are not contiguous for {source_path}",
        )

    expected_corpus_hash = _canonical_chunk_hash(chunks)
    _require(corpus_hash == expected_corpus_hash, "runtime corpus fingerprint mismatch")
    return corpus


def main() -> int:
    try:
        payload = json.loads(CORPUS_PATH.read_text(encoding="utf-8"))
        corpus = validate_runtime_corpus(payload)
    except (OSError, json.JSONDecodeError, RuntimeCorpusValidationError) as exc:
        print(f"RUNTIME CORPUS VALIDATION: BLOCKED: {exc}", file=sys.stderr)
        return 1

    print(
        "Runtime corpus validation: OK "
        f"({corpus['chunk_count']} chunks, {corpus['corpus_hash']})"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
