# Public Content Boundary

The public documentation repository contains only information intended for external consumption.

## Publish

- stable developer-facing platform behavior;
- supported workflows and capability families;
- public API origins and routes explicitly approved in the public contract allowlist;
- public authentication, error, rate-limit, lifecycle, security, privacy, and reliability behavior;
- public model profiles and stable model IDs only when formally released;
- changelog and deprecation guidance;
- machine-readable documentation mirrors.

## Do not publish

- credentials, secrets, private keys, tokens, or protected session material;
- private network topology, internal addresses, non-public hostnames, or privileged deployment instructions;
- operational runbooks whose disclosure would weaken production security;
- implementation technologies, infrastructure providers, private data-plane details, or internal repository paths that developers do not need to rely on;
- unreleased roadmap items presented as shipping capability;
- upstream provider routing or provider model identifiers presented as WEDNESDAY contracts;
- private administrator, operations, callback, debugging, metrics, or management surfaces unless explicitly approved as a public integration contract.

## Public Release Firewall

Every pull request is checked by `scripts/public_release_firewall.py` before the documentation build. The firewall scans both source publication files and the generated site.

The firewall is fail-closed:

- WEDNESDAY origins must appear in `policy/public_contract_allowlist.json`;
- explicitly declared HTTP endpoints must appear in the public contract allowlist;
- sensitive environment-variable assignments are rejected unless explicitly approved;
- secret-shaped credentials, private/reserved network addresses, internal hostnames, sensitive connection URLs, implementation details, privileged route families, deployment commands, and upstream model/provider identifiers are blocked;
- exceptions must be exact, justified, approved, and time-bounded in `policy/public_release_exceptions.json`.

When uncertain, omit the claim until its public support boundary is verified.
