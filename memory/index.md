---
title: Memory
eyebrow: Core platform
description: Understand Saved Memory, Chat History Reference, Project Memory, source consent, and Temporary Chat boundaries in WEDNESDAY.
permalink: /memory/
markdown_url: /memory.md
---

# Memory

<p class="lead">Memory gives WEDNESDAY controlled continuity across conversations while keeping account, Project, source-consent, and Temporary Chat boundaries explicit.</p>

## Memory at a glance

WEDNESDAY has separate continuity layers rather than one global memory switch:

- **Saved Memory** stores durable account-scoped facts and preferences that can be used in later standard conversations.
- **Chat History Reference** can use relevant prior non-Project conversations without converting those conversations into Saved Memory.
- **Project Memory** stays within its Project and is governed by that Project's Memory setting.

Saved Memory and Chat History Reference are independent. Turning one off does not automatically turn the other off.

## Saved Memory

Saved Memory is durable account-scoped continuity. When effective Saved Memory is enabled, WEDNESDAY can use eligible Saved Memory in later standard conversations and can create or update eligible account Memory.

When Saved Memory is off:

- WEDNESDAY does not read ordinary account Saved Memory into a new standard turn;
- new ordinary account Saved Memory is not written;
- existing Saved Memory is retained rather than deleted automatically; and
- existing Memory can still be reviewed or deleted.

Turning Saved Memory off is therefore a usage control, not a delete operation.

## Chat History Reference

Chat History Reference is a separate continuity layer for relevant prior non-Project conversations.

When it is off, WEDNESDAY does not scan or use those prior conversations as cross-chat context. Existing conversations are not deleted, and they are not converted into Saved Memory.

The current conversation remains available normally. Saved Memory remains independently controlled by its own effective setting.

## Project Memory

Project Memory is scoped to the Project that owns it. A Project can maintain its own continuity under its Project Memory setting without turning that information into account-wide Saved Memory.

Inside a Project, Project-local context remains the authority for Project continuity. Account Saved Memory and ordinary prior-chat reference are kept separate from that Project scope.

## Memory controls and availability

**Settings > Personalization > Memory** exposes separate controls for Saved Memory and Chat History Reference.

A user's preference and the service's availability decision are separate. A feature can therefore be turned on by the user but still be unavailable because of the account's plan or an applicable policy. The effective state is the combination of both.

If a Memory control is unavailable, the product can explain that it is unavailable on the current plan or disabled by policy without exposing internal entitlement identifiers.

## Managing existing Memory

Existing account Memory remains manageable even when Saved Memory is off. Users can review and delete existing Memory, and destructive clear-all behavior remains available.

Editing existing account Memory is unavailable while effective Saved Memory is off because an edit is a new durable write. Project Memory editing remains governed by the Project's own scope and Memory setting.

## Files and connected-source consent

Information from files or connected sources does not become reusable Memory merely because the source exists. Reusable Memory from those sources is governed by explicit source-consent and ownership boundaries.

If consent for a source is revoked, Memory supported only by that source is no longer retained as reusable source-backed Memory. A Memory can remain when it is still independently supported by another consented source.

## Temporary Chat

Temporary Chat is a no-continuity boundary for ordinary account Memory:

- ordinary account Saved Memory is not read;
- prior non-Project Chat History Reference is not read;
- ordinary account Memory is not written from the Temporary Chat; and
- the current Temporary Chat transcript still works as current-conversation context.

A Temporary Chat cannot be attached to a Project. Files uploaded from it remain temporary unless the user explicitly saves them to Library.

Leaving Temporary Chat means starting a new standard conversation; an existing Temporary Chat is not retroactively converted into an ordinary continuity source.

## Privacy and ownership boundary

Memory is account-owned and server-authorized. Conversation, Project, file, and connected-source boundaries are evaluated before information can participate in Memory or retrieval.

Documentation describes these product semantics, but documentation itself never grants Memory access, changes an account setting, overrides policy, or authorizes access to another account's data.
