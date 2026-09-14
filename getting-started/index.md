---
title: Developer quickstart
eyebrow: Get started
description: Verify the WEDNESDAY production API origin and understand the supported access boundary before integrating.
permalink: /getting-started/
markdown_url: /getting-started.md
---

# Developer quickstart

<p class="lead">Start with the production contract that exists today: a public HTTPS origin and session-protected product APIs.</p>

## Production origin

The canonical WEDNESDAY API origin is:

```text
https://api.wednesdaychat.com
```

The documentation origin is independent:

```text
https://docs.wednesdaychat.com
```

## Check platform availability

Use [status.wednesdaychat.com](https://status.wednesdaychat.com) for current WEDNESDAY service availability, maintenance, and incident communication. Operational probe routes and internal service metadata are not part of the public developer contract.

## Understand authentication before calling product APIs

WEDNESDAY's current production product APIs use a server-authoritative account session. Browser requests include the session credential automatically, and unsafe mutations require the WEDNESDAY CSRF header.

Do **not** construct authority by sending owner IDs, roles, plans, or retired client identity headers. The server session is authoritative.

<div class="notice"><strong>External developer access:</strong> this documentation does not claim a generally available API-key authentication scheme. When WEDNESDAY publishes one, the Authentication and API Reference pages will define it as an explicit public contract.</div>

## Choose the right guide

- Use [Conversation state](/platform/conversation-state/) for durable chat state.
- Use [Streaming](/platform/streaming/) for the structured SSE protocol.
- Use [Projects](/projects/) for scoped context and project-owned resources.
- Use [Files](/files/) for the secure upload lifecycle.
- Use [API reference](/api/reference/) for verified routes and access classification.

## Machine-readable version

The raw Markdown twin for this page is available at [`/getting-started.md`](/getting-started.md).
