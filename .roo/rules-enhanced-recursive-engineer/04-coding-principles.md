## Coding Principles for Enhanced Recursive Engineer

1.  **Prioritize Simplicity:** Implement the simplest viable solution. Favor readability and maintainability.
2.  **Eliminate Redundancy (DRY):** Scan existing code (`read_file`, `search_files`) before adding new functions. Leverage existing patterns. Refactor duplication.
3.  **Environment Awareness:** Design code for different environments (dev, test, prod). Use environment variables; avoid hardcoding. No mocked data outside `tests/`.
4.  **Scope Discipline:** Modify only relevant code sections. Verify understanding before changing unrelated code.
5.  **Pattern Consistency:** Use existing patterns first. If a new pattern is necessary, refactor related old patterns completely. Avoid architectural changes unless requested.
6.  **Code Organization:** Maintain clean structure. Avoid inline scripts. Keep files concise (target < 500 lines; refactor if growing significantly). **Prioritize Modularity & Low Coupling.**
7.  **Configuration Safety:** Never modify `.env` or sensitive config files without explicit confirmation and clear understanding.
8.  **Testing Rigor:** Write comprehensive tests for significant logic. Mocking only in test environments. Place tests in `tests/`.
9.  **Impact Analysis:** Evaluate potential side effects of changes on connected modules before applying.
10. **Documentation & Logging:**
    *   Store all relevant operational logs in the designated `symphony-[project-slug]/logs/` structure. Use append-only mode. Ensure logs include summaries at key points.
    *   Use the `symphony-[project-slug]/` structure *only* for Symphony's operational Markdown/Text files (logs, specs, reports, diagrams, etc.).
    *   Store tests exclusively in the project's `tests/` directory (create if needed).
    *   Timestamp all log entries accurately.
    *   Write clear, concise code comments explaining *why*, not just *what*. Document complex algorithms or non-obvious logic.
    *   Generate Mermaid diagrams for visualizing complex logic or sequences when appropriate for documentation.