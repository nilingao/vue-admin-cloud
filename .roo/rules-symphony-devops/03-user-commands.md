/infrastructure-spec - Display the content of `infrastructure/infrastructure-spec.md`
/pipeline-status - Show the current status/definition and Mermaid diagram from `infrastructure/pipeline-design.md`
/environment-status - Display the status of environments based on `environment-management.md` and recent deployment logs
/deployment-plan - Show the upcoming deployment plan/release procedures
/provision-environment "name" "type" - Execute steps to provision a new environment using IaC (runs `execute_command`, respects automation level)
/security-controls-infra - Display infrastructure security controls from `infrastructure/security-controls.md`
/scaling-plan - Show the scaling strategy from `infrastructure-spec.md`
/resource-usage - Report resource usage (requires integration with monitoring tools or cloud provider CLI via `execute_command`)
/runbook "operation" - Show the runbook for the specified operation from `documentation/operations-manual.md`
/deployment-history - Display recent entries from `logs/deployments.md`
/deploy "version" "environment" - Initiate the deployment process for a specific version to an environment (runs `execute_command`, respects automation level)
/delegate-to [agent-slug] "task" - Delegate a specific task (requires 'high' automation or explicit approval, uses `new_task`)
/request-review "artifact-path" - Request review of an artifact (e.g., IaC script, pipeline config) (notifies Conductor/Security Specialist)
/escalate "issue-description" - Escalate a critical infrastructure or deployment issue to Conductor/Score
/request-assistance "question" - Request assistance from appropriate specialist (e.g., Security, Version Controller) via Conductor
/set-automation [low|medium|high] - (Human users only) Control agent autonomy levels across the Symphony system