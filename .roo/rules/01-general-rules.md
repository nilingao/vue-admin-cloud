# Rules for ALL agents

**Core Principles:**
- **Accuracy Over Speed:** If you are not sure about file content or codebase structure pertaining to the user’s request, use your tools (`read_file`, `search_files`, `list_files`) to gather the relevant information. DO NOT GUESS or make up an answer. Verify information before acting.
- **Plan and Reflect:** You MUST plan extensively before each significant action or function call, and reflect thoroughly on the outcomes of previous function calls. DO NOT rely solely on function calls for the entire process; thoughtful planning and reflection are crucial for insightful problem-solving.
- **Context Management:**
    - Be mindful of the context window. Prefer reading specific sections of files over entire large files.
    - **Proactive Summarization:** Regularly summarize key information, progress, and context from logs and detailed documents into higher-level status files (e.g., Conductor summarizes Performer logs into task sheet notes; Score summarizes Conductor reports into project status notes). This helps keep essential information readily available without rereading large files.
    - Check context usage conceptually or via `/check-context` command (if user-initiated). If approaching limits (e.g., 80%), prioritize summarization and prepare for potential handoff if essential.

**Communication and Delegation:**
- **Automation Level Check:** Before delegating (`new_task`) or initiating communication using another agent's user command, you MUST verify the current automation level specified in `symphony-[project-slug]/core/symphony-core.md` permits this action. Follow the automation level guidelines strictly.
- **Delegation Logging:** Before delegating to another agent via `new_task`, update the relevant team log (`symphony-[project-slug]/communication/[goal-id]/[goal-id]-team-log.md` or `symphony-[project-slug]/communication/agent-interactions.md` if goal-specific log doesn't exist). For each delegation include:
  ```
  ----Begin Update----
  # Goal: [Goal-ID or N/A]
  # Task: [Task-ID or N/A] - [Brief Task Name]
  Description: [brief description of delegated task]
  Assigned to: [Agent-Slug]
  Communicated on: [date and time]
  ----End Update----
  ```
- **Common Commands:** Standard commands like `/delegate-to`, `/request-review`, `/escalate` should be used consistently as defined in each agent's command list, always respecting the current automation level. Delegation typically uses `new_task` internally, while `/delegate-to` might be reserved for specific user-like interactions when automation is high. `/escalate` always targets a higher coordinating role (Conductor -> Score, Score -> Composer).

**Standard User Commands & Procedures:**
- Agents should recognize standard commands defined in their respective `03-user-commands.md` files.
- **`/continue` Command Procedure:** When an agent receives the `/continue` command, it MUST follow the standard handoff procedure:
    1.  Identify its own agent slug/type and current context (Goal/Task ID, mode).
    2.  Generate a comprehensive handoff markdown document in the `symphony-[project-slug]/handoffs/` directory, following naming conventions (`DDMMYYYYHHHH_[agent-slug]_[brief-topic].md`). This document must summarize the current state, progress, issues, relevant code snippets (`read_file`), file references, and the objective for the next agent. Use `write_to_file` to create it and `read_file` to verify.
    3.  Check the current automation level in `symphony-core.md` using `read_file`.
    4.  If automation allows, delegate the task via `new_task` to another agent of the *same type*. The `new_task` message must state it's a continuation, reference the handoff document path, and specify the objective. Log the delegation using `append_to_file` append to `agent-interactions.md`.
    5.  If automation does not allow delegation, inform the user that the handoff document is created but the `new_task` delegation requires manual initiation.
    6.  Log all tool calls with rationale as per standard procedure.

**File System Usage:**
- **Reserved Directory:** The `symphony-[project-slug]/` folder structure is reserved EXCLUSIVELY for the following file types used by Symphony agents:
  ```
  Markdown - .md
  Text - .txt
  ```
  No other file types (e.g., source code, binaries, general images) should be stored directly within this structure unless explicitly part of a required artifact (like a Mermaid diagram within a `.md` file). Source code belongs in the project's main directories, tests in `tests/`, etc.
- **Log Files:** All log files (work logs, team logs, communication logs) MUST be updated using an **append-only** approach. DO NOT delete or overwrite previous entries. Always timestamp new entries.
- **Structured Data:** Where appropriate (e.g., status files, registries), use structured data formats within Markdown files (like consistent key-value pairs, tables, or embedded JSON/YAML-like blocks) to facilitate easier parsing and targeted updates using `apply_diff` or careful `write_to_file`.
- **Verification:** After critical file operations (`write_to_file`, `apply_diff`), consider using `read_file` on the relevant section or checking file metadata to verify the change was successful, especially if the change affects system state.
- **Visual Documentation:** Where instructed (e.g., for architecture, plans, flows), generate diagrams using Mermaid syntax within Markdown files. Ensure diagrams are kept up-to-date with the state they represent.

**Error Handling:**
- **Tool Failures:** If a tool like `write_to_file` or `apply_diff` fails, log the error and attempt the operation again using a safer method (e.g., switch from `apply_diff` to `write_to_file` for the whole file). If it still fails, escalate the issue.
- **Command Failures:** If a command via `execute_command` fails:
    1. Analyze the error output.
    2. If the cause is clear (e.g., syntax error, missing dependency), attempt to fix it and retry the command *once*.
    3. If the cause is unclear or the retry fails, log the command, the error, and escalate the issue to the appropriate role (e.g., Performer -> Conductor).
- **Conflicting Information:** If you detect conflicting information between different state files, prioritize the source of truth defined by the system (e.g., `symphony-core.md` for automation levels, Conductor's task sheet for task status). Log the discrepancy and escalate if it impacts critical operations.
