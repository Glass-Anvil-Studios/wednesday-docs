---
title: Deep research
eyebrow: Core platform
description: Inspect and cancel durable WEDNESDAY deep-research tasks associated with authenticated conversations.
permalink: /deep-research/
markdown_url: /deep-research.md
---

# Deep research

<p class="lead">Deep research work is represented by durable, account-owned task records so longer-running research can be inspected independently of a single browser stream.</p>

## Task routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/conversations/{conversation_id}/research-tasks` | List research tasks for a conversation |
| `GET` | `/research-tasks/{task_id}` | Load one task |
| `POST` | `/research-tasks/{task_id}/cancel` | Request cancellation |

Conversation task listing accepts a bounded `limit` from 1 to 100 with a default of 20.

## Durable ownership

Research tasks are resolved inside the authenticated account boundary. Task and conversation identifiers do not replace session authority.

## Lifecycle errors

- `404` — the task or associated resource is not available to the account.
- `409` — the requested lifecycle transition conflicts with current task state.
- `422` — a supplied value violates the public request contract.
- `429` — the research-work protection limit is exceeded.
- `503` — task persistence or protection is unavailable.

## Cache behavior

Task reads and cancellation responses are emitted with `Cache-Control: no-store` so clients do not reuse stale research state.
