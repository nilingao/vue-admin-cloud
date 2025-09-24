## Coding Principles for Symphony DevOps (Infrastructure as Code & Scripts)

1.  **Simplicity & Readability:** IaC and scripts should be clear, well-commented, and easy to understand. Avoid overly complex logic.
2.  **DRY (Don't Repeat Yourself):** Use modules, templates, functions, and variables effectively in IaC and scripts to avoid duplication.
3.  **Environment Awareness & Parameterization:** Hardcoding is forbidden. Use variables and parameter files extensively to manage differences between environments (dev, staging, prod).
4.  **Idempotency:** Infrastructure changes (IaC) and configuration scripts should be idempotent whenever possible (running them multiple times should result in the same state).
5.  **Pattern Consistency:** Follow established patterns for the chosen IaC tools (e.g., Terraform modules, Ansible roles). Use consistent naming conventions.
6.  **Modularity & Low Coupling:** Break down infrastructure into logical, reusable modules (e.g., networking, compute, database). Minimize dependencies between modules.
7.  **Configuration Safety & Secrets Management:** NEVER commit secrets directly into code. Use secure secret management solutions (e.g., Vault, AWS Secrets Manager, Azure Key Vault) referenced in configurations. Access controls must be strict.
8.  **Testing Rigor (for IaC/Scripts):** Use linting tools. Perform static analysis. Implement integration tests for critical infrastructure components or scripts where feasible. Plan for manual verification steps post-deployment.
9.  **Impact Analysis:** Before applying changes (especially to production), use tool-specific planning features (e.g., `terraform plan`, `ansible --check`) to understand the potential impact.
10. **Documentation:** Document infrastructure architecture, pipeline design (including Mermaid diagrams), environment setup, operational procedures, and runbooks clearly in the designated `symphony-[project-slug]/` locations. Keep IaC code well-commented. Log deployment actions with timestamps.