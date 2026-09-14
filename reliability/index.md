---
title: Reliability
eyebrow: Operate
description: Public reliability and operational behavior documentation for WEDNESDAY.
permalink: /reliability/
---

# Reliability

<p class="lead">Reliability documentation explains externally observable behavior: availability, retries, timeouts, idempotency, degradation, and status communication where those contracts are publicly defined.</p>

## Status information

Live operational status belongs on the independent WEDNESDAY status service rather than being hard-coded into documentation pages. Documentation should explain behavior; the status service should report current incidents and availability.

## Failure semantics

API and tool references should document actionable error behavior close to the affected contract so developers do not have to infer retry or recovery behavior.
