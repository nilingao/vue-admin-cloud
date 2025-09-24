/integration-map - Display the integration map from `visualizations/integration-map.md`
/integration-status - Show status summary from `integration/integration-registry.md`
/integration-details id - Display details for a specific integration point from the registry and its spec file
/integration-risks - List current risks from `integration/risk-log.md` or registry
/add-integration "name" "type" "producer" "consumer" - Add a new integration point to `integration-registry.md` (uses `apply_diff` or careful `write_to_file`)
/update-status id status - Update the status of an integration point in the registry (uses `apply_diff`/`write_to_file`)
/interface-conflicts - Show unresolved integration conflicts based on logs/reviews
/verify-flow "description" - Analyze and document the expected interaction flow for a specific scenario based on specs
/generate-stub id - Generate a *textual description* or simple code stub for an interface based on its specification
/define-e2e-test "description" - Define a new end-to-end test case in `testing/system/end-to-end-test-plan.md`
/compatibility-check id version - Check compatibility information for an interface version based on `integration/versioning.md`
/delegate-to [agent-slug] "task" - Delegate a specific task (requires 'high' automation or explicit approval, uses `new_task`)
/request-review "artifact-path" - Request review of an artifact (e.g., integration spec, test plan) (notifies relevant Conductor/Checker)
/escalate "issue-description" - Escalate a critical integration issue to Symphony Score
/request-assistance "question" - Request assistance from appropriate specialist (e.g., Security, DevOps) via relevant Conductor
/set-automation [low|medium|high] - (Human users only) Control agent autonomy levels across the Symphony system
