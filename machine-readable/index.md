---
title: Machine-readable documentation
eyebrow: Reference
description: Machine-readable documentation entry points for AI agents, search systems, and automated tooling.
permalink: /machine-readable/
---

# Machine-readable documentation

<p class="lead">WEDNESDAY publishes stable text entry points so AI agents and automated systems can discover the same public documentation humans use.</p>

## `llms.txt`

[`/llms.txt`](/llms.txt) is the compact routing index. Agents should start there when they need to discover relevant documentation without downloading the full site.

## `llms-full.txt`

[`/llms-full.txt`](/llms-full.txt) is a consolidated text corpus of the public documentation currently published in this repository. It is useful when a retriever needs a single ingestible source.

## Search and crawling

[`/robots.txt`](/robots.txt) permits public crawling and points to [`/sitemap.xml`](/sitemap.xml). These files are publication aids; they do not grant access to non-public WEDNESDAY systems or information.

## Source integrity

Machine consumers should treat URLs on `docs.wednesdaychat.com` as the canonical public source and preserve page titles, update dates, and lifecycle notices when indexing content.
