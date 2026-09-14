from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts import validate_public_contract as contract


POLICY = {"schema_version": 1}


def allowlist(*entries: tuple[str, str]) -> dict:
    return {
        "schema_version": 1,
        "approved_wednesday_origins": ["https://api.wednesdaychat.com"],
        "approved_environment_variables": [],
        "approved_http_endpoints": [
            {"method": method, "path": path} for method, path in entries
        ],
    }


class PublicContractValidationTests(unittest.TestCase):
    def test_extracts_html_endpoint_card(self) -> None:
        text = '<span class="method">GET</span><span class="endpoint-path">/search?q=example</span>'
        self.assertIn(("GET", "/search", 1), contract.extract_endpoints(text))

    def test_extracts_inline_markdown_endpoint(self) -> None:
        self.assertIn(("POST", "/chat", 1), contract.extract_endpoints("Call `POST /chat` to begin."))

    def test_extracts_markdown_route_table(self) -> None:
        text = "| Method | Route | Purpose |\n| --- | --- | --- |\n| `GET` | `/projects/{project_id}` | Read project |\n"
        self.assertIn(("GET", "/projects/{project_id}", 3), contract.extract_endpoints(text))

    def test_blocks_unallowlisted_documented_endpoint(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            page = root / "page.md"
            page.write_text("GET /private-example\n", encoding="utf-8")
            with mock.patch.object(contract.firewall, "load_configuration", return_value=(POLICY, allowlist(), {})), mock.patch.object(
                contract.firewall, "collect_source_files", return_value=[page]
            ):
                errors, declared = contract.validate_contract(root)
        self.assertIn(("GET", "/private-example"), declared)
        self.assertTrue(any("endpoint is not allowlisted" in error for error in errors))

    def test_blocks_stale_allowlist_entry(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            page = root / "page.md"
            page.write_text("GET /search\n", encoding="utf-8")
            approved = allowlist(("GET", "/search"), ("POST", "/unused"))
            with mock.patch.object(contract.firewall, "load_configuration", return_value=(POLICY, approved, {})), mock.patch.object(
                contract.firewall, "collect_source_files", return_value=[page]
            ):
                errors, _declared = contract.validate_contract(root)
        self.assertTrue(any("approved endpoint is not documented: POST /unused" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
