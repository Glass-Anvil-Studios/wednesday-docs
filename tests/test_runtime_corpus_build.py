from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

import build_runtime_corpus as corpus_builder  # noqa: E402


class RuntimeCorpusBuildTests(unittest.TestCase):
    def test_build_is_deterministic(self) -> None:
        first = corpus_builder.render_runtime_corpus(corpus_builder.build_runtime_corpus())
        second = corpus_builder.render_runtime_corpus(corpus_builder.build_runtime_corpus())
        self.assertEqual(first, second)

    def test_corpus_identity_and_hash_shape(self) -> None:
        corpus = corpus_builder.build_runtime_corpus()
        self.assertEqual(corpus["schema_version"], "wednesday.docs.runtime_corpus.v1")
        self.assertEqual(corpus["corpus_id"], "wednesday-public-docs")
        self.assertEqual(corpus["canonical_origin"], "https://docs.wednesdaychat.com")
        self.assertEqual(corpus["language"], "en")
        self.assertRegex(str(corpus["corpus_hash"]), r"^[a-f0-9]{64}$")
        self.assertEqual(corpus["chunk_count"], len(corpus["chunks"]))

    def test_chunks_are_unique_bounded_and_public(self) -> None:
        corpus = corpus_builder.build_runtime_corpus()
        chunks = list(corpus["chunks"])
        identifiers = [str(chunk["id"]) for chunk in chunks]
        self.assertEqual(len(identifiers), len(set(identifiers)))
        self.assertGreater(len(chunks), 10)

        for chunk in chunks:
            self.assertLessEqual(len(str(chunk["content"])), 12_000)
            self.assertRegex(str(chunk["content_hash"]), r"^[a-f0-9]{64}$")
            self.assertTrue(str(chunk["url"]).startswith("https://docs.wednesdaychat.com/"))
            self.assertIn(chunk["lifecycle"], {"stable", "preview", "deprecated"})
            self.assertLessEqual(len(list(chunk["tags"])), 16)
            self.assertTrue(str(chunk["source_path"]).endswith("index.md"))

    def test_generator_uses_human_page_sources_not_markdown_twins(self) -> None:
        corpus = corpus_builder.build_runtime_corpus()
        source_paths = {str(chunk["source_path"]) for chunk in corpus["chunks"]}
        self.assertIn("index.md", source_paths)
        self.assertIn("api/index.md", source_paths)
        self.assertNotIn("api.md", source_paths)
        self.assertNotIn("agents.md", source_paths)

    def test_render_round_trips_as_json(self) -> None:
        rendered = corpus_builder.render_runtime_corpus(corpus_builder.build_runtime_corpus())
        payload = json.loads(rendered)
        self.assertEqual(payload["chunk_count"], len(payload["chunks"]))

    def test_write_mode_is_byte_stable(self) -> None:
        rendered = corpus_builder.render_runtime_corpus(corpus_builder.build_runtime_corpus())
        with tempfile.TemporaryDirectory() as temporary:
            output = Path(temporary) / "runtime-corpus.json"
            output.write_text(rendered, encoding="utf-8")
            self.assertEqual(output.read_text(encoding="utf-8"), rendered)


if __name__ == "__main__":
    unittest.main()
