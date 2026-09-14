# WEDNESDAY Documentation

Official source repository for the public WEDNESDAY documentation site at **https://docs.wednesdaychat.com**.

## Purpose

This repository contains the canonical public documentation for the WEDNESDAY platform. It is intended to serve developers, users, search engines, and AI agents with accurate, versioned, machine-readable information about WEDNESDAY's public capabilities and interfaces.

The documentation published from this repository will cover areas such as:

- Getting started and core concepts
- Models and capabilities
- API usage and reference material
- Tools and agent features
- Integrations and connectors
- Security and privacy documentation
- Reliability and platform behavior
- Changelog and deprecations
- Machine-readable documentation indexes such as `llms.txt`

## Publication

The production documentation site is published with **GitHub Pages** and will use the custom domain:

```text
https://docs.wednesdaychat.com
```

The production publishing branch is:

```text
main
```

## Repository policy

This repository is for **public documentation only**.

Do not commit:

- credentials, tokens, API keys, or secrets
- private infrastructure details
- internal-only endpoints
- deployment credentials or environment files
- customer data or personally identifiable information
- confidential incident-response material
- proprietary implementation details that are not intended for public release

Internal operational documentation must remain in approved private WEDNESDAY repositories or internal knowledge systems.

## Source of truth

Content merged into `main` and published at `docs.wednesdaychat.com` is the canonical public documentation for WEDNESDAY. Product behavior and API contracts should be kept synchronized with their corresponding production implementations and specifications.

## Contributing

Documentation changes should be reviewed for technical accuracy, public-safety/security exposure, compatibility with the production platform, and consistency with the WEDNESDAY product surface before being merged into `main`.

## License

Copyright © 2026 Glass Anvil Studios. All rights reserved.

This repository and its documentation are proprietary unless a file or directory explicitly states otherwise. See [LICENSE](LICENSE) for the governing terms.
