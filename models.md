# Models

<p class="lead">Choose the execution profile that matches the work. WEDNESDAY owns the routing contract while retaining freedom to improve the underlying provider route as long as the published profile behavior remains compatible.</p>

## Choose an execution profile

<div class="model-catalog">
  <article class="model-card model-balanced">
    <div class="model-visual"><span>Balanced</span></div>
    <div class="model-meta"><strong>Balanced</strong><span class="model-badge">Production</span></div>
    <p>Default conversational profile for responsive, general-purpose work with balanced reasoning and latency.</p>
  </article>
  <article class="model-card model-deep">
    <div class="model-visual"><span>Deep</span></div>
    <div class="model-meta"><strong>Deep reasoning</strong><span class="model-badge">Production</span></div>
    <p>Higher-reasoning profile for complex analysis and tasks where depth matters more than minimum latency.</p>
  </article>
  <article class="model-card model-code">
    <div class="model-visual"><span>Code</span></div>
    <div class="model-meta"><strong>Coding</strong><span class="model-badge">Production</span></div>
    <p>Code-oriented execution route used when the runtime classifies the work as software-development heavy.</p>
  </article>
</div>

<div class="notice"><strong>Profile ≠ provider model ID.</strong> WEDNESDAY can change an upstream route without renaming a WEDNESDAY execution profile when the public behavior remains compatible. Upstream provider identifiers are not a permanent developer contract unless explicitly published as one.</div>

## Routing is observable

The streaming protocol can represent resolved routing information for a turn, including a model identifier, model role, requested and resolved intelligence level, latency profile, reasoning profile, and bounded completion behavior. Those fields make execution observable; they do not automatically turn every internal route target into a permanently supported developer model.

## Public model contract

A named developer model becomes part of the public catalog only when WEDNESDAY publishes all of the following:

- a stable WEDNESDAY model identifier;
- supported input and output modalities;
- tool compatibility;
- public limits developers may rely on;
- lifecycle state;
- migration guidance when behavior is replaced or retired.

## Model selection

Use the product-level intelligence and latency controls documented by the interface that exposes them. For routine work, start with Balanced. Use Deep Reasoning when task difficulty justifies additional reasoning. Code-oriented work can resolve to the Coding profile through runtime routing.

## Lifecycle

Public model contracts follow an explicit lifecycle. Deprecation is announced through [Deprecations](/deprecations/) and the [Changelog](/changelog/) before a supported identifier is removed or materially changed.
