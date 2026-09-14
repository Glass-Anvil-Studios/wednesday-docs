# SKR runtime corpus contract

SKR-01 defines the public, machine-readable contract that may be retrieved into WEDNESDAY model context. This contract is informational only: it cannot grant runtime capability, account entitlement, permission, approval, or model-tool authority.

## Authority boundary

The runtime corpus is a projection of already-approved public documentation. Runtime/server authority remains higher priority than retrieved documentation. If retrieved documentation conflicts with current runtime authority, runtime authority wins.

## Contract

The published schema is `contracts/runtime-corpus.schema.json` and has schema version `wednesday.docs.runtime_corpus.v1`.

A corpus contains:

- a fixed corpus identity and canonical origin;
- a language identifier;
- a SHA-256 corpus hash;
- an exact chunk count; and
- an ordered list of documentation chunks.

Every chunk contains:

- a deterministic chunk ID;
- page title and section heading;
- canonical `docs.wednesdaychat.com` URL;
- bounded public text content;
- a SHA-256 content hash;
- normalized retrieval tags;
- lifecycle state (`stable`, `preview`, or `deprecated`);
- public documentation source path; and
- deterministic ordinal within that source.

Unknown fields are rejected at both corpus and chunk level.

## Determinism

The corpus intentionally has no wall-clock generation timestamp. Rebuilding unchanged documentation with the same generator contract must produce byte-for-byte equivalent semantic content and the same corpus hash.

SKR-02 owns the deterministic chunking and canonical hashing algorithm. The contract requires those outputs but does not prescribe an implementation language.

## Hash semantics

`content_hash` is the lowercase SHA-256 hexadecimal digest of the normalized chunk content encoded as UTF-8.

`corpus_hash` is the lowercase SHA-256 hexadecimal digest of the canonical ordered chunk payload. The exact canonical serialization is fixed by SKR-02 and must exclude the `corpus_hash` field itself.

## Publication boundary

Only material already approved for public documentation may enter this corpus. The Public Release Firewall must scan the generated corpus before publication. A corpus failure must block publication rather than silently dropping or rewriting a finding.

## Non-goals

This contract does not change product rollout, account state, runtime capability state, tool availability, approval state, or any main-roadmap release policy. SKR consumes public documentation as product knowledge only.
