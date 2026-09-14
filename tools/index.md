---
title: Tools
eyebrow: Build
description: WEDNESDAY tool families, execution lifecycle, authority boundaries, and public capability policy.
permalink: /tools/
markdown_url: /tools.md
---

# Using tools

<p class="lead">Extend a WEDNESDAY turn with search, files, research, location context, projects, connectors, and other bounded execution capabilities. Tool work is represented as typed runtime state rather than hidden model side effects.</p>

<div class="tool-tabs" role="list" aria-label="Tool families">
<span class="tool-tab active">Search</span><span class="tool-tab">Files</span><span class="tool-tab">Research</span><span class="tool-tab">Projects</span><span class="tool-tab">Connectors</span>
</div>

```text
User request
   ↓
WEDNESDAY runtime
   ↓
Tool start → progress/state → completion
   ↓
Structured result returned to the active turn
```

## Available tool families

<div class="capability-grid">
  <a class="capability-row" href="/search/"><span class="capability-icon">⌕</span><span><strong>Search and retrieval</strong><small>Search durable WEDNESDAY state and support retrieval-oriented workflows.</small></span></a>
  <a class="capability-row" href="/files/"><span class="capability-icon">▣</span><span><strong>Files and Library</strong><small>Upload, inspect, select, attach, retrieve, and manage account-owned file resources.</small></span></a>
  <a class="capability-row" href="/deep-research/"><span class="capability-icon">✦</span><span><strong>Deep research</strong><small>Track longer-running research work as durable task state rather than a single request.</small></span></a>
  <a class="capability-row" href="/projects/"><span class="capability-icon">◇</span><span><strong>Projects and context</strong><small>Use project instructions, settings, files, conversations, connectors, and work history as scoped context.</small></span></a>
  <a class="capability-row" href="/integrations/"><span class="capability-icon">↗</span><span><strong>Connectors</strong><small>Work with explicitly authorized external resources while preserving connector scope and approval boundaries.</small></span></a>
  <a class="capability-row" href="/platform/"><span class="capability-icon">◎</span><span><strong>Location and place context</strong><small>Use location preferences and place-enrichment capabilities where the product flow authorizes them.</small></span></a>
</div>

## Tool lifecycle

The live stream protocol can represent tool start, progress, state transition, and completion events. Stable turn, part, and tool hierarchy identifiers let a client render nested or parallel work without inferring execution state from prose.

## Authority and approvals

Tool availability never implies unlimited authority. File operations remain account-scoped, connector operations remain connector-scoped, public-network access is bounded by runtime policy, and risky external actions can require explicit approval before execution.

## Failure handling

A tool result can fail independently of the surrounding model turn. Clients should preserve tool state, surface meaningful failures, and avoid rewriting a failed execution as if the model merely “changed its mind.”

## Public capability policy

A tool becomes a supported developer capability only when its public name, inputs, outputs, authority requirements, failure behavior, and lifecycle are stable enough to depend on.

<div class="notice">Internal tool kinds, telemetry labels, and implementation-specific execution modules are not automatically public developer tools.</div>
