## Summary

Describe the public documentation or platform contract change.

## Production source

- [ ] Claims are verified against production behavior, a production specification, or another explicitly versioned public contract.
- [ ] No secret configuration, private infrastructure, privileged procedures, provider-routing details, internal implementation technology, or roadmap-only capabilities are disclosed.
- [ ] Any new WEDNESDAY hostname or explicit HTTP endpoint is intentionally added to `policy/public_contract_allowlist.json`.
- [ ] Any firewall exception is exact, justified, approved, and time-bounded.
- [ ] HTML page and Markdown twin are synchronized where required.
- [ ] `llms.txt` / machine-readable routing is updated when the information architecture changes.

## Release checks

- [ ] Public Release Firewall unit tests pass.
- [ ] Source Public Release Firewall passes.
- [ ] Docs source validation passes.
- [ ] Jekyll production build passes.
- [ ] Generated-site validation passes with no broken internal links.
- [ ] Generated-site Public Release Firewall passes.
- [ ] Search and sitemap include the new public surface.
- [ ] Mobile and desktop navigation remain usable.
- [ ] The change has an appropriate changelog/deprecation entry when compatibility is affected.
