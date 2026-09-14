# Search

<p class="lead">Search is a server-owned, account-scoped operation over durable WEDNESDAY state. It is separate from model web search.</p>

## Global search

<div class="endpoint"><div class="endpoint-head"><span class="method">GET</span><span class="endpoint-path">/search</span></div><div class="endpoint-body"><p>Search the authenticated account's durable search surface.</p></div></div>

The verified query contract uses:

| Parameter | Constraint |
| --- | --- |
| `q` | Required; 1–160 characters |
| `limit` | 1–100; default 25 |

Results are returned with `Cache-Control: no-store`.

## Project search

<div class="endpoint"><div class="endpoint-head"><span class="method">GET</span><span class="endpoint-path">/projects/{project_id}/search</span></div><div class="endpoint-body"><p>Search within an account-owned project, including a bounded filter and result limit.</p></div></div>

## Rate limits and errors

Search can return:

- `422` for an invalid query contract;
- `429` when the search protection limit is exceeded;
- `503` when search storage or protection is unavailable.

## Not the same as web search

This page documents product-state search. Model tools that discover or ground information from the public web have a separate execution and security boundary and should not be inferred from `/search`.
