---
name: ui-components
description: >
  组件参考手册——本项目所有可复用 UI 组件的清单、props、用法与导入路径。写页面/组件前
  先查这里，已有的直接用，禁止重复实现。覆盖框架层（@vben/common-ui 的 Page/Fallback/
  Workbench/Analysis/Authentication/Profile/ApiComponent/CountTo/VCropper/Tree/验证码、
  shadcn-ui 原子件与 Vben* 组件、useVbenForm/useVbenModal/useVbenVxeGrid 的完整 API）
  与 app 层（Video 播放器、IVR 流程图、Activiti bpmn 设计器、VideoPlayModal）。
  Use when building any UI, choosing a component, looking up props/slots/api methods,
  弹窗 抽屉 表单 表格 图表 树 验证码 裁剪 图标选择 播放器 流程图 bpmn, "有没有现成组件",
  "用什么组件", "component reference", or when about to write a new shared component.
---

# 组件参考手册

**先查这里再写组件。** 下表已有的能力直接复用；找不到再用 `codegraph_explore` 确认，确无才新写。
详细的 props/slots/API 方法见 references/，按需加载：

- **框架层通用组件**（Page/弹窗/表单/表格/图表/树/验证码…）→ [references/framework-components.md](references/framework-components.md)
- **shadcn-ui 原子件 + Vben\* 组件** → [references/shadcn-vben-components.md](references/shadcn-vben-components.md)
- **app 层业务组件**（Video 播放器 / IVR 流程图 / Activiti bpmn 设计器）→ [references/app-components.md](references/app-components.md)

## 速查：按需求选组件

| 我要… | 用这个 | 导入 |
|---|---|---|
| 页面外壳（自适应高度） | `Page` | `@vben/common-ui` |
| 左树右表分栏页 | `ColPage` | `@vben/common-ui` |
| 弹窗 / 抽屉 | `useVbenModal` / `useVbenDrawer` | `@vben/common-ui` |
| 命令式确认/输入框 | `confirm` / `alert` / `prompt` | `@vben/common-ui` |
| CRUD 表格 | `useVbenVxeGrid` | `#/adapter/vxe-table` |
| 表单 | `useVbenForm` + `z` | `#/adapter/form` |
| 远程数据下拉/树/级联 | schema 里 `component: 'ApiSelect'/'ApiTreeSelect'/'ApiCascader'` | adapter 已注册 |
| 图表 | `EchartsUI` + `useEcharts` | `@vben/plugins/echarts` |
| 富文本 | `VbenTiptap` | `@vben/plugins/tiptap` |
| 错误/占位页 | `Fallback`（403/404/500/offline/coming-soon） | `@vben/common-ui` |
| 工作台卡片 | `WorkbenchHeader/Project/QuickNav/Todo/Trends` | `@vben/common-ui` |
| 分析页指标/图表卡 | `AnalysisOverview/AnalysisChartCard/AnalysisChartsTabs` | `@vben/common-ui` |
| 登录/注册/找回密码页 | `AuthenticationLogin` 系列 | `@vben/common-ui` |
| 个人中心 | `Profile` + `Profile*Setting` | `@vben/common-ui` |
| 数字滚动 | `CountTo` / `VbenCountToAnimator` | `@vben/common-ui` |
| 图片裁剪 | `VCropper` | `@vben/common-ui` |
| 文本省略+tooltip | `EllipsisText` | `@vben/common-ui` |
| 图标选择器 | `IconPicker` | `@vben/common-ui` |
| JSON 查看 | `JsonViewer` | `@vben/common-ui` |
| 局部加载遮罩 | `Loading` / `Spinner` / `v-loading` | `@vben/common-ui` |
| tooltip | `Tippy` / `v-tippy` / `VbenTooltip` / `VbenHelpTooltip` | `@vben/common-ui` |
| 树（带空态） | `Tree` | `@vben/common-ui` |
| 验证码（滑动/旋转/拼图/点选） | `SliderCaptcha` / `SliderRotateCaptcha` / `SliderTranslateCaptcha` / `PointSelectionCaptcha` | `@vben/common-ui` |
| 详情描述列表 | `VbenDescriptions` + `VbenDescriptionsItem` | `@vben/common-ui` |
| 表格行操作按钮组 | `VbenTableAction`（带权限过滤+更多下拉） | `@vben/common-ui` |
| 右键菜单 / 下拉菜单 | `VbenContextMenu` / `VbenDropdownMenu` | `@vben/common-ui` |
| 按钮（带 loading） | `VbenButton` / `VbenIconButton` | `@vben/common-ui` |
| 头像 | `VbenAvatar` | `@vben/common-ui` |
| 视频流播放（监控） | `VideoJessibucaPlay` / 弹窗 `VideoPlayModal` | `#/components/Video`、`views/video/modules` |
| WebRTC 对讲（FreeSWITCH） | `FsRtcPlay` | `#/components/Video` |
| IVR 流程图画布 | `IvrFlowChart` | `#/components/FlowChart` |
| bpmn 流程设计器 | `BpmnModeler` + `BpmnPanel` + `BpmnActions` | `#/components/Activiti` |
| 图标 | `IconifyIcon` / lucide 组件 / `createIconifyIcon` | `@vben/icons` |

## 三条硬规则

1. **导入优先级**：app 业务组件从 `#/components/*`；框架组件优先从 `@vben/common-ui`（已 re-export 大部分 shadcn Vben\* 组件）；少数未 re-export 的（如 `VbenSegmented`）才从 `@vben-core/shadcn-ui`
2. **表单组件名 ≠ 组件**：`ApiSelect/ApiTreeSelect/Upload/IconPicker` 等作为 schema `component` 字符串时，是 app 层 `adapter/component/index.ts` 注册的，只能在 VbenForm schema 用；新增需同步 `ComponentType` + `ComponentPropsMap`
3. **新写的可复用组件**：放 `src/components/<域>/`，加 `index.ts` 桶导出，并回填到本文件 + `reuse-map`
