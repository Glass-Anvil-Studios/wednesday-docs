---
title: Getting started
eyebrow: Start
description: How to use the WEDNESDAY public documentation and understand its source-of-truth rules.
permalink: /getting-started/
---

# Getting started

<p class="lead">Use this site to understand WEDNESDAY's public platform surface without relying on stale screenshots, internal implementation details, or undocumented assumptions.</p>

## What belongs here

The public docs cover released or intentionally published behavior: platform concepts, models, API contracts, tools, integrations, security posture, reliability behavior, changelog entries, and deprecations.

## What does not belong here

Secrets, private infrastructure, internal-only endpoints, customer data, incident-response material, unreleased implementation details, and credentials are excluded from this repository.

## Documentation precedence

When public sources conflict, prefer the most specific and current production-synchronized reference. Versioned API contracts take precedence for wire behavior. Changelog and deprecation notices describe lifecycle changes. Narrative guides explain how to use those contracts.

## Where to go next

- Read [Platform concepts](/platform/) for the documentation boundaries.
- Read [API](/api/) for public contract status.
- Read [Models](/models/) for the model publication policy.
- Read [Machine-readable docs](/machine-readable/) if you are building an agent or documentation retriever.
