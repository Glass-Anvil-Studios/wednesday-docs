---
title: Projects
eyebrow: Core platform
description: Organize WEDNESDAY conversations, instructions, settings, files, connectors, search, and work history into account-owned projects.
permalink: /projects/
markdown_url: /projects.md
---

# Projects

<p class="lead">Projects group durable conversations and project-scoped context under the authenticated WEDNESDAY account.</p>

## Project lifecycle

The production API supports listing, reading, creating, renaming, archiving, deleting, and restoring projects.

| Method | Route |
| --- | --- |
| `GET` | `/projects` |
| `POST` | `/projects` |
| `GET` | `/projects/{project_id}` |
| `PUT` | `/projects/{project_id}/name` |
| `PUT` | `/projects/{project_id}/archive` |
| `DELETE` | `/projects/{project_id}` |
| `POST` | `/projects/{project_id}/restore` |

## Project context

A project can expose account-owned settings and instructions through dedicated read/write routes. Chat execution can load project context for a conversation and render that context into the turn's system context.

## Search and resources

Projects have production routes for:

- project-scoped search;
- instructions and settings;
- connector bindings;
- work history;
- file membership;
- project-owned conversation listing and creation.

## Ownership boundary

Every project operation in this guide is session-protected. The project ID selects a resource **within** the authenticated account; it does not select the account itself.

## Conflicts and deletion

Mutating operations may return `409 Conflict` when state has changed or an explicit confirmation requirement is not satisfied. Clients should not collapse those outcomes into a generic retry loop.
