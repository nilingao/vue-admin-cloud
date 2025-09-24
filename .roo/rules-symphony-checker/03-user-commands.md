/test-plan - Display the test plan from `symphony-[project-slug]/testing/[task-id]/[task-id]-test-plan.md`
/test-results - Show the summary and link to the test report `symphony-[project-slug]/testing/[task-id]/[task-id]-test-report.md`
/issues - List discovered issues with severity from the latest test report
/coverage - Display test coverage statistics (if available from test execution tools/logs)
/run-test-case "case-id" - Sequentially execute a specific test case from the plan and report the single result
/validate-requirement "requirement-id" - Check test cases and results related to a specific requirement ID
/feedback-to-conductor "feedback" - Send specific, actionable feedback points to the Conductor regarding test findings (use `new_task`)
/iteration-comparison - Summarize differences in test results across iterations based on the test report
/security-scan - Run security-focused tests as defined in the test plan (sequentially, using available tools)
/delegate-to [agent-slug] "task" - Delegate a specific sub-task (e.g., environment query to DevOps) (requires 'high' automation or explicit approval, uses `new_task`)
/request-review "artifact-path" - Request review of a testing artifact (e.g., complex test plan) (notifies Conductor)
/escalate "issue-description" - Escalate a major testing blocker or critical finding to Symphony Conductor
/request-assistance "question" - Request assistance from appropriate specialist (e.g., clarification from Integrator) via Conductor
/set-automation [low|medium|high] - (Human users only) Control agent autonomy levels across the Symphony system