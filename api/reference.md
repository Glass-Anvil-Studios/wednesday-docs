# API reference

The production API origin is `https://api.wednesdaychat.com`. This reference documents only routes and behaviors that are verified in the production service and safe to publish.

Access boundary: WEDNESDAY currently uses server-authorized account sessions for most product operations. The existence of an HTTP route does not imply an unrestricted third-party API-key contract.

## System

### GET /health

Lightweight service health probe. Returns an `ok` health status when the API process is available.

### GET /ready

Production readiness probe. Readiness depends on required backing services including persistence, cache, object storage, malware scanning, and model access.

### GET /version

Returns the WEDNESDAY API service identity, environment, build SHA when available, and configured model-provider family. The response is marked `no-store`.

## Search

### GET /search?q=…

Searches durable account-owned WEDNESDAY state. Query text is required and bounded; result size is bounded by the service.

## Projects

Verified project operations include listing, creating, loading, renaming, archiving, restoring, and deleting projects; reading and updating project settings and instructions; project search; project conversations; file membership; connector bindings; and work history.

## Conversations

Verified conversation operations include listing and loading conversations, messages, drafts, follow-ups, branches, archive state, pin state, project movement, feedback, sharing, usage recording, and durable deletion.

## Chat streaming

### POST /chat

Starts a durable streaming chat turn for the authorized account. The stream is explicitly non-cacheable and supports structured runtime events.

### POST /chat/{turn_id}/input

Submits mid-turn steering input to an active turn. Durable cancellation is supported when the turn identifier resolves to a durable chat turn.

## Files and artifacts

The production service exposes owner-scoped file upload, file inspection, file-library, picker, attachment-state, download, message-attachment, assistant-artifact, location-context, memory-source-consent, and deep-research routers. Individual contracts are published only after their request/response schemas are stable enough to support externally.

## Contract policy

Routes used only for internal operations, provider callbacks, privileged administration, deployment, or implementation-specific coordination are intentionally omitted. Public documentation is a compatibility promise; source-code presence alone is not.
