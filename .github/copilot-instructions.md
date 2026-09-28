# Copilot 项目指令

## ⚠️ 最高优先级规则：优先使用 CodeGraph

本项目已建立 CodeGraph 索引（`.codegraph/` 目录）。在理解代码、定位符号、分析调用链或进行代码修改前，**必须优先使用 `codegraph_explore` 工具**，而非手动 grep 或逐个读取文件。

1. 分析项目/代码 → 先 `codegraph_explore` 查询架构/入口/核心符号
2. 定位符号 → `codegraph_explore` 传入符号名或文件名
3. 分析调用链 → `codegraph_explore` 命名流程两端符号，返回调用路径
4. 编辑前 → `codegraph_explore` 查看目标源码 + 影响范围（blast radius）
5. 仅 codegraph 未覆盖的场景（`.env` 等配置、`.md` 文档）才用 `read_file` / `grep_search`

## 项目概览

基于 vben-admin 5.x 的 Vue 3 后台管理系统，pnpm + turbo monorepo。唯一应用：`apps/web-antd`（Ant Design Vue）。

- Node `^22.18.0 || ^24.0.0`，pnpm `>=11`（`only-allow` 强制，勿用 npm/yarn）
- **无 mock**，开发直连真实后端：vite proxy `/basic-api` → `https://www.nilongao.cn/basic-api`（见 `apps/web-antd/vite.config.ts`）
- 环境变量在 `apps/web-antd/.env*`（dev 端口 5666）

## 常用命令

| 命令 | 用途 |
|---|---|
| `pnpm dev:antd` | 启动开发服务器 |
| `pnpm build:antd` | 构建 web-antd |
| `pnpm check:type` | 全量类型检查（pre-commit 会自动执行） |
| `pnpm lint` / `pnpm format` | 检查 / 修复（oxfmt + oxlint + eslint + stylelint 链） |
| `pnpm test:unit` | vitest 单测（happy-dom） |
| `pnpm commit` | czg 交互式提交（Angular 规范，commitlint 校验） |

## 目录职责

- `apps/web-antd/src/`：`views/`（按业务域分页：fs/oa/index/video/work…）、`api/`（按域分目录 + `request.ts`）、`router/`（`access.ts` 动态权限路由）、`store/`、`adapter/`（VbenForm/VxeGrid 适配层）、`locales/langs/{zh-CN,en-US}/`
- `packages/@core/`：框架核心（ui-kit、preferences、composables），零业务
- `packages/effects/`：效果层（access 权限、request axios 封装、layouts、plugins 如 vxe-table/echarts）
- `packages/stores|utils|icons|locales|constants|…`：跨包共享
- `internal/`：lint / tsconfig / vite-config 共享配置（一般无需改动）

## 关键约定

1. **路由为后端动态菜单**（`accessMode: 'backend'`）：菜单来自 `getAllMenusApi`，组件用 `import.meta.glob('../views/**/*.vue')` 映射。新页面必须放在 `views/` 下且路径与后端菜单 component 字段一致；前端静态路由仅少量在 `router/routes/modules/`。
2. **CRUD 页面模式**：`<module>/<page>/index.vue` + 页面级 `data.ts`（VbenFormSchema / VxeGrid schema，用 zod 校验）+ `modules/*.vue`（弹窗/抽屉，`useVbenModal`）。表格统一 `useVbenVxeGrid`，按钮权限用 `v-access:code`。范例：`views/index/system/user/`。
3. **请求**：只用 `src/api/request.ts` 导出的 `requestClient`（已带 token、刷新重认证、租户头 `schemasTenantId` 注入）；API 文件写极简 typed wrapper（范例：`api/core/menu.ts`）。
4. **多租户**：`tenantMode` 偏好扩展 + `userStore.searchTenant`，详见 [tenant-switch-design](../docs/superpowers/specs/2026-07-07-tenant-switch-design.md)。
5. **i18n**：文案一律 `$t()`，语言包按模块分 json 放 `src/locales/langs/`。
6. **依赖版本**：统一 `catalog:`（定义在 `pnpm-workspace.yaml`），勿在子包 package.json 写死版本号。

## 设计文档（先读再改）

迁移/修改 v2 旧页面相关代码前，先读 `docs/superpowers/`：

- [v2→v5 页面迁移总设计](../docs/superpowers/specs/2026-05-05-v2-views-migration-design.md)
- [租户切换设计](../docs/superpowers/specs/2026-07-07-tenant-switch-design.md)
- 实施计划在 `docs/superpowers/plans/`

贡献指南：[contributing.md](contributing.md) · 提交规范：[commit-convention.md](commit-convention.md)

## 编码风格

涉及写代码/重构/修 bug 的任务，遵循 `.github/skills/ponytail/SKILL.md` 的"最懒可行解"原则：先复用现有代码与已装依赖，禁止投机抽象与样板代码。

## 项目 Skills（写代码前先查，禁止造轮子）

| Skill | 用途 |
|---|---|
| `/reuse-map` | **公共能力总目录**——写任何新代码前先查，框架层+app层可复用组件/hooks/utils 全表 |
| `/ui-components` | **组件参考手册**——所有 UI 组件的 props/slots/API 方法详解（common-ui / shadcn Vben* / Video / FlowChart / Activiti） |
| `/crud-page`（prompt） | 生成整套 CRUD 页面（index.vue + data.ts + 弹窗 + API + i18n） |
| `/api-wrapper` | 生成 `src/api` 接口文件（enum Api + do* 命名 + requestClient） |
| `/socket-namespace` | 新增 socket.io 实时功能（namespace 插件类自动注册 + rootSocketEmitter） |
| `/video-play` | 视频播放链路复用（VideoPlayModal / VideoJessibucaPlay / buildVideoPlayOptions / PTZ） |
| `/system-dict` | 后端字典/系统参数/行政区划（useSystemStore 已预加载，只读 getter） |
| `/ponytail*` 系列 | 过度设计审查/全仓审计/债务台账 |

新写的可复用代码完成后，回填到 `reuse-map` 对应表格。
