# Production best practices

<p class="lead">Move from prototype assumptions to production-safe WEDNESDAY integrations with explicit contracts, bounded retries, durable state reconciliation, security boundaries, and release-aware dependency management.</p>

## Treat documented contracts as the boundary

Depend only on behavior published in this documentation or another explicitly versioned WEDNESDAY contract. Do not build against private provider names, internal deployment topology, hidden headers, implementation-only routes, or source-code details that are not documented as supported.

## Design for durable state

WEDNESDAY is stateful. Conversations, projects, files, research tasks, feedback, sharing, and other workflows can persist independently of a single browser request. After ambiguous network failures, reconcile server state before repeating state-changing operations.

## Handle streaming as a protocol

Chat is delivered as a structured streaming workflow rather than a single response body. Clients should handle connection loss, terminal events, tool lifecycle state, steering acceptance, cancellation, and durable recovery without deriving state from visible text alone.

## Use bounded retries

- honor `Retry-After` on `429`;
- back off on transient `503` failures;
- do not retry semantic `4xx` failures without changing the request;
- keep retries bounded and jittered;
- reconcile durable state after uncertain writes.

## Secure account-owned data

Protected WEDNESDAY operations are scoped through server-authorized account sessions. Never substitute caller-provided ownership for server-derived authority. Keep credentials, private connector tokens, session material, and internal deployment values out of client logs and public documentation.

## Files and external data

Treat uploads and connector data as untrusted input. Respect file-size and media-type constraints, malware/content validation, owner scope, connector scope, and explicit approval boundaries for external actions.

## Observe dependency health

The API exposes separate health, readiness, and version behavior. A process can be alive while the platform is not ready to serve production traffic. Production systems should distinguish availability from readiness and avoid routing critical work to an unready dependency.

## Release discipline

Production documentation changes should pass source validation, a deterministic Jekyll build, generated-site link validation, machine-readable corpus checks, and review before promotion to `main`.

<div class="notice"><strong>Public docs are production surface.</strong> A documentation regression can break integrations just as surely as an API regression. WEDNESDAY treats docs, machine-readable indexes, and published API contracts as release artifacts.</div>
