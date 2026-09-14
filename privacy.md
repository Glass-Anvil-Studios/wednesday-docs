# Privacy

<p class="lead">WEDNESDAY scopes durable product data to the authorized account and documents privacy-relevant behavior only where it is a stable public contract.</p>

## Account-scoped state

Projects, conversations, files, search results, feedback, research state, and related durable records are resolved through the authorized account boundary. Public share links are a deliberate exception: they expose only the share target represented by the generated share token.

## Data minimization

Clients should send only the information required for the requested workflow. Do not place secrets, credentials, or unrelated personal data into prompts, project instructions, file metadata, tool arguments, logs, or public share links.

## Files and connectors

Files and connector-backed resources remain subject to owner and connector scope. Applications should preserve the user's authorization boundary when displaying, caching, exporting, or acting on retrieved data.

## Public documentation

This public documentation intentionally excludes secret configuration, internal endpoints, private deployment topology, incident procedures, privileged administration behavior, and implementation details that would unnecessarily expand the public data surface.

## Product policy

<div class="notice">This developer page describes technical privacy boundaries, not the full WEDNESDAY consumer privacy policy or legal terms. Product-facing privacy notices remain authoritative for legal disclosures and user rights.</div>
