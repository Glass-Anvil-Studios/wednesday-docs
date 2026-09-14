---
title: Files
eyebrow: Core platform
description: Secure WEDNESDAY file upload sessions, validation, progress, library access, and attachment state.
permalink: /files/
markdown_url: /files.md
---

# Files

<p class="lead">File intake uses an explicit upload-session lifecycle so WEDNESDAY can validate ownership, metadata, transport, content, and storage state before a file becomes usable.</p>

## Upload lifecycle

The production upload flow exposes three core operations:

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/files/uploads` | Initiate an owner-scoped upload session |
| `GET` | `/files/uploads/{upload_id}` | Read upload progress and state |
| `PUT` | `/files/uploads/{upload_id}/content` | Stream the complete file body |

Upload initiation uses an `Idempotency-Key` header so safe retries can refer to the same initiation intent.

## Transport rules

The content upload is intentionally strict:

- compressed request bodies are not accepted;
- partial `Content-Range` resume is not supported;
- a retry sends the upload body again from byte zero;
- the body media type must match the initiated session or use `application/octet-stream`;
- declared and observed size are validated against the session.

## Validation and failure states

The file pipeline distinguishes malformed requests, unsupported media, invalid content, oversized files, expired sessions, missing sources, conflicts, rate limits, and temporary service failures.

Relevant HTTP outcomes include `400`, `404`, `409`, `410`, `413`, `415`, `429`, and `503`.

## Library and attachments

The production file router also supports owner-scoped Library views, file picker results, attachment-state lookup, user-message attachment preparation, and secure file inspection/download paths.

<div class="notice"><strong>Security boundary:</strong> file IDs do not grant authority. File operations are evaluated inside the authenticated account session.</div>
