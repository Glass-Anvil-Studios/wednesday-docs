---
title: Errors
eyebrow: API
description: Error semantics for WEDNESDAY production API requests.
permalink: /api/errors/
markdown_url: /api/errors.md
---

# Errors

<p class="lead">WEDNESDAY uses standard HTTP status codes plus concise error detail strings. Clients should branch on status and documented semantics rather than parsing incidental implementation text.</p>

## Common status codes

| Status | Meaning |
| --- | --- |
| `400` | Invalid request shape or transport constraint. |
| `404` | Requested account-owned resource or share target was not found. |
| `409` | The requested state transition conflicts with current durable state. |
| `410` | A time-bounded resource, such as an upload session, has expired. |
| `413` | A request body exceeds the accepted size. |
| `415` | An uploaded media type or content representation is unsupported. |
| `422` | A validated parameter or identifier is semantically invalid. |
| `429` | A rate limit was exceeded. Respect `Retry-After` when supplied. |
| `503` | A required WEDNESDAY dependency or protection layer is unavailable. |

## Retry behavior

Retry only when the failure class is plausibly transient. `429` responses may include a `Retry-After` header and should not be retried before that delay. `503` can indicate unavailable persistence, cache, model access, storage, protection, or other required platform dependencies.

Do not automatically retry `400`, `404`, `409`, `410`, `413`, `415`, or `422` without changing the request or reconciling state.

## Durable conflicts

A `409` response is meaningful platform state, not a generic transport failure. Examples include trying to mutate a resource after its state has moved on or submitting steering after a turn is no longer accepting input.

## Error text

<div class="notice">Error detail strings are intended for diagnostics, but clients should not treat undocumented wording as a stable machine contract. Stable client behavior should key off HTTP status and fields explicitly documented for the endpoint.</div>
