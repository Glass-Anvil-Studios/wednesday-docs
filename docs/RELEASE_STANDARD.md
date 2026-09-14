# WEDNESDAY Documentation Release Standard

`docs.wednesdaychat.com` is a production surface. Documentation changes are released with the same evidence-oriented discipline used for WEDNESDAY operational systems.

## Required gates

1. Public technical claims are traceable to production behavior, a production specification, or another explicitly versioned public contract.
2. Public docs do not disclose secrets, privileged operational procedures, private infrastructure topology, or roadmap-only functionality.
3. Human pages and required Markdown twins remain synchronized.
4. `llms.txt`, `llms-full.txt`, search, crawler, and sitemap surfaces remain valid.
5. CI builds the production Jekyll output and validates generated internal links and metadata.
6. Compatibility-affecting changes are reflected in the changelog or deprecation record.
7. Production is promoted from a reviewed commit only after required checks pass.

## Source precedence

For developer-facing behavior, precedence is:

1. explicitly versioned public contract;
2. verified current production behavior;
3. production deployment specification;
4. internal design/roadmap material for context only.

Roadmaps and private implementation details are never sufficient by themselves to create a public compatibility promise.
