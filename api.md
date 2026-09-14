# API

<p class="lead">WEDNESDAY exposes a production HTTP service at <code>https://api.wednesdaychat.com</code>. This documentation publishes the supported external contract without treating every internal service route as public API.</p>

## Production origin

```text
https://api.wednesdaychat.com
```

The web product and supported WEDNESDAY clients use this origin for durable product operations. The API is designed around account-authorized state, streaming execution, projects, files, search, research, sharing, and related platform workflows.

## Access model

Most product operations require a valid WEDNESDAY account session and derive durable ownership from server-authorized account state. Do not fabricate owner identifiers or infer a general third-party API-key program from browser/client transport details.

Start with [Authentication](/api/authentication/) before integrating a protected route.

## Reference

Use the [API reference](/api/reference/) for the deliberately published HTTP surface. The reference currently includes verified system, search, project, conversation, chat, file, and artifact capability boundaries while withholding privileged, provider-callback, administrative, and implementation-only routes.

## Errors and protection

- [Errors](/api/errors/) documents stable HTTP failure classes and retry guidance.
- [Rate limits](/api/rate-limits/) documents `429`, `Retry-After`, fail-closed protection, and quota publication policy.
- [Production best practices](/production/) covers durable-state reconciliation, streaming, readiness, security, and release discipline.

## Contract policy

Public documentation is a compatibility promise. An endpoint, header, provider model, internal module, or telemetry label found in source code is **not** automatically public API. WEDNESDAY publishes only the behavior it intends developers to depend on.

<div class="notice"><strong>Machine-readable docs:</strong> use <a href="/llms.txt"><code>/llms.txt</code></a> for routing, <a href="/llms-full.txt"><code>/llms-full.txt</code></a> for the consolidated corpus, and Markdown twins linked from individual reference pages.</div>
