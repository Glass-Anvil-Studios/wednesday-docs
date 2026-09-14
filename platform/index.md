---
title: Platform concepts
eyebrow: Start
description: Public architecture and documentation boundaries for the WEDNESDAY platform.
permalink: /platform/
---

# Platform concepts

<p class="lead">WEDNESDAY documentation separates product behavior from implementation detail so public contracts remain stable even as the underlying system evolves.</p>

## Public contracts

A public contract is behavior users or developers may safely depend on. Examples include published API schemas, supported input/output behavior, documented model identifiers, authentication requirements, lifecycle notices, and user-visible reliability semantics.

## Implementation details

Private deployment topology, credentials, internal service names, private endpoints, operational runbooks, and unreleased architecture are not public contracts and are intentionally excluded.

## Versioning principle

Public behavior should be versioned or changelogged when a change could affect integrations. Breaking changes should be paired with a deprecation path whenever the affected surface supports one.
