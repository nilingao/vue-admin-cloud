# App 层业务组件（apps/web-antd/src/components/）

共 3 个域：Video（播放器）、FlowChart（IVR 流程图）、Activiti（bpmn 设计器），另有 views/video/modules 的跨页共享组件。

## 一、Video（#/components/Video）

桶导出：`import { FsRtcPlay, VideoJessibucaPlay } from '#/components/Video';`

### VideoJessibucaPlay.vue
Jessibuca（wasm/MSE）流媒体播放器，自带控制条（播放/停止/静音/截图/刷新/全屏/码率）。
- props：`videoUrl?: string`（变化自动 destroy+play）、`hasAudio?: boolean`(false)、`options?: Record<string, any>`（透传 Jessibuca 配置）
- expose：`play(url?)`、`destroy()`
- 使用方：VideoPlayModal、video/dispatch（分屏多实例）、video/play/record（录像回放）
- 依赖 `public/script/jessibuca/`（jessibuca.js + decoder.js），勿另引播放器库

### useJessibuca.ts（底层，一般不直接用）
`useJessibuca(container: Ref<HTMLElement>, props: JessibucaProps)` → `{ play, pause, destroy, refresh, screenshot, onMute, fullscreenSwitch, stats }`；stats: `{ destroy, fullscreen, isMute, kBps, performance, playing }`。内置脚本懒加载（单例）、ResizeObserver、心跳/超时自动重连 3 次。

### FsRtcPlay.vue
FreeSWITCH WebRTC 播放/对讲（`<video>`）。
- props：`muted?: boolean`(true)、`sendSdpApi?: (sdp) => Promise<any>`（SDP 交换接口）
- expose：`call(pushStats)`（`{ audioEnable, videoEnable, useDtmf, useCamera, recvSdp, recvOnly }`）、`destroy()`、`sendDtmf(msg)`、`success`(ref)
- 使用方：views/fs/call（软电话），配合 socket AGENT 事件（见 socket-namespace skill）
- 底层 useFsRtc 加载 `public/script/freeswitch/FSRTCClient.js`；SDP 交换失败且"流不存在"时 100ms 自动重试

## 二、跨页共享：views/video/modules/

### VideoPlayModal.vue（⭐ 视频页首选，勿重造播放弹窗）
播放弹窗：左侧播放器+流地址切换/复制，右侧云台 PTZ+流信息轮询。
- **无 props**；数据经 `modalApi.setData<VideoPlayResult>()` 传入：

```ts
const [PlayModal, playModalApi] = useVbenModal({ connectedComponent: VideoPlayModal, destroyOnClose: true });
const data = await doProxyGetPlayUrl({ id: row.id });
playModalApi.setData(data).open();
```

- 内部已处理：buildVideoPlayOptions 多协议地址（token 优先 `data.auth || data.token || accessToken`，默认 wsFlv）、云台 `doPtzPtz/Focus/Iris`（mousedown 发命令/mouseup 停）、`doMediaInfo` 2s 轮询、关闭时 destroy
- 使用方：video/play/channel、video/proxy、video/push

### video-play-url.ts（有单测）
- `buildVideoPlayUrl(url?, token?)`：拼 token 参数
- `buildVideoPlayOptions(data?: VideoPlayResult, fallbackToken?)`：按 sslStatus 选 https/wss，返回 `{ streamMap, zlmRtcUrl }`
- `getDefaultStreamPlayType(streamMap)`：优先 wsFlv
- `type StreamPlayType = 'flv'|'ts'|'wsFlv'|'wsTs'`
- ⚠️ 禁止自己拼播放 URL，一律走这里

## 三、FlowChart（#/components/FlowChart，基于 @vue-flow/core）

### IvrFlowChart.vue（桶导出 `import { IvrFlowChart } from '#/components/FlowChart'`）
IVR 流程图画布：VueFlow + 网格背景 + 统计面板 + 数据预览。
- props：`data?: { nodes?: Node[]; edges?: Edge[] }`（deep watch 自动 setNodes+fitView；START_NODE 不可删）、`toolbar?: boolean`(true)、`vueFlowId?: string`('ivr-flow-chart'，多实例必须区分)
- 连线规则：禁同节点/同方向/同 sourceHandle 重复；新边 type 固定 `button_edge`
- 使用方：views/fs/logic_flow（数据来自同目录 data.ts）

### 节点体系（components/node/）
- `NodeTypeEnum`：CONDITION/DIGITS/HANGUP/PLAYBACK/START/TRANSFER，`NodeInstanceMap` 映射组件，经 `#node-XXX` 插槽渲染
- 六个业务节点 props 统一 `{ id: string; data: NodeData }`，配置写回 `useVueFlow().updateNode`：
  - StartNode（全局变量展示）、HangupNode（无出口）、PlaybackNode（playType 1语音文件/2TTS）、DigitsNode（收号+DTMF 设置，经 DigitsSettingModal）、TransferNode（五种 routeType：GROUP/AGENT/EXTERNAL/VDN/IVR）、ConditionNode（IF/ELSE IF/ELSE 分支，每分支独立 source handle）
- 基础件：`DefaultNode`（卡片外壳：nodeId/nodeLabel/nodeIcon/nodeWidth(300)/isTarget/isSource/isOperate，emit `cope`）、`NodeContext`（分区容器）、`NodeVariable`（变量列表+复制）、`DigitsSettingModal`（收号设置弹窗）
- 边：`ButtonEdge`（贝塞尔+中心删除按钮 ButtonMarker）
- 工具栏：`IvrFlowChartToolbar`（fitView/randomView/resetZoom/viewData/zoomIn/zoomOut）
- 类型/常量在 `ivr/types.ts`：`NodeData{config,label,nodeData,nodeId,type}`、`Branch{checkId,condition,conditions,id,type}`、`branchConditionOptions`(16 种比较符)、`playTypeOptions`、`transferTypeOptions`
- ⚠️ `skillOptions/agentOptions/playbackOptions` 是写死的演示数据，未接后端

## 四、Activiti（#/components/Activiti，bpmn-js 流程设计器）

架构：`Modeler`(画布) + `Panel`(属性面板) + `BpmnActions`(工具条) 共享模块级单例 `BpmnStore`；面板字段由 `Bpmn/config/` 声明式配置驱动，经 `DynamicBinder` 动态渲染。**唯一消费方：views/oa/deploy**。

### 三件套用法
```vue
<BpmnModeler :xml="xml" />          <!-- watch 到非空即 importXML -->
<BpmnPanel />                        <!-- 按选中元素渲染分组表单 -->
<BpmnActions ref="bpmnActions" />    <!-- 导入/导出SVG/导出XML/缩放/预览/撤销 -->
<!-- 部署：const { id, name, xml } = await bpmnActions.value.getXml() -->
```

### BpmnStore（Bpmn/store.ts，模块级单例，⚠️ 同页只能一个 Modeler）
`initModeler/importXML/getXML/getSVG/getModeler/getModeling/getShapeById/getBusinessObject/getActiveElement/createElement/addEventListener/updateExtensionElements/refresh`；state：`{ activeElement, businessObject, isActive, activeBindDefine }`

### 面板配置（Bpmn/config/）
- `index.ts`：`import.meta.glob('./modules/*.tsx')` 自动聚合 → 按 bpmn 元素类型注册分组
- `common.tsx`：共享字段组（基础 id/name、文档、监听器 SubList、扩展属性、表单 formKey+FormProperty）
- `modules/`：Task（含回路特性+UserTask 人员设置 assignee/candidateUsers/collection）、Process、Flow（流转条件）、Event、Gateway、Other
- 新增 bpmn 元素面板 = 在 modules/ 加一个 tsx 默认导出 GroupProperties[]，自动生效

### 子组件
- `DynamicBinder`：声明式字段渲染器。props：`fieldDefine`、`value`(businessObject)、`bindTransformer`；emits `fieldChange(key, value)`。⚠️ `ScriptHelper.executeEl` 是空桩，predicate 只用函数形式
- `PrefixLabelSelect`：带前置标签的远程搜索 Select（`isApi/api/params/searchName('name')/labelField/valueField`，300ms 防抖，响应兼容 items/records/list/data）
- `PrefixLabelLinkageSelect`：双 Select 联动（用户/角色/部门维度 → `doUserSelect/doRoleSelect/doDepartmentSelect`），value 序列化为 `${assignments.resolve(execution,'[...]')}` 表达式
- `PrefixLabelNumBer`：带前置标签 InputNumber
- `SubList`：可编辑子表格。props：`columns`(title/dataIndex/editRow/editComponent('Input'|'Select')/editComponentProps/customRender)、`value`、`model`(新增行模板)、`addTitle`；emit `update:value`；自带删除操作列
- i18n：`getI18nTranslate('zh')` + `activiti-moddel.json`（moddle 扩展）+ `defaultBpmnXml.ts`（空白模板 `createDefaultBpmnXml(key, name)`）
