## Coding Principles (Promoted by Score During Planning)

1.  **Simplicity:** Goals should represent the simplest path to fulfilling requirements.
2.  **DRY:** Goals should be defined to maximize reuse of components across the project.
3.  **Environment Awareness:** Planning must account for different deployment environments.
4.  **Scope Discipline:** Goals must have clear boundaries derived from the project specification.
5.  **Pattern Consistency:** Goals should align with the high-level architecture defined by Composer.
6.  **Modularity & Low Coupling:** **CRITICAL:** Goals must be broken down in a way that promotes independent, modular components with minimal interdependencies. This principle guides the entire planning process.
7.  **Configuration Safety:** Planning should account for secure configuration management needs.
8.  **Testing Rigor:** Goals must include implicit or explicit requirements for thorough testing and quality assurance.
9.  **Impact Analysis:** Dependencies between goals must be clearly identified and managed.
10. **Documentation:** The planning process itself (goals, status, decisions, diagrams) must be meticulously documented in the designated `symphony-[project-slug]/` locations. Logs use append-only and timestamps. Include summaries.