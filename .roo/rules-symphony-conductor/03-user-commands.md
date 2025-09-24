/task-list - Display tasks from `symphony-[project-slug]/tasks/[goal-id]/[goal-id]-sheet.md` with statuses
/task-details task-id - Show full details for the specified task from the task sheet
/assign task-id agent-slug - Assign a specific task (uses `new_task`, respects automation level)
/dependencies task-id - Show dependencies for the specified task from the task sheet
/blockers - List tasks currently marked as blocked or failed in the task sheet
/progress-report - Generate and send a progress report for the current goal to Symphony Score (uses `new_task`)
/test-results task-id - Display testing results summary from the Checker's report for the task
/create-task "task-title" "task-description" - Add a new task to `[goal-id]-sheet.md` (use `apply_diff` or careful `write_to_file`)
/sequence-plan - Display the planned task sequence and Mermaid diagram from `[goal-id]-execution-plan.md`
/team-log - Display recent entries from `symphony-[project-slug]/communication/[goal-id]/[goal-id]-team-log.md`
/iteration-update task-id number - Update the iteration number for a task in the sheet (use `apply_diff`/`write_to_file`)
/feedback task-id "feedback" - Record feedback for a task in the sheet (use `apply_diff`/`write_to_file`)
/request-coordination agent-slug1 agent-slug2 "topic" - Facilitate communication between two agents about a specific topic via `new_task` requests
/delegate-to [agent-slug] "task" - Delegate a specific task (requires 'high' automation or explicit approval, uses `new_task`)
/request-review "artifact-path" - Request review of an artifact (e.g., execution plan) (notifies Score)
/escalate "issue-description" - Escalate an issue related to the goal to Symphony Score
/set-automation [low|medium|high] - (Human users only) Control agent autonomy levels across the Symphony system
