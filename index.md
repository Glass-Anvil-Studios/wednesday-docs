---
title: WEDNESDAY Developer Platform
eyebrow: Developer platform
description: Build on WEDNESDAY with production-verified documentation for platform behavior, APIs, models, agents, tools, integrations, and operations.
permalink: /
---

<div class="hero">
<span class="status-pill">Production documentation</span>

# Build with WEDNESDAY

<p class="lead">Production-verified documentation for WEDNESDAY: durable conversations, streaming, projects, files, search, research, models, agents, tools, integrations, and the API boundary that connects them.</p>

<div class="hero-actions">
<a class="button" href="/getting-started/">Start building</a>
<a class="button secondary" href="/api/reference/">API reference</a>
</div>
</div>

## Start with the platform

<div class="grid">
<a class="card" href="/getting-started/"><div class="card-title">Developer quickstart</div><div class="card-copy">Understand the production origin, access model, and first verified request.</div></a>
<a class="card" href="/platform/"><div class="card-title">Core concepts</div><div class="card-copy">Learn how session authority, durable state, streaming, projects, and tools fit together.</div></a>
<a class="card" href="/api/reference/"><div class="card-title">API reference</div><div class="card-copy">Browse the deliberately published HTTP surface and its support boundary.</div></a>
<a class="card" href="/production/"><div class="card-title">Production</div><div class="card-copy">Security, privacy, reliability, rate-limit, and release guidance.</div></a>
</div>

## Frontier capability, explicit contracts

WEDNESDAY is built as a stateful AI platform rather than a single stateless completion endpoint. Conversations can persist, stream structured events, use tools, retain project context, accept mid-turn steering, attach files, search durable state, and support longer-running research workflows.

This documentation publishes only behavior that is safe to depend on. Internal routing, private infrastructure, secret configuration, roadmap-only features, and implementation details are not public API contracts.

<div class="notice"><strong>Access boundary:</strong> the production API origin is <code>https://api.wednesdaychat.com</code>. Most product operations require a valid WEDNESDAY server account session. An unrestricted third-party API-key contract is not implied by the existence of the API origin.</div>

## Built for people and models

Every substantive documentation page has a raw Markdown twin. Start machine retrieval with [`/llms.txt`](/llms.txt), use [`/llms-full.txt`](/llms-full.txt) for the consolidated corpus, and use [`/search.json`](/search.json) for the lightweight search index.
