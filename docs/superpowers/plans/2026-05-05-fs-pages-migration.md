# FS Pages Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the v5-native `fs/call` and `fs/logic_flow` pages from the v2 source.

**Architecture:** Add focused v5 view modules under `apps/web-antd/src/views/fs`. Reuse existing v5 socket hooks for call state, and provide a local v5-compatible call panel and flow preview because the v2 `FsRtcPlay` and `IvrFlowChart` components do not exist in v5.

**Tech Stack:** Vue 3, TypeScript, Vben Page/Form adapters, ant-design-vue, existing v5 socket hooks, CSS grid/flex layouts.

---

### Task 1: Verify Current FS Pages Are Missing

**Files:**

- Read: `apps/web-antd/src/views/fs/call/index.vue`
- Read: `apps/web-antd/src/views/fs/logic_flow/index.vue`

- [ ] **Step 1: Run missing-file checks**

Run:

```powershell
Test-Path apps/web-antd/src/views/fs/call/index.vue
Test-Path apps/web-antd/src/views/fs/logic_flow/index.vue
```

Expected: both commands print `False`, proving the route components are currently missing.

### Task 2: Add FS Call Page

**Files:**

- Create: `apps/web-antd/src/views/fs/call/index.vue`

- [ ] **Step 1: Implement the page**

Create a Vue page with:

- `Page` wrapper.
- Agent status panel using existing v5 socket hooks.
- Vben form for `mobile` and `dtmf`.
- Buttons for call, hang up, send DTMF, and refresh agent status.
- Video mode switch.
- A local media placeholder panel that exposes the missing WebRTC dependency clearly in the UI while preserving call control flow.

- [ ] **Step 2: Verify component path exists**

Run:

```powershell
Test-Path apps/web-antd/src/views/fs/call/index.vue
```

Expected: `True`.

### Task 3: Add FS Logic Flow Preview Page

**Files:**

- Create: `apps/web-antd/src/views/fs/logic_flow/data.ts`
- Create: `apps/web-antd/src/views/fs/logic_flow/index.vue`

- [ ] **Step 1: Implement flow data**

Create a small, typed sample IVR flow data module based on the v2 example. Use readable Chinese labels and simple node/edge interfaces so no missing `@vue-flow/core` dependency is introduced.

- [ ] **Step 2: Implement flow page**

Create a Vue page with:

- `Page` wrapper.
- A summary header.
- A scrollable horizontal flow canvas.
- Node cards for start, condition, digits, transfer, playback, and hangup nodes.
- Edge labels showing source-to-target relationships.

- [ ] **Step 3: Verify component path exists**

Run:

```powershell
Test-Path apps/web-antd/src/views/fs/logic_flow/index.vue
```

Expected: `True`.

### Task 4: Run Focused Verification

**Files:**

- Verify: `apps/web-antd/src/views/fs/call/index.vue`
- Verify: `apps/web-antd/src/views/fs/logic_flow/index.vue`
- Verify: `apps/web-antd/src/views/fs/logic_flow/data.ts`

- [ ] **Step 1: Run type check**

Run:

```powershell
pnpm -F @vben/web-antd run typecheck
```

Expected: command completes without TypeScript errors from the new FS pages.

- [ ] **Step 2: Run git status**

Run:

```powershell
git status --short
```

Expected: only the new FS page files and plan file are added or modified for this batch.
