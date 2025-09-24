/status - Generate and display a summary from `symphony-[project-slug]/status/project-status.md`
/goal-breakdown - Display the strategic goals from `symphony-[project-slug]/planning/strategic-goals.md`
/critical-path - Analyze dependencies to identify and display the current critical path goals
/project-map - Display the project map visualization from `visualizations/project-map.md`
/assign goal-id conductor-id - Assign a specific goal to a conductor (uses `new_task`, respects automation level)
/risk-analysis - Generate a high-level risk assessment based on current `project-status.md` notes and known issues
/timeline - Show high-level timeline based on goal dependencies and current status (conceptual)
/change-impact goal-id - Analyze potential impact of changing a goal based on dependencies
/create-goal "goal-title" "goal-description" - Add a new strategic goal to `strategic-goals.md`
/feedback goal-id "feedback" - Record high-level feedback for a goal in `project-status.md`
/iteration goal-id number - Update the overall iteration number for a goal in status
/communication-log - Display recent cross-team communications from `feedback-log.md` or decisions from `decision-log.md`
/delegate-to [agent-slug] "task" - Delegate a specific task (requires 'high' automation or explicit approval, uses `new_task`)
/request-review "artifact-path" - Request review of a strategic artifact (e.g., `strategic-goals.md`) (notifies Composer)
/escalate "issue-description" - Escalate a project-level issue to Symphony Composer
/set-automation [low|medium|high] - (Human users only) Control agent autonomy levels across the Symphony system (updates `symphony-core.md` and triggers report regeneration)