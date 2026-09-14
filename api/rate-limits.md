# Rate limits

<p class="lead">WEDNESDAY applies protection at the production service boundary. Chat and durable-state operations use dedicated rate-limit paths, and the platform can fail closed when protection infrastructure is unavailable.</p>

## What is limited

Verified production code applies rate-limit enforcement to chat traffic and to conversation-oriented persistence flows used by search, projects, files, feedback, sharing, and related durable operations.

## `429 Too Many Requests`

When a limit is exceeded, the API returns `429`. Where available, the response includes `Retry-After` with the number of seconds a client should wait before retrying.

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 12
Content-Type: application/json
```

## Protection availability

WEDNESDAY does not silently bypass protection when its rate-limit layer cannot make a trustworthy decision. A protection dependency failure can surface as `503 Service Unavailable` instead of allowing unprotected traffic.

## Published quotas

<div class="notice"><strong>No invented quotas.</strong> Numeric request-per-minute or token quotas are not published until they are a stable product contract. Clients should implement backoff for `429` independently of any assumed quota.</div>

## Client guidance

Use bounded exponential backoff, honor `Retry-After`, avoid retry storms, and keep idempotent operations safe to replay where the endpoint contract allows it. For state-changing requests, reconcile the durable result before blindly retrying after network uncertainty.
