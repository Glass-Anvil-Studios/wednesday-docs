---
title: Streaming
eyebrow: Core platform
description: WEDNESDAY's versioned Server-Sent Events protocol for turns, answers, code, activities, and tool execution.
permalink: /platform/streaming/
markdown_url: /platform/streaming.md
---

# Streaming

<p class="lead">Live chat uses Server-Sent Events with a versioned, ordered event protocol rather than an unstructured text socket.</p>

## Transport

`POST /chat` returns:

```text
Content-Type: text/event-stream
Cache-Control: no-cache, no-transform
X-Accel-Buffering: no
```

The route requires an authenticated account session and is protected by the chat rate limiter.

## Protocol version

Current stream events carry `protocol_version: 1`, a turn identifier, and a monotonically ordered sequence field. Part-level events add a part identifier; tool events add a tool identifier.

Clients should treat the protocol version as part of the compatibility contract rather than assuming event payloads can change without coordination.

## Event families

The current stream model includes typed events for:

- turn start and routing;
- activity progress;
- answer start, delta, and completion;
- code start, delta, and completion;
- tool start, progress, state transitions, and completion;
- additional bounded platform events as documented by their public contract.

## Backpressure and intermediaries

The API disables response buffering and transformation for the stream. Clients should consume events incrementally and should not depend on intermediaries coalescing chunks.

## Durable state is separate

Streaming transports live execution. Conversation persistence is a separate durable boundary. A robust client should not assume that the presence or absence of one network chunk is itself the durable conversation record.
