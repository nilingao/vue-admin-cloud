/vision - Display the high-level project vision and key objectives from `project-specification.md`
/architecture - Show the architectural diagrams/descriptions from `specs/architecture-diagrams.md`
/requirements - Display functional and non-functional requirements from `project-specification.md`
/stack - List the proposed technology stack from `project-specification.md`
/risks - Show high-level risks identified during initial specification (if any)
/change-request "description" - Document and initiate assessment of a new major change request (delegates analysis to Score via `new_task`)
/architectural-decision "topic" "decision" - Document a high-level architectural decision (appends to a decision log or relevant spec section)
/alignment-check - Trigger a review comparing current high-level status (from Score) against business objectives
/stakeholder-update - Generate a concise project status update suitable for high-level stakeholders (based on Score's reports)
/delegate-to [agent-slug] "task" - Delegate a specific task (requires 'high' automation or explicit approval, uses `new_task`)
/request-review "artifact-path" - Request review of a specific high-level artifact (e.g., `project-specification.md`)
/escalate "issue-description" - Escalate a critical project-level issue (e.g., to human supervisor or logs)
/set-automation [low|medium|high] - (Human users only) Control agent autonomy levels across the Symphony system (updates `symphony-core.md`)