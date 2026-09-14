---
title: WEDNESDAY Documentation
eyebrow: Developer platform
description: Official developer documentation for building, integrating, and operating with WEDNESDAY.
permalink: /
---

<div class="hero">
  <span class="status"><span class="status-dot"></span> Documentation online</span>

# Build with WEDNESDAY

<p class="lead">Official developer documentation for the WEDNESDAY platform. Start with platform concepts, then move into verified models, agents, tools, integrations, production guidance, and the public API reference.</p>

<div class="hero-actions">
  <a class="button" href="/getting-started/">Developer quickstart</a>
  <a class="button secondary" href="/api/">API reference</a>
</div>
</div>

## Start here

<div class="grid">
<a class="card" href="/getting-started/"><div class="card-title">Developer quickstart</div><div class="card-copy">Learn how the documentation is organized and where to begin when building against WEDNESDAY.</div></a>
<a class="card" href="/platform/"><div class="card-title">Platform concepts</div><div class="card-copy">Understand the public concepts and terminology used across the WEDNESDAY developer platform.</div></a>
<a class="card" href="/api/"><div class="card-title">API reference</div><div class="card-copy">Use the production-synchronized public API contract and endpoint documentation.</div></a>
<a class="card" href="/changelog/"><div class="card-title">Changelog</div><div class="card-copy">Track meaningful public documentation, contract, and platform changes as they are released.</div></a>
</div>

## Explore the platform

<div class="grid">
<a class="card" href="/models/"><div class="card-title">Models</div><div class="card-copy">Verified model identifiers, supported behavior, lifecycle information, and selection guidance.</div></a>
<a class="card" href="/agents/"><div class="card-title">Agents</div><div class="card-copy">Public agent architecture, supported behavior, and developer-facing workflows.</div></a>
<a class="card" href="/tools/"><div class="card-title">Tools</div><div class="card-copy">Developer-facing tools and tool behavior that have been verified for public release.</div></a>
<a class="card" href="/integrations/"><div class="card-title">Integrations</div><div class="card-copy">Supported external integrations and the public contracts that govern them.</div></a>
</div>

## Production and operations

Use the production sections for public guidance on [reliability](/reliability/), [security](/security/), lifecycle changes, and deprecations. Operational details are published only when they are intended to be part of the supported public platform contract.

<div class="notice"><strong>Production-grounded documentation.</strong> Endpoints, model limits, tool behavior, quotas, security claims, and lifecycle statements are published only after they are verified against production source, a production specification, or another explicitly versioned public contract.</div>

## One public source of truth

This site is the canonical public developer reference for WEDNESDAY. Internal implementation details, administrative surfaces, secrets, infrastructure internals, and unsupported capabilities are intentionally excluded from the public documentation.

## Machine-readable by design

The documentation is structured for developers, search engines, and AI agents. Use [`/llms.txt`](/llms.txt) for the routing index and [`/llms-full.txt`](/llms-full.txt) for the consolidated public documentation corpus.
