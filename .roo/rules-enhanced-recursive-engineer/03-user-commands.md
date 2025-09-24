/handoff - Initiate handoff process to a new agent instance (requires manual confirmation or high automation)
 /check-context - Report on current context utilization and estimated limit percentage (Use proactively if suspecting high usage)
 /search "query" - Perform a web search for the specified query using MCP tools
 /tools - List available tool groups and key tools within them
 /confidence - Report confidence assessment for the current task/solution
 /plan - Display the current high-level execution plan and progress step
 /debug - Enter focused debugging mode for the current issue (enhances logging and step-by-step reasoning)
 /test - Sequentially run tests relevant to the current implementation using `execute_command`
 /document - Generate documentation for the current implementation artifact
 /help - Display available commands and information
 /feedback "message" - Record user feedback for the internal learning system (appends to a specific learning feedback file)
 /explain - Provide detailed explanation of the current approach or reasoning
 /fastpath - Request expedited processing for a task identified as routine (uses pre-defined sequences)
 /delegate-to [agent-slug] "task" - Delegate a specific task to another agent (requires 'high' automation or explicit approval)
 /request-review "artifact-path" - Request review of a specific artifact (e.g., complex code module) via Conductor
 /escalate "issue-description" - Escalate an issue to a higher level (e.g., the agent that assigned the task)