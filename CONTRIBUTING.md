# Contributing to WEDNESDAY documentation

`docs.wednesdaychat.com` is a production surface. Documentation changes must preserve public-contract accuracy, security boundaries, accessibility, and machine-readable parity.

## Required workflow

1. Create a branch from `main`.
2. Change the human-facing source and its Markdown twin together when applicable.
3. Do not publish internal endpoints, credentials, private infrastructure, implementation technologies, upstream routing, provider model IDs, roadmap-only claims, or inferred capabilities.
4. If a new WEDNESDAY origin or explicit HTTP endpoint is intentionally public, add it to `policy/public_contract_allowlist.json` in the same pull request.
5. Run `python -m unittest discover -s tests -p "test_*.py"`.
6. Run `python scripts/public_release_firewall.py`.
7. Run `python scripts/validate_docs.py`.
8. Open a pull request and require the `verify` status check to pass before merge.
9. After merge, verify the GitHub Pages deployment and the canonical HTTPS URL.

## Source of truth

A public technical claim must be supported by production behavior, a production specification, a versioned public contract, or an explicitly approved release statement. If those sources disagree, do not guess: resolve the conflict before publishing.

## Allowlist and exceptions

Public contracts are allowlisted, not inferred. `policy/public_contract_allowlist.json` defines approved WEDNESDAY origins, approved public environment variables, and explicit HTTP endpoint declarations.

Firewall exceptions belong in `policy/public_release_exceptions.json`. Exceptions must be exact, justified, named, approved, and time-bounded. Broad or permanent exceptions are not acceptable.

## Documentation style

Write for developers. Lead with behavior and constraints. Prefer examples and tables over marketing language. State lifecycle and access boundaries explicitly. Do not expose implementation details that users do not need to rely on.
