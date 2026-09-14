from __future__ import annotations

import unittest

from scripts import public_release_firewall as firewall


POLICY = {
    "schema_version": 1,
    "blocked_route_prefixes": [
        "/admin", "/internal", "/ops", "/debug", "/metrics", "/private", "/provider", "/backoffice", "/management"
    ],
}

ALLOWLIST = {
    "schema_version": 1,
    "approved_wednesday_origins": [
        "https://wednesdaychat.com",
        "https://www.wednesdaychat.com",
        "https://docs.wednesdaychat.com",
        "https://api.wednesdaychat.com",
        "https://status.wednesdaychat.com",
    ],
    "approved_environment_variables": [],
    "approved_http_endpoints": [
        {"method": "GET", "path": "/search"},
        {"method": "POST", "path": "/chat"},
        {"method": "POST", "path": "/chat/{turn_id}/input"},
    ],
}


def rules(text: str) -> set[str]:
    return {finding.rule for finding in firewall.scan_text("fixture.md", text, POLICY, ALLOWLIST)}


class PublicReleaseFirewallTests(unittest.TestCase):
    def test_allows_approved_public_contract(self) -> None:
        text = """
        See https://docs.wednesdaychat.com and https://api.wednesdaychat.com.
        POST /chat
        """
        self.assertEqual(rules(text), set())

    def test_allows_endpoint_in_public_contract_allowlist(self) -> None:
        self.assertNotIn("unapproved-endpoint", rules("GET /search?q=example"))
        self.assertNotIn("unapproved-endpoint", rules("POST /chat/{turn_id}/input"))

    def test_blocks_secret_shaped_credentials(self) -> None:
        self.assertIn("github-token", rules("ghp_" + "A" * 30))
        self.assertIn("jwt", rules("eyJ" + "A" * 16 + "." + "B" * 16 + "." + "C" * 16))

    def test_blocks_private_network_details(self) -> None:
        self.assertIn("private-ip", rules("connect to 10.20.30.40"))
        self.assertIn("internal-host", rules("https://service.internal/v1"))

    def test_blocks_unapproved_wednesday_subdomain(self) -> None:
        self.assertIn("unapproved-wednesday-origin", rules("https://admin.wednesdaychat.com/"))

    def test_blocks_connection_urls_and_sensitive_environment_assignments(self) -> None:
        findings = rules("WEDNESDAY_DATABASE_URL=postgresql://user:pass@db.example/x")
        self.assertIn("database-url", findings)
        self.assertIn("environment-variable", findings)

    def test_blocks_implementation_technology_names(self) -> None:
        self.assertIn("implementation-technology", rules("The service runs on Kubernetes."))
        self.assertIn("implementation-technology", rules("The cache uses Redis."))

    def test_blocks_upstream_provider_and_model_identifiers(self) -> None:
        findings = rules("Route this request to OpenAI gpt-5-example.")
        self.assertIn("provider-brand", findings)
        self.assertIn("provider-model-id", findings)

    def test_blocks_private_route_families(self) -> None:
        findings = rules("GET /admin/users")
        self.assertIn("private-route", findings)
        self.assertIn("unapproved-endpoint", findings)

    def test_blocks_endpoint_not_in_public_contract_allowlist(self) -> None:
        self.assertIn("unapproved-endpoint", rules("GET /users"))


if __name__ == "__main__":
    unittest.main()
