# Agents

<p class="lead">WEDNESDAY agent behavior is built from stateful turns, typed tool activity, durable task state, and explicit user control rather than a hidden autonomous loop.</p>

## Stateful execution

A turn belongs to authenticated durable conversation state. Project context can be loaded for the conversation before execution and rendered into the system context supplied to the turn.

## Observable activity

The stream protocol has distinct activity and tool event families. Tool execution can report start, progress, state transitions, and completion rather than collapsing all tool work into opaque text.

## Steering and cancellation

Supported turns can accept mid-turn steering while the acceptance window remains open. Durable research tasks have an explicit cancellation route.

## Approval-aware behavior

The execution protocol models approval risk and reversibility as explicit concepts. Public documentation will describe concrete approval flows only when the corresponding user/developer contract is stable.

## Agent boundary

An agent may use tools and durable state, but authorization remains server-owned. Agent execution does not bypass the account session, project ownership, file ownership, connector scope, or external-write approval boundaries.
