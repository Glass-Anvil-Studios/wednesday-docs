# API reference

<p class="lead">The production API origin is <code>https://api.wednesdaychat.com</code>. This reference documents only routes and behaviors that are verified in the production service and safe to publish.</p>

<div class="notice"><strong>Access boundary:</strong> WEDNESDAY currently uses server-authorized account sessions for most product operations. The existence of an HTTP route does not imply an unrestricted third-party API-key contract.</div>

## System

<div class="endpoint"><div class="endpoint-head"><span class="method">GET</span><span class="endpoint-path">/health</span></div><div class="endpoint-body"><p>Lightweight service health probe. Returns an <code>ok</code> health status when the API process is available.</p></div></div>

<div class="endpoint"><div class="endpoint-head"><span class="method">GET</span><span class="endpoint-path">/ready</span></div><div class="endpoint-body"><p>Production readiness probe. Readiness depends on required backing services including persistence, cache, object storage, malware scanning, and model access.</p></div></div>

<div class="endpoint"><div class="endpoint-head"><span class="method">GET</span><span class="endpoint-path">/version</span></div><div class="endpoint-body"><p>Returns the WEDNESDAY API service identity, environment, build SHA when available, and configured model-provider family. The response is marked <code>no-store</code>.</p></div></div>

## Search

<div class="endpoint"><div class="endpoint-head"><span class="method">GET</span><span class="endpoint-path">/search?q=…</span></div><div class="endpoint-body"><p>Searches durable account-owned WEDNESDAY state. Query text is required and bounded; result size is bounded by the service.</p></div></div>

## Projects

Verified project operations include listing, creating, loading, renaming, archiving, restoring, and deleting projects; reading and updating project settings and instructions; project search; project conversations; file membership; connector bindings; and work history.

## Conversations

Verified conversation operations include listing and loading conversations, messages, drafts, follow-ups, branches, archive state, pin state, project movement, feedback, sharing, usage recording, and durable deletion.

## Chat streaming

<div class="endpoint"><div class="endpoint-head"><span class="method post">POST</span><span class="endpoint-path">/chat</span></div><div class="endpoint-body"><p>Starts a durable streaming chat turn for the authorized account. The stream is explicitly non-cacheable and supports structured runtime events.</p></div></div>

<div class="endpoint"><div class="endpoint-head"><span class="method post">POST</span><span class="endpoint-path">/chat/{turn_id}/input</span></div><div class="endpoint-body"><p>Submits mid-turn steering input to an active turn. Durable cancellation is supported when the turn identifier resolves to a durable chat turn.</p></div></div>

## Files and artifacts

The production service exposes owner-scoped file upload, file inspection, file-library, picker, attachment-state, download, message-attachment, assistant-artifact, location-context, memory-source-consent, and deep-research routers. Individual contracts are published only after their request/response schemas are stable enough to support externally.

## Contract policy

Routes used only for internal operations, provider callbacks, privileged administration, deployment, or implementation-specific coordination are intentionally omitted. Public documentation is a compatibility promise; source-code presence alone is not.
