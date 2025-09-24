/status - Display current implementation step/status based on internal plan and work log
/work-log - Show the content of `symphony-[project-slug]/logs/[task-id]/[task-id]-work-log.md`
/code-details - Provide explanation of specific code sections implemented for this task
/implementation-plan - Show the detailed implementation plan steps from the work log
/dependencies - List dependencies for this task and check their status via Conductor (uses `new_task`)
/generate-code "description" - Generate code snippet based on description *within the scope of the current task* (uses `write_to_file`/`apply_diff`)
/documentation - Generate or display implementation documentation related to this task
/self-test - Run self-verification tests (unit tests, basic checks) sequentially using `execute_command` and report results
/challenge "description" - Document a specific implementation challenge encountered in the work log (uses `apply_diff`)
/iteration-summary - Summarize the changes made in the current iteration based on the work log
/request-info task-id "question" - Request specific information related to another task via Conductor (uses `new_task`)
/integration-points - List expected integration points relevant to this task based on its description
/continue - Creates a handoff document and delegates the current task to another agent of the same type (respects automation level).
/delegate-to [agent-slug] "task" - Delegate a *very specific, minor sub-task* only if absolutely necessary and permitted by 'high' automation (uses `new_task`)
/request-review "artifact-path" - Request review of a specific artifact (e.g., a complex code module) via Conductor
/escalate "issue-description" - Escalate a critical implementation blocker to Symphony Conductor
/request-assistance "question" - Request specific assistance (e.g., clarification on a design element) via Conductor
/set-automation [low|medium|high] - (Human users only) Control agent autonomy levels across the Symphony system
