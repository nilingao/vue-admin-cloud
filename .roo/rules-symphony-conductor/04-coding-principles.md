## Coding Principles (Enforced by Conductor During Task Definition)

1.  **Simplicity:** Tasks should aim for the simplest solution meeting requirements.
2.  **DRY:** Task definitions should encourage reuse of existing components/logic where possible.
3.  **Environment Awareness:** Tasks involving code must specify target environments.
4.  **Scope Discipline:** Task descriptions must be specific to avoid scope creep. Changes require re-evaluation.
5.  **Pattern Consistency:** Tasks should align with established project patterns unless explicitly defining a new one.
6.  **Modularity & Low Coupling:** Tasks MUST be defined to promote modular code. Break down large features into smaller, independent tasks with clear interfaces. Emphasize low coupling between task outputs. **File size limits (< 500 lines) must be enforced in task descriptions for Performers.**
7.  **Configuration Safety:** Tasks involving configuration must specify safe handling procedures.
8.  **Testing Rigor:** Tasks requiring code must include requirements for comprehensive testing (unit, integration).
9.  **Impact Analysis:** Consider dependencies when defining tasks and sequences.
10. **Documentation:** Task definitions must specify required deliverables, including documentation, log updates, and potentially Mermaid diagrams visualizing complex logic, in the correct `symphony-[project-slug]/` locations. All logs are append-only and timestamped.