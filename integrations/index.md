---
title: Integrations
eyebrow: Build
description: WEDNESDAY connector and integration boundaries, including project connector bindings and GitHub-backed workflows.
permalink: /integrations/
markdown_url: /integrations.md
---

# Integrations

<p class="lead">Integrations connect WEDNESDAY to external systems without collapsing external authorization into the model or the browser client.</p>

## Project connector bindings

Projects expose an owner-scoped connector-binding view and an explicit unbind operation. A connector binding belongs to the authenticated project/account context; possession of a binding ID alone is not authorization.

## GitHub

The production codebase includes GitHub authorization, repository, reference-context, workspace, branch, and patch workflows. GitHub callback/webhook operations are operational integration surfaces and are not interchangeable with user-facing project APIs.

## Separation of concerns

A production integration has multiple independent boundaries:

1. the WEDNESDAY account session;
2. the external provider authorization or installation;
3. resource-level scope inside that provider;
4. approval requirements for writes or destructive actions.

## Public integration contract

This documentation publishes integration behavior that users and developers may rely on. It intentionally omits secret handling, private webhook validation details, installation credentials, internal provider tokens, and privileged operational procedures.

## Revocation

Where the product exposes an unbind or disconnect operation, clients should treat revocation as a first-class lifecycle state rather than assuming access remains valid indefinitely.
