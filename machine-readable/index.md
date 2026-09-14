---
title: Machine-readable documentation
eyebrow: Reference
description: Machine-readable documentation entry points for AI agents, search systems, and automated tooling.
permalink: /machine-readable/
---

# Machine-readable documentation

<p class="lead">WEDNESDAY publishes stable text and contract entry points so AI agents and automated systems can discover the same public documentation humans use.</p>

## `llms.txt`

[`/llms.txt`](/llms.txt) is the compact routing index. Agents should start there when they need to discover relevant documentation without downloading the full site.

## `llms-full.txt`

[`/llms-full.txt`](/llms-full.txt) is a consolidated text corpus of the public documentation currently published in this repository. It is useful when a retriever needs a single ingestible source.

## Runtime retrieval corpus

[`/runtime-corpus.json`](/runtime-corpus.json) is the deterministic, section-level public knowledge corpus used by WEDNESDAY's self-knowledge retrieval work. Each chunk carries a stable ID, canonical documentation URL, bounded content, lifecycle state, retrieval tags, source path, and SHA-256 content fingerprint. The corpus itself has a deterministic SHA-256 fingerprint.

The corpus is product knowledge only. It does not grant runtime capability, account entitlement, permission, approval, or model-tool authority. Current server/runtime authority always has higher precedence than retrieved documentation.

The schema is published at [`/contracts/runtime-corpus.schema.json`](/contracts/runtime-corpus.schema.json).

## Public API structural contract

[`/contracts/public-api-contract.json`](/contracts/public-api-contract.json) is the sanitized structural snapshot for API operations that WEDNESDAY has explicitly approved for public documentation. It contains public method/path metadata, parameter locations, media types, response statuses, and cryptographic structural fingerprints.

The structural snapshot is intentionally narrower than the production service's complete API graph. It does not enumerate private routes, internal schema bodies, implementation descriptions, provider routing, infrastructure metadata, or private source identifiers. Absence from this artifact means an operation is not part of the published developer contract.

A contract fingerprint changes when the approved production request/response structure changes. WEDNESDAY uses that signal as a documentation drift gate; it is not a substitute for the human API reference.

## Search and crawling

[`/robots.txt`](/robots.txt) permits public crawling and points to [`/sitemap.xml`](/sitemap.xml). These files are publication aids; they do not grant access to non-public WEDNESDAY systems or information.

## Source integrity

Machine consumers should treat URLs on `docs.wednesdaychat.com` as the canonical public source and preserve page titles, update dates, lifecycle notices, and contract fingerprints when indexing content.
