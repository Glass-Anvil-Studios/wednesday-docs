# Mid-turn steering

<p class="lead">WEDNESDAY can accept supported input during a running turn instead of forcing every correction into a brand-new conversation turn.</p>

## Endpoint

<div class="endpoint"><div class="endpoint-head"><span class="method post">POST</span><span class="endpoint-path">/chat/{turn_id}/input</span></div><div class="endpoint-body"><p>Submit a validated steering payload to an active turn. Successful submission returns HTTP <code>202</code>.</p></div></div>

The operation is account-session protected and uses the same chat-rate-limit boundary as the live chat route.

## Acceptance window

Steering is not guaranteed after a turn stops accepting input. When the transport can no longer deliver steering, the API returns `409 Conflict` rather than acknowledging input that was not applied.

## Cancellation

Supported steering payloads can represent durable turn cancellation. Cancellation validates the durable turn identifier and persists the cancel request before the turn is treated as cancelled.

## Error behavior

- `404` — the durable turn does not exist for the account.
- `409` — the turn is no longer accepting steering.
- `422` — the cancellation form contains an invalid durable turn identifier.
- `429` — the chat rate limit is exceeded.
- `503` — steering transport, cancellation persistence, or rate-limit protection is unavailable.

Clients should surface these outcomes distinctly; a `409` is a lifecycle outcome, not a generic server failure.
