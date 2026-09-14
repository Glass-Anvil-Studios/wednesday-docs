# Contributing to WEDNESDAY documentation

`docs.wednesdaychat.com` is a production surface. Documentation changes must preserve public-contract accuracy, security boundaries, accessibility, and machine-readable parity.

## Required workflow

1. Create a branch from `main`.
2. Change the human-facing source and its Markdown twin together when applicable.
3. Do not publish internal endpoints, credentials, private infrastructure, roadmap-only claims, or inferred capabilities.
4. Run `python scripts/validate_docs.py` before opening a pull request.
5. Open a pull request and require `Docs CI` to pass before merge.
6. After merge, verify the GitHub Pages deployment and the canonical HTTPS URL.

## Source of truth

A public technical claim must be supported by production behavior, production source, a versioned public contract, or an explicitly approved release statement. If those sources disagree, do not guess: resolve the conflict before publishing.

## Documentation style

Write for developers. Lead with behavior and constraints. Prefer examples and tables over marketing language. State lifecycle and access boundaries explicitly. Do not expose implementation details that users do not need to rely on.
