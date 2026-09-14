# Tools

<p class="lead">Tools are explicit execution capabilities with typed lifecycle state. They are not invisible model side effects.</p>

## Tool lifecycle

The live stream protocol supports tool events for:

- start;
- progress;
- state transition;
- completion.

Tool events carry stable turn/part/tool hierarchy identifiers so a client can render nested or parallel work without guessing from text.

## Execution state

Tool state transitions are validated by the runtime. A tool start cannot begin in an already-settled execution state, and hierarchy metadata is checked for invalid self-parenting and incomplete parallel-group metadata.

## Security model

Tool availability does not imply unlimited authority. File tools remain owner-scoped, connector tools remain connector-scoped, public web acquisition is bounded by its own egress policy, and risky external actions can require explicit approval.

## Public capability policy

A tool is documented as a supported public capability only when its name, inputs, outputs, authority requirements, failure behavior, and lifecycle are stable enough to depend on.

<div class="notice">Do not infer a supported developer tool merely because an internal tool kind appears in telemetry, source code, or a private runtime event.</div>
