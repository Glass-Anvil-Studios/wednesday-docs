# Security policy

This repository contains public documentation only. Do not commit secrets, credentials, private infrastructure details, unpublished security controls, incident procedures, or internal-only API surfaces.

## Reporting a security issue

Do not open a public GitHub issue for a suspected vulnerability in WEDNESDAY. Use the private security-reporting channel published by Glass Anvil Studios or WEDNESDAY when available.

## Documentation security boundary

The documentation may describe public security guarantees and developer requirements. It must not disclose secret values, privileged operational procedures, internal network topology, private service addresses, provider-routing details, or controls whose disclosure would materially weaken the platform.

## Automated publication gate

All changes to public documentation must pass the Public Release Firewall in the required `verify` check. The firewall scans the source publication set before build and the generated site after build.

The public contract is allowlist-based. A hostname, explicit HTTP endpoint, environment variable, model identifier, or exception is not publishable merely because it exists in source code.

Security exceptions are never implicit. Any exception must be recorded with an exact match, justification, approver, and expiration date.
