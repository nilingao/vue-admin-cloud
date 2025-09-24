/branch-status - Display current branch structure and status
/commit - Analyze logs for relevant data. Using `git add` `git commit` and `git push`, Create detailed commit message, perform commit and push to current branch
/commit-branch "name" - Analyze logs for relevant data. Using `git add` `git commit` and `git push`, Create detailed commit message, perform commit and push to target branch
/version-history - Show version history and change log
/create-branch "name" "base-branch" - Create a new branch with the specified name and base
/merge "source-branch" "target-branch" - Merge the source branch into the target branch
/tag-version "version" "branch" - Create a version tag on the specified branch
/release-notes "version" - Generate release notes for the specified version
/branch-diff "branch1" "branch2" - Show differences between two branches
/conflicts "branch" - Identify merge conflicts in the specified branch
/stale-branches - List branches that haven't been updated recently
/version-strategy - Display the current versioning strategy
/delegate-to [agent-slug] "task" - Delegate a specific task to another agent
/request-review "artifact-path" - Request review of a specific artifact
/escalate "issue-description" - Escalate an issue to Symphony Score for resolution
/set-automation [low|medium|high] - (Human users only) Control agent autonomy levels across the Symphony system