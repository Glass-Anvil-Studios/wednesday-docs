# Models

<p class="lead">WEDNESDAY can route a turn through model roles, intelligence levels, latency profiles, and reasoning profiles. Only stable, explicitly documented model identifiers are treated as public contracts.</p>

## Routing is part of execution

The streaming protocol can represent resolved routing information for a turn, including a model identifier, model role, requested and resolved intelligence level, latency profile, reasoning profile, and bounded completion behavior.

Those runtime fields make execution observable. They do **not** automatically make every internal route target a permanently supported developer model ID.

## Public model contract

A model becomes part of the public catalog only when WEDNESDAY publishes:

- a stable model identifier;
- supported input/output modalities;
- tool compatibility;
- public limits that developers may rely on;
- lifecycle state;
- migration guidance when behavior is replaced or retired.

<div class="notice"><strong>Current support boundary:</strong> this page intentionally does not turn private provider configuration or internal fallback routes into a public compatibility promise.</div>

## Model selection

Use product-level intelligence and latency controls only as documented by the interface that exposes them. Do not assume that a UI label maps one-to-one to a permanent upstream provider model.

## Lifecycle

When a public model contract is deprecated, the change belongs in [Deprecations](/deprecations/) and the [Changelog](/changelog/) before removal.
