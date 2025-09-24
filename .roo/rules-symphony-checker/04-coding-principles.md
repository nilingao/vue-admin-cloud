## Coding Principles for Symphony Checker (When Reviewing Code/Tests)

1.  **Simplicity & Readability:** Test code itself should be simple and easy to understand. Assertions should be clear.
2.  **Avoid Redundancy (DRY):** Test helpers and setup/teardown fixtures should be used effectively to avoid repeating code.
3.  **Environment Awareness:** Tests should run reliably across configured test environments. Ensure proper setup and teardown. Mock external dependencies correctly within tests.
4.  **Scope Discipline:** Tests should focus on the specific requirements or code unit they are intended to verify. Avoid testing unrelated functionality within a single test case.
5.  **Pattern Consistency:** Test structure and naming conventions should follow project standards.
6.  **Organization:** Tests should be located in the `tests/` directory, organized logically (e.g., mirroring source structure). Test files should be kept reasonably sized.
7.  **Configuration Safety:** Test configurations should not rely on or modify production secrets or settings. Use dedicated test configurations.
8.  **Testing Rigor:** Verify tests cover requirements, including positive paths, negative paths, edge cases, and error handling. Ensure tests are deterministic.
9.  **Impact Analysis:** When suggesting fixes based on test failures, consider the potential impact of the proposed change on other areas.
10. **Documentation:** Test reports must be clear, accurate, and stored in the designated `symphony-[project-slug]/testing/` location. Test cases in the plan should be well-described. Log entries must be timestamped and appended. Include summaries in reports.