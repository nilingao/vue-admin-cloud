## Coding Principles (Applied by Performer During Implementation)

1.  **Simplicity:** Implement the simplest solution that meets task requirements. Prioritize readability.
2.  **DRY (Don't Repeat Yourself):** Use functions/modules. Check for existing utilities (`read_file`, `search_files`) before creating new ones.
3.  **Environment Awareness:** Use environment variables/configs. Avoid hardcoding values. Place test-specific mocks only in `tests/`.
4.  **Scope Discipline:** Implement *only* what is specified in the assigned task. Do not modify unrelated code.
5.  **Pattern Consistency:** Follow established project patterns and coding standards provided in guidelines.
6.  **Modularity & Low Coupling:** **CRITICAL:** Write code in small, focused modules/functions with clear interfaces. Minimize dependencies. **Adhere strictly to file size limits (target < 500 lines).**
7.  **Configuration Safety:** Never hardcode secrets. Read configuration safely. Do not modify `.env` files unless explicitly the task.
8.  **Testing Rigor:** Write unit tests for implemented logic. Ensure tests cover main paths and edge cases. Place tests in `tests/`.
9.  **Impact Analysis:** Be mindful of how your changes might affect other parts of the system, especially integration points.
10. **Documentation & Logging:**
    *   Write clear inline comments for complex logic (the *why*).
    *   Document public functions/modules (e.g., docstrings).
    *   Maintain the work log with detailed steps, decisions, timestamps, and summaries (Be sure to **append to the end** of the log when adding entries).
    *   Store code and tests in the correct project directories (`src/`, `tests/`, etc.), NOT `symphony-[project-slug]/`.
    *   Ensure all specified deliverables are created.
    *   Generate Mermaid diagrams to visualize complex algorithms or control flow if helpful for documentation.
11. **Refined File Modification Strategy (Triage & Targeted Write Fallback):**
    
    *   **Goal:** Modify existing files safely and effectively, acknowledging potential tool limitations.
    *   **Step 1: Triage the Change Request:**
        *   Analyze the required modification.
        *   **Is it a "Simple Single-Line Change"?** Definition: Affects ONLY ONE contiguous line AND involves ONLY direct text replacement within that line (e.g., renaming a variable `foo` to `bar`, changing `"text"` to `"new text"`, `5` to `10`).
        *   **Is it a "Complex or Multi-Line Change"?** Definition: Affects multiple lines, adds/removes lines, changes indentation significantly, refactors logic across lines, or is anything other than a "Simple Single-Line Change". **Assume most function body edits are complex.**
    *   **Step 2a: Procedure for Simple Single-Line Changes:**
        1.  **Log Intent:** Log that you are attempting a simple, single-line `apply_diff`.
        2.  **Read Target Line:** Log intent and use `read_file` with the exact `start_line` and `end_line` (which will be the same) to get the precise current content of that single line, including all whitespace.
        3.  **Log Comparison:** Log the `read_file` output and the `<diff>` block you will construct, ensuring the `SEARCH` content *exactly* matches the single line read (character for character, including whitespace).
        4.  **Construct Diff:** Create the `<diff>` block for `MultiSearchReplaceDiffStrategy` targeting only that single line.
        5.  **Log & Apply:** Log intent and call `apply_diff`.
        6.  **Handle Failure:** If `apply_diff` fails (similarity < 100%), log the failure details clearly. Then, **immediately proceed to Step 2b (Procedure for Complex Changes)** as a fallback.
    *   **Step 2b: Procedure for Complex or Multi-Line Changes (or Fallback):**
        1.  **Log Intent:** Log that you are using the "Targeted Write Fallback" method due to change complexity or prior `apply_diff` failure.
        2.  **Read FULL File:** Log intent and use `read_file` to get the *entire* content of the target file (do not specify line numbers). Store this full content internally. Note the original total line count.
        3.  **Identify Target Area:** Determine the approximate start and end line numbers of the section you *intend* to modify within the full content read. Log these intended lines.
        4.  **Apply Change In Memory:** Carefully modify the stored full file content *in your internal reasoning* to implement the required change(s). Ensure the rest of the file remains untouched. Calculate the *new* total line count.
        5.  **Generate Change Summary:** Create a concise, human-readable summary describing *what* change was made and *approximately where* (using the line numbers identified in substep 3). Example: "Lines 97-122: Refactored embedding validation to add dimension check and improve error logging."
        6.  **Log Thoroughly:** Append a log entry using `append_to_file` containing:
            *   Confirmation this is the "Targeted Write Fallback" procedure.
            *   The intended start/end lines of the change.
            *   The human-readable "Change Summary" from substep 5.
            *   **(Optional but helpful):** A snippet of the *original* code block from the target area (read during substep 2).
            *   **(Optional but helpful):** A snippet of the *new* code block you created (part of the content from substep 4).
        7.  **Log & Write:** Log intent: `[timestamp] Rationale: Applying complex change via write_to_file review (intended lines [start]-[end]). See change summary above. Calling tool: write_to_file(...)`. Call `write_to_file` providing:
            *   `path`: The target file path.
            *   `content`: The **complete, modified** file content generated in substep 4.
            *   `line_count`: The **new, correct** total line count for the modified content.
        8.  **Acknowledge Review:** Understand that `write_to_file` requires user approval via a full-file diff view. Your detailed logging (substep 6) provides necessary context for this review.
    *   **Post-Modification Verification (Recommended):** After a successful modification (either method), consider using `read_file` on the modified section to verify the final state. Log the verification result.