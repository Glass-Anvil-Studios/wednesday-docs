---
title: Changelog
eyebrow: Reference
description: Public documentation and platform lifecycle changes for WEDNESDAY.
permalink: /changelog/
---

# Changelog

## September 14, 2026

### Public release firewall

- Added a fail-closed publication firewall to the required documentation CI check.
- Added an allowlisted public-contract boundary for WEDNESDAY origins and explicit HTTP endpoint declarations.
- Added source and generated-site leakage scanning plus regression tests.
- Excluded repository governance, policy, tests, and security-maintenance files from the GitHub Pages artifact.
- Tightened the API reference so operational service metadata and probes are not part of the published developer contract.

### Documentation infrastructure

- Established `docs.wednesdaychat.com` on GitHub Pages.
- Configured the custom domain and enforced HTTPS.
- Established `main` as the production documentation branch.
- Added the initial public documentation architecture and machine-readable discovery files.

Platform feature changes will be listed here only when verified against the relevant production contract.
