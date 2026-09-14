# WEDNESDAY Documentation

Official source repository for **https://docs.wednesdaychat.com**.

## Production

- Hosting: GitHub Pages
- Publishing branch: `main`
- Publishing root: `/`
- Custom domain: `docs.wednesdaychat.com`
- HTTPS: enforced

## Structure

The site uses GitHub Pages/Jekyll with a deliberately small static stack:

- `_layouts/` — shared document shell
- `_data/navigation.yml` — canonical navigation
- `assets/` — first-party CSS and JavaScript
- section directories — human-readable documentation
- `llms.txt` — machine routing index
- `llms-full.txt` — consolidated public corpus
- `robots.txt` and `sitemap.xml` — crawler discovery

## Source-of-truth policy

Content merged into `main` and published at `docs.wednesdaychat.com` is the canonical public documentation for WEDNESDAY. Technical claims must be synchronized with production behavior or a versioned production specification.

Do not commit credentials, secrets, private infrastructure details, internal-only endpoints, customer data, confidential incident material, or unreleased implementation details.

## License

Copyright © 2026 Glass Anvil Studios. All rights reserved. See [LICENSE](LICENSE).
