# Home Workbench Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the v5-native `index/home/workbench` page from the v2 source.

**Architecture:** Add the backend-menu-compatible component path under `apps/web-antd/src/views/index/home/workbench`. Reuse v5 `@vben/common-ui` workbench components and readable Chinese sample data instead of copying v2 dashboard child components.

**Tech Stack:** Vue 3, TypeScript, Vben common-ui dashboard components, Vue Router, Vben preferences/stores.

---

### Task 1: Verify Home Workbench Page Is Missing

**Files:**

- Read: `apps/web-antd/src/views/index/home/workbench/index.vue`

- [ ] **Step 1: Run missing-file check**

Run:

```powershell
Test-Path apps/web-antd/src/views/index/home/workbench/index.vue
```

Expected: `False`.

### Task 2: Add Home Workbench Page

**Files:**

- Create: `apps/web-antd/src/views/index/home/workbench/index.vue`

- [ ] **Step 1: Create target directory**

Run:

```powershell
New-Item -ItemType Directory -Force -Path apps/web-antd/src/views/index/home/workbench
```

Expected: directory exists.

- [ ] **Step 2: Implement v5 workbench**

Create a Vue page that:

- Uses `WorkbenchHeader`, `WorkbenchProject`, `WorkbenchQuickNav`, `WorkbenchTodo`, and `WorkbenchTrends`.
- Uses `AnalysisChartCard` with the existing analytics visits-source chart.
- Uses readable Chinese text.
- Navigates internal URLs through `vue-router` and external URLs through `openWindow`.
- Reads user display info from `useUserStore`, using v5 user fields such as `imageUrl`, `nickName`, and `userName`.

### Task 3: Run Focused Verification

**Files:**

- Verify: `apps/web-antd/src/views/index/home/workbench/index.vue`

- [ ] **Step 1: Run lint**

Run:

```powershell
pnpm oxlint apps/web-antd/src/views/index/home/workbench/index.vue
```

Expected: no warnings and no errors.

- [ ] **Step 2: Run format check**

Run:

```powershell
pnpm oxfmt --check apps/web-antd/src/views/index/home/workbench/index.vue docs/superpowers/plans/2026-05-05-home-workbench-migration.md
```

Expected: all matched files use the correct format.

- [ ] **Step 3: Run git status**

Run:

```powershell
git status --short
```

Expected: the new home workbench page and plan file are present as worktree changes, with no git commit.
