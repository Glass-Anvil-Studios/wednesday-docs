# Conversation state

<p class="lead">Conversation state is a durable server-owned resource. It is scoped to the authenticated account and remains separate from the transport of a single live model response.</p>

## Core routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/conversations` | List account-owned conversations with cursor pagination |
| `GET` | `/conversations/{conversation_id}` | Load one conversation |
| `PUT` | `/conversations/{conversation_id}` | Persist a conversation write |
| `PUT` | `/conversations/{conversation_id}/title` | Update the title |
| `GET` | `/conversations/{conversation_id}/messages` | Page through messages |
| `PUT` | `/conversations/{conversation_id}/draft` | Persist the composer draft |
| `DELETE` | `/conversations/{conversation_id}` | Delete the conversation |

All routes in this table require the validated WEDNESDAY account session.

## Follow-ups and branches

The API supports queued follow-ups, follow-up reordering and state changes, creation of conversation branches from a message, and switching the active branch.

Branch operations remain conversation-owner scoped. A client cannot select another account's durable owner by supplying an owner identifier.

## Organization state

Conversation records can be archived, pinned, and moved into or out of projects. Project-move targets are returned from an owner-scoped route so the client does not need to infer allowed destinations.

## Feedback and sharing

Feedback is stored against the latest eligible response in the conversation. Share creation is session-protected, while resolution of a valid share token is part of the intentionally public surface.

## Consistency behavior

The persistence layer distinguishes missing resources, conflicts, rate limits, and temporary store failures. Clients should handle `404`, `409`, `429`, and `503` as distinct states rather than retrying every failure identically.
