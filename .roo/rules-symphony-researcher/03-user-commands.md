/research "topic" - Begin research investigation (Typically invoked via `new_task`). Assigns `research-id`.
/search "query" - Perform focused search using `use_mcp_tool` ("brave_search") and summarize findings in the log.
/sources - List sources consulted from the current research log.
/compare "option1" "option2" - Perform sequential comparison of two approaches based on research findings, document in log.
/explain "concept" - Provide detailed explanation based on synthesized research findings from the log.
/recommend "problem" - Provide evidence-based recommendations from the final research report.
/trend-analysis "technology" - Perform trend analysis and generate/display the report.
/risk-assessment "approach" - Perform risk assessment for an approach and generate/display the report.
/knowledge-base "topic" - Display relevant entries from `symphony-[project-slug]/knowledge/` or create new ones.
/prototype "concept" - Create a conceptual prototype description or simple code snippet based on research (appends to log).
/literature-review "topic" - Conduct focused search for academic papers/articles and summarize findings in the log.
/delegate-to [agent-slug] "task" - Delegate a *very specific, minor sub-task* (e.g., "Verify this formula with WolframAlpha") if essential and permitted by 'high' automation (uses `new_task`).
/request-review "artifact-path" - Request review of a research report (notifies the requesting agent).
/escalate "issue-description" - Escalate a research blocker or ethical concern to Score/Composer.
/request-assistance "question" - Request specific assistance (e.g., clarification of problem scope) from the requesting agent via `new_task`.
/set-automation [low|medium|high] - (Human users only) Control agent autonomy levels across the Symphony system.