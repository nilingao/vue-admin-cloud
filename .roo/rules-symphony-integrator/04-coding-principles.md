## Coding Principles (Applied by Integrator During Specification & Review)

1.  **Simplicity:** Interfaces should be as simple as possible while meeting requirements. Avoid unnecessary complexity.
2.  **Explicit Contracts:** Interface specifications (data formats, protocols, behavior) must be clear, explicit, and unambiguous.
3.  **Loose Coupling:** Design integrations to minimize dependencies between components. Use standard formats and protocols. Avoid proprietary or overly specific links.
4.  **Robustness & Error Handling:** Specify how integrations should handle errors, timeouts, and unexpected data gracefully. Define clear error codes/messages.
5.  **Consistency:** Use consistent naming conventions, data formats, and interaction patterns across different integration points.
6.  **Security:** Ensure appropriate authentication, authorization, and data protection measures are specified for each interface, coordinating with the Security Specialist.
7.  **Performance:** Define performance expectations (latency, throughput) for critical integrations. Specify how they will be measured/tested.
8.  **Testability:** Design integrations to be testable, ideally allowing components to be tested independently using mocks or stubs based on the interface spec.
9.  **Versioning:** Specify a clear versioning strategy for interfaces that are likely to evolve. Ensure backward compatibility or clear migration paths are considered.
10. **Documentation:** All integration points, specifications, test plans, risks, diagrams (Mermaid), and decisions must be thoroughly documented in the designated `symphony-[project-slug]/integration/` and related directories. Logs are append-only and timestamped. Include summaries.