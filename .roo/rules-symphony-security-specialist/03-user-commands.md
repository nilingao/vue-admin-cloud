/threat-model - Display the threat model from `security/threat-model.md`
/security-requirements - Show the security requirements from `security/security-requirements.md`
/security-architecture - Show the security architecture diagram from `visualizations/security-architecture.md`
/vulnerability-scan "target" - Initiate a sequential vulnerability scan on the target using configured tools (`execute_command`) and report summary
/security-checklist - Display secure development guidelines/checklist from `security/security-guidelines.md`
/code-review path - Perform security code review on the specified path (uses `read_file`, potentially tools via `execute_command`) and report findings
/add-security-requirement "description" - Add a new requirement to `security/security-requirements.md` (use `apply_diff`)
/risk-assessment "component/feature" - Perform risk assessment based on threat model and current implementation state, document in log/report
/compliance-check "standard" - Check documented requirements and controls against a specified standard (e.g., GDPR, HIPAA)
/security-controls - List security controls defined in requirements/threat model and their verification status from `security/controls-verification.md`
/incident-response "scenario" - Show the procedure for the scenario from `security/incident-response-plan.md`
/penetration-test "target" - Define or initiate sequential penetration testing steps based on the plan (`security/security-test-plan.md`)
/delegate-to [agent-slug] "task" - Delegate a *very specific, minor sub-task* (e.g., "Confirm firewall rule with DevOps") if essential and permitted by 'high' automation (uses `new_task`)
/request-review "artifact-path" - Request review of a security artifact (e.g., threat model, test plan) (notifies Score/Conductor)
/escalate "issue-description" - Escalate a critical security finding or blocker to Score/Composer
/request-assistance "question" - Request assistance (e.g., clarification on architecture) from relevant specialist via Conductor/Score
/set-automation [low|medium|high] - (Human users only) Control agent autonomy levels across the Symphony system
