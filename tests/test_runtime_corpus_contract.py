from __future__ import annotations

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = ROOT / "contracts" / "runtime-corpus.schema.json"


class RuntimeCorpusContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))

    def test_schema_identity_is_versioned_and_canonical(self) -> None:
        self.assertEqual(
            self.schema["properties"]["schema_version"]["const"],
            "wednesday.docs.runtime_corpus.v1",
        )
        self.assertEqual(
            self.schema["properties"]["corpus_id"]["const"],
            "wednesday-public-docs",
        )
        self.assertEqual(
            self.schema["properties"]["canonical_origin"]["const"],
            "https://docs.wednesdaychat.com",
        )

    def test_contract_is_fail_closed_at_object_boundaries(self) -> None:
        self.assertIs(self.schema["additionalProperties"], False)
        self.assertIs(self.schema["$defs"]["chunk"]["additionalProperties"], False)

    def test_required_corpus_fields_are_explicit(self) -> None:
        self.assertEqual(
            set(self.schema["required"]),
            {
                "schema_version",
                "corpus_id",
                "canonical_origin",
                "language",
                "corpus_hash",
                "chunk_count",
                "chunks",
            },
        )

    def test_required_chunk_fields_are_explicit(self) -> None:
        self.assertEqual(
            set(self.schema["$defs"]["chunk"]["required"]),
            {
                "id",
                "title",
                "section",
                "url",
                "content",
                "content_hash",
                "tags",
                "lifecycle",
                "source_path",
                "ordinal",
            },
        )

    def test_corpus_has_no_volatile_generation_timestamp(self) -> None:
        self.assertNotIn("generated_at", self.schema["properties"])
        self.assertNotIn("timestamp", self.schema["properties"])

    def test_content_and_tags_are_bounded(self) -> None:
        chunk = self.schema["$defs"]["chunk"]["properties"]
        self.assertEqual(chunk["content"]["maxLength"], 12000)
        self.assertEqual(chunk["tags"]["maxItems"], 16)

    def test_lifecycle_is_closed_enum(self) -> None:
        lifecycle = self.schema["$defs"]["chunk"]["properties"]["lifecycle"]
        self.assertEqual(lifecycle["enum"], ["stable", "preview", "deprecated"])

    def test_hashes_are_lowercase_sha256_hex(self) -> None:
        self.assertEqual(
            self.schema["properties"]["corpus_hash"]["pattern"],
            "^[a-f0-9]{64}$",
        )
        self.assertEqual(
            self.schema["$defs"]["chunk"]["properties"]["content_hash"]["pattern"],
            "^[a-f0-9]{64}$",
        )


if __name__ == "__main__":
    unittest.main()
