# Public Release Firewall

The Public Release Firewall is the publication security boundary for `docs.wednesdaychat.com`.

## Objective

Prevent a public documentation change from disclosing information that is not part of the approved external WEDNESDAY contract.

The gate is deliberately independent of whether a detail is present in a production repository. Presence in source code is not permission to publish.

## Enforcement model

The required `verify` check runs the firewall twice:

1. **Source scan** before the site is built.
2. **Generated-site scan** after the production Jekyll build.

A violation fails the pull request.

## What is blocked

The scanner rejects categories including:

- credential- and secret-shaped values;
- private or reserved network addresses;
- internal/local hostnames;
- non-allowlisted WEDNESDAY subdomains;
- sensitive connection strings and environment-variable assignments;
- infrastructure/runtime/data-store implementation names;
- upstream AI provider and model identifiers;
- privileged route families;
- privileged deployment commands and private configuration paths;
- explicitly declared HTTP endpoints that are absent from the public contract allowlist.

The technology/provider term sets are intentionally broad. Their presence in the scanner does not indicate that WEDNESDAY uses any listed technology.

## Public contract allowlist

`policy/public_contract_allowlist.json` is the positive publication boundary for:

- WEDNESDAY origins;
- intentionally public environment variables;
- explicit HTTP endpoint declarations.

A production route is not public merely because it exists.

## Exceptions

`policy/public_release_exceptions.json` is empty by default.

An exception must include:

- a unique ID;
- exact repository path;
- exact firewall rule;
- exact matched text;
- justification;
- named approver;
- expiration date.

Expired exceptions stop working automatically.

## Governance files are not deployed

Repository governance, firewall policy, tests, and scripts are excluded from the GitHub Pages build. The generated-site firewall verifies the deployable artifact separately.
