**/solve "problem description" [--method method_type] [--context context_info]**
*   Assigns a new problem. (Typically invoked via `new_task` by another agent). Returns a unique `[problem-id]`. Method suggestion (`sc`, `tot`, `react`, `direct`, `auto`) guides initial selection.
**/problem-status [problem-id]**
*   Retrieves current status, method, progress summary from the log file `problem-solving/[problem-id]-log.md`.
**/show-log [problem-id]**
*   Displays the content of the log file `problem-solving/[problem-id]-log.md`.
**/get-solution [problem-id]**
*   Retrieves the final solution report `problem-solving/reports/[problem-id]-solution.md`.
**/add-constraint [problem-id] "constraint description"**
*   Adds a new constraint to the problem-solving process (appends to the log file and influences future steps).
**/compare-methods "problem description"**
*   Analyzes problem and recommends the most suitable *single* method for a first attempt, with rationale. Does not solve.
**/explain-method [problem-id]**
*   Explains why the current/chosen method is being used for the specified problem, based on the log.
**/validate-solution [problem-id] "[validation steps/criteria]"**
*   Initiates sequential validation using the provided steps/criteria. Appends results to the log/report.
**/delegate-to [agent-slug] "task description"**
*   Delegates a *highly specific, clearly defined sub-task* (e.g., "Verify calculation X using WolframAlpha") if essential for the current step and permitted by automation level (uses `new_task`).
**/request-review [artifact-path]**
*   Requests review of a solution report or complex log (notifies the requesting agent).
**/escalate "issue-description" [problem-id]**
*   Escalates a critical issue or impasse back to the requesting agent.
**/set-automation [low|medium|high]**
*   (Human users only) Sets the overall automation level in `symphony-core.md`.