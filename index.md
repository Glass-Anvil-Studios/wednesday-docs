---
title: WEDNESDAY Developer Platform
eyebrow: API platform
description: Build on WEDNESDAY with production-verified documentation for platform behavior, APIs, models, agents, tools, integrations, and operations.
permalink: /
---

# API Platform

<div class="quickstart-panel">
  <div class="quickstart-copy">
    <h2>Developer quickstart</h2>
    <p>Start with the production boundary, learn the session model, then build against contracts that WEDNESDAY explicitly supports.</p>
    <div class="hero-actions"><a class="button" href="/getting-started/">Get started</a><a class="button secondary" href="/api/reference/">API reference</a></div>
  </div>
  <div class="quickstart-code">
    <div class="code-label">HTTP · verify production availability</div>

```bash
curl -sS https://api.wednesdaychat.com/health
# {"status":"ok"}
```
  </div>
</div>

<div class="notice"><strong>Production boundary:</strong> most product operations are authorized through a WEDNESDAY server account session. The public API origin is documented; a general third-party API-key program is not implied until WEDNESDAY explicitly releases one.</div>

## Build paths

<div class="build-paths">
  <div class="build-path"><strong>Platform and API</strong><p>Understand durable state, streaming, projects, files, search, errors, rate limits, and the verified HTTP surface.</p><a href="/getting-started/">Start with the platform ↗</a></div>
  <div class="build-path"><strong>Agents and tools</strong><p>Build around typed tool execution, project context, research, connectors, approvals, and observable runtime state.</p><a href="/agents/">Explore agents ↗</a></div>
</div>

## Models

WEDNESDAY routes work through stable execution profiles while retaining freedom to improve the upstream provider route behind those profiles.

<div class="model-catalog">
  <article class="model-card model-balanced"><a href="/models/" class="model-visual"><span>Balanced</span></a><div class="model-meta"><strong>Balanced</strong><span class="model-badge">Production</span></div><p>Responsive general-purpose work with balanced reasoning and latency.</p></article>
  <article class="model-card model-deep"><a href="/models/" class="model-visual"><span>Deep</span></a><div class="model-meta"><strong>Deep reasoning</strong><span class="model-badge">Production</span></div><p>Higher-reasoning execution for complex analysis and difficult multi-step work.</p></article>
  <article class="model-card model-code"><a href="/models/" class="model-visual"><span>Code</span></a><div class="model-meta"><strong>Coding</strong><span class="model-badge">Production</span></div><p>Code-oriented routing for software-development-heavy tasks.</p></article>
</div>

## Start building

<div class="capability-grid">
  <a class="capability-row" href="/platform/conversation-state/"><span class="capability-icon">◯</span><span><strong>Durable conversation state</strong><small>Persist and recover conversations rather than treating every request as isolated.</small></span></a>
  <a class="capability-row" href="/platform/streaming/"><span class="capability-icon">⌁</span><span><strong>Structured streaming</strong><small>Render typed model and tool events while work is still in progress.</small></span></a>
  <a class="capability-row" href="/tools/"><span class="capability-icon">✦</span><span><strong>Tool-using applications</strong><small>Extend model execution with bounded tools, search, files, research, and connectors.</small></span></a>
  <a class="capability-row" href="/projects/"><span class="capability-icon">◇</span><span><strong>Project context</strong><small>Scope instructions, files, connectors, conversations, and work history to a project.</small></span></a>
  <a class="capability-row" href="/files/"><span class="capability-icon">▣</span><span><strong>Files and Library</strong><small>Upload, inspect, attach, retrieve, and manage account-owned files.</small></span></a>
  <a class="capability-row" href="/deep-research/"><span class="capability-icon">◎</span><span><strong>Long-running research</strong><small>Track research as durable task state rather than one fragile request.</small></span></a>
</div>

## Production resources

<div class="grid">
<a class="card" href="/production/"><div class="card-title">Production best practices</div><div class="card-copy">Retries, durable reconciliation, readiness, security boundaries, and release discipline.</div></a>
<a class="card" href="/security/"><div class="card-title">Security</div><div class="card-copy">Authority, account scope, connector boundaries, and safe public-contract rules.</div></a>
<a class="card" href="/machine-readable/"><div class="card-title">Machine-readable docs</div><div class="card-copy"><code>llms.txt</code>, consolidated docs, Markdown twins, search index, sitemap, and crawler guidance.</div></a>
<a class="card" href="https://status.wednesdaychat.com"><div class="card-title">Status</div><div class="card-copy">Check WEDNESDAY service health and incident communication independently of this documentation site.</div></a>
</div>

## One source of truth

Public documentation is a production compatibility surface. Technical claims are published only when traceable to production behavior, a verified production specification, or another explicitly versioned public contract. Internal topology, secrets, provider routing, roadmap-only functionality, and privileged operational procedures stay out of the public corpus.
