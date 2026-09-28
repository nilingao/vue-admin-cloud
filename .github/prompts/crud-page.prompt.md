---
description: "按项目约定生成完整 CRUD 页面（index.vue + modules/data.ts + 弹窗 + API wrapper）"
argument-hint: "<模块路径> <实体名/字段与接口说明>"
agent: "agent"
---

为以下需求生成一个完整的 CRUD 页面：$ARGUMENTS

## 前置

1. 先用 `codegraph_explore` 查看范例页源码，严格模仿其写法，不要自创模式：
   - 结构范例（VxeGrid + Modal + onActionClick）：[position/index.vue](../../apps/web-antd/src/views/index/system/position/index.vue) 及其 `modules/data.ts`、`modules/PositionModel.vue`
   - **i18n 范例**（本项目文案一律用 `$t()`）：[menu/index.vue](../../apps/web-antd/src/views/index/system/menu/index.vue)、[menu/modules/form.vue](../../apps/web-antd/src/views/index/system/menu/modules/form.vue)、[menu/data.ts](../../apps/web-antd/src/views/index/system/menu/data.ts)
   - API wrapper：[api/sys/position.ts](../../apps/web-antd/src/api/sys/position.ts)
2. **API 域目录从模块路径推断**：`views/index/system/*` → `api/sys`，`views/oa/*` → `api/oa`，`views/video/*` → `api/video`；推断不出时问用户。
3. 若需求未给出接口 URL、字段、权限码，先向用户确认，不要臆造。

## 生成清单

按顺序创建（路径均在 `apps/web-antd/src/` 下）：

1. `api/<域>/<实体>.ts` — 极简 typed wrapper：Entity 接口 + `do<Entity>Page/Add/Update/Remove` 函数，只用 `requestClient`
2. `views/<模块路径>/index.vue` — `Page` + `useVbenVxeGrid`（formOptions.schema 来自 data.ts）+ `useVbenModal` 连接弹窗 + `onActionClick` 分发 add/edit/delete
3. `views/<模块路径>/modules/data.ts` — 导出 `useGridFormSchema()`（搜索栏）、`useColumns(onActionClick)`（含 CellOperation 列，show 用 `hasAccessByCodes`）、`useFormSchema()`（弹窗表单，必填项用 zod rules）
4. `views/<模块路径>/modules/<Entity>Model.vue` — `useVbenModal` 弹窗，新增/编辑复用，提交成功后 `emit('success')`
5. `locales/langs/{zh-CN,en-US}/<模块>.json` — 补充本页新增的 i18n key（两个语言文件都要加）

## 约定

遵循 `.github/instructions/` 下两份指令文件（编写 views 文件时会自动附加）：

- [vxe-grid-form.instructions.md](../instructions/vxe-grid-form.instructions.md) — 表格配置照抄范例（`height: 'auto'`、`keepSource`、`rowConfig.keyField: 'id'`、`toolbarConfig`、`proxyConfig.ajax.query`）；树形数据才加 `treeConfig`，普通分页列表启用 `pagerConfig`；表单校验用 zod（参考 menu/modules/form.vue）
- [i18n-access.instructions.md](../instructions/i18n-access.instructions.md) — 文案一律 `$t()`（key 格式 `<模块>.<实体>.<字段>`，中英 json 同步）；权限码 `<模块>.<实体>:add|update|delete`，按钮 `v-access:code`，列 show 用 `hasAccessByCodes`

另：遵循 ponytail 最懒可行解，不写需求外的功能。

## 完成后

- 运行 `pnpm check:type` 验证类型
- 提醒用户：路由为后端动态菜单，需在后端菜单管理中注册页面路径 `views/<模块路径>/index`（component 字段），前端无需加路由
