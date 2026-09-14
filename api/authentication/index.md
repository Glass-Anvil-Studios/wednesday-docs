---
title: Authentication
eyebrow: API
description: How WEDNESDAY authorizes production API requests and scopes account-owned data.
permalink: /api/authentication/
markdown_url: /api/authentication.md
---

# Authentication

<p class="lead">WEDNESDAY production requests are authorized through the account session boundary used by the WEDNESDAY product. Durable ownership is derived server-side from that authorized session.</p>

## Account authority

For protected operations, the API resolves the account owner from the authorized server session rather than trusting a caller-supplied owner identifier. This keeps projects, conversations, files, search results, and durable chat state scoped to the authenticated account.

## Browser requests

The production web application communicates with <code>https://api.wednesdaychat.com</code> using the WEDNESDAY session boundary. Cross-origin access is restricted to approved WEDNESDAY origins and explicitly allowed methods and headers.

## Request headers

Some production flows use WEDNESDAY-specific headers for session continuity, CSRF protection, client identity, idempotency, or turn coordination. A header appearing in the service implementation does not by itself make it a public third-party authentication mechanism.

## Third-party developer access

<div class="notice"><strong>No implied API-key program.</strong> WEDNESDAY does not document a general public API-key authentication contract until that contract is explicitly released. Do not attempt to synthesize account/session headers or rely on internal browser-session behavior from an external integration.</div>

## Authorization failures

Callers should treat authorization and session failures as terminal for the current credential context and re-establish a valid WEDNESDAY session through the supported product flow rather than retrying with fabricated identity data.
