---
name: reuse-map
description: >
  vue-admin-cloud 公共能力总目录——写任何代码前先查这里，已有的一律复用，禁止造轮子。
  覆盖：框架层（Page/useVbenModal/useVbenVxeGrid/useVbenForm/useEcharts/v-access/
  useUserStore/useAccessStore/工具函数/图标/类型）与 app 层（requestClient/公共组件/
  socket hooks/useSystemStore/文件下载/加密）。Use when writing ANY new code in this
  repo, or when the user says "有没有现成的", "不要造轮子", "复用", "公共组件",
  "reuse-map", "what exists for X".
---

# 公共能力地图（先查这里，再写代码）

原则：下表已有的能力**直接复用**；表里没有的，先 `codegraph_explore` 搜一遍确认真的不存在，再写新代码。

## 框架层（packages/*，已装好，勿重复引入同类库）

| 需求 | 用这个 | 导入 |
|---|---|---|
| 页面容器 | `Page`（auto-content-height） | `@vben/common-ui` |
| 弹窗/抽屉 | `useVbenModal` / `useVbenDrawer` | `@vben/common-ui` |
| 表格 CRUD | `useVbenVxeGrid` | `#/adapter/vxe-table`（勿直接从 @vben/plugins 导） |
| 表单 | `useVbenForm` + `z`（zod） | `#/adapter/form` |
| 图表 | `EchartsUI` + `useEcharts` | `@vben/plugins/echarts` |
| 富文本 | `VbenTiptap` / `VbenTiptapPreview` | `@vben/plugins/tiptap` |
| 错误页 | `Fallback`（403/404/500/offline） | `@vben/common-ui` |
| 工作台/分析页组件 | `Workbench*` / `AnalysisChartCard` 等 | `@vben/common-ui` |
| 远程数据下拉 | `ApiSelect/ApiTreeSelect/ApiCascader/ApiComponent` | `@vben/common-ui`（表单里用 component: 'ApiSelect'） |
| 按钮权限 | `v-access:code` / `useAccess().hasAccessByCodes` / `AccessControl` | `@vben/access` |
| token/权限码/菜单 | `useAccessStore` | `@vben/stores` |
| 用户信息/租户 | `useUserStore`（userInfo、searchTenant） | `@vben/stores` |
| 标签页操作 | `useTabs`；前端数组分页 `usePagination` | `@vben/hooks` |
| 树处理 | `mapTree/filterTree/sortTree/traverseTreeValues` | `@vben/utils` |
| 日期格式化 | `formatDate/formatDateTime`（dayjs+时区，勿再装 dayjs 封装） | `@vben/utils` |
| antd 弹层容器 | `getPopupContainer` | `@vben/utils` |
| class 合并/深浅拷贝/防抖 | `cn/cloneDeep/debounce/isEqual` | `@vben/utils` |
| 图标 | `IconifyIcon`（任意 iconify 名）、lucide 组件（Plus/Search…）、`createIconifyIcon` | `@vben/icons` |
| 通用类型 | `Recordable/Nullable/DeepPartial` | `@vben/types`（type-only） |
| 登录页/个人中心 | `AuthenticationLogin`、`Profile*` 系列 | `@vben/common-ui` |

## App 层（apps/web-antd/src/）

| 需求 | 用这个 | 位置 |
|---|---|---|
| HTTP 请求 | `requestClient`（token/刷新/租户头已带） | `#/api/request.ts` |
| 视频播放弹窗 | `VideoPlayModal`（setData(VideoPlayResult).open()） | `views/video/modules/`，play/proxy/push/dispatch 已复用 |
| Jessibuca 播放器 | `VideoJessibucaPlay` + `useJessibuca` | `#/components/Video` |
| WebRTC 播放/对讲 | `FsRtcPlay` | `#/components/Video` |
| IVR 流程图 | `IvrFlowChart`（@vue-flow） | `#/components/FlowChart/ivr` |
| bpmn 流程设计器 | Activiti 组件群（Modeler/Panel/BpmnActions） | `#/components/Activiti` |
| socket 实时通信 | `useInitSocket`/`useFsSocket` + namespace 插件 → 见 `socket-namespace` skill | `#/hooks/socket` |
| 系统参数/字典/行政区划缓存 | `useSystemStore` → 见 `system-dict` skill | `#/store/model/system.ts` |
| 文件下载/导出 | `openWindow/downloadByOnlineUrl/ByBase64/ByData` | `#/utils/file/download.ts` |
| base64/blob 互转 | `dataURLtoBlob/urlToBase64` | `#/utils/file/base64Conver.ts` |
| AES/MD5/SHA 加密 | `cipher.ts` 工厂（登录密码加密在用） | `#/utils/cipher.ts` |
| 事件总线 | `mitt`（全局）、`rootSocketEmitter`（socket 事件） | `#/utils/mitt.ts`、`#/hooks/socket/rootSocketEmitter.ts` |
| i18n | `$t()` + `langs/{zh-CN,en-US}/<模块>.json` | `#/locales`，规则见 `.github/instructions/i18n-access.instructions.md` |

## 相关 skill（按任务加载）

- 查组件 props/slots/API 方法详情 → `/ui-components`（组件参考手册，本表只列名字）
- 新建 CRUD 页面 → `/crud-page`
- 新建 API 文件 → `/api-wrapper`
- 新增 socket 实时功能 → `/socket-namespace`
- 视频播放/监控相关 → `/video-play`
- 字典/系统参数/区划数据 → `/system-dict`

## 硬规则

1. 新功能动手前先在本文件与 codegraph 里找现成实现；找到就复用或扩展，找不到才新写
2. 新写的可复用代码（组件/hook/util）完成后**必须回填到本文件对应表格**
3. 依赖版本一律 `catalog:`（pnpm-workspace.yaml），子包 package.json 勿写死版本；引入新依赖前先确认上表没有等价能力
