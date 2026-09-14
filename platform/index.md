---
title: Key concepts
eyebrow: Get started
description: Understand WEDNESDAY's server-authoritative sessions, durable state, streaming protocol, projects, and tool-oriented execution model.
permalink: /platform/
markdown_url: /platform.md
---

# Key concepts

<p class="lead">WEDNESDAY combines server-owned identity, durable conversation state, structured streaming, project context, and tool-oriented execution into one product runtime.</p>

## Server-authoritative identity

Protected operations derive the durable account owner from the validated server session. Client-supplied owner or role claims are not the authority boundary.

This design keeps conversation, project, file, search, feedback, and tool state consistently scoped to the authenticated account.

## Durable conversations

Conversation records are persisted independently of the live model stream. The platform supports conversation listing and loading, messages, drafts, follow-ups, branches, archive state, pinning, project movement, feedback, sharing, usage records, and deletion.

[Read about conversation state →](/platform/conversation-state/)

## Structured streaming

Live chat responses use Server-Sent Events (`text/event-stream`) with a versioned event protocol. Events carry ordered sequence numbers and typed state for turns, answers, code, activities, and tools.

[Read about streaming →](/platform/streaming/)

## Mid-turn steering

A running turn can accept supported steering input while it remains steerable. The server rejects steering after the acceptance window closes rather than silently pretending it was applied.

[Read about steering →](/platform/steering/)

## Projects and context

Projects group conversations and related context. Production routes support project settings, instructions, search, files, connector bindings, work history, and project-scoped conversations.

[Read about projects →](/projects/)

## Fail-closed API surface

The production API treats unlisted routes as session-required by default. Only an explicit narrow public allowlist is available without an account session.
