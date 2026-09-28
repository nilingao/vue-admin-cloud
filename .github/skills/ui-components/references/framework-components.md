# 框架层通用组件详解（@vben/common-ui）

导入统一 `import { X } from '@vben/common-ui';`

## 页面容器

### Page
页面外壳，CRUD 页标配。
- props：`title` `description` `autoContentHeight`（内容高=视口-头-底，配 Grid height:'auto'）`heightOffset` `contentClass` `headerClass` `footerClass` `footerFixed`
- slots：默认、`title` `description` `extra` `footer`

### ColPage
左右分栏（左树右表），继承 Page 全部 props。
- props：`leftWidth`(30) `rightWidth`(70) `leftMinWidth/leftMaxWidth/rightMinWidth/rightMaxWidth` `leftCollapsible/rightCollapsible` `leftCollapsedWidth/rightCollapsedWidth` `resizable` `splitLine` `splitHandle`

### Fallback
异常/占位页。
- props：`status`('403'|'404'|'500'|'coming-soon'|'offline') `title` `description` `image` `homePath`('/') `showBack`

## 弹窗 / 抽屉 / 命令式

### useVbenModal / useVbenDrawer
返回 `[组件, api]`。父子连接：父传 `connectedComponent: XxxModal`，子组件内再 `useVbenModal()` 共享同一 api。

api 方法：
| 方法 | 说明 |
|---|---|
| `open()` / `close()` | close 走 `onBeforeClose`，返回 false 阻止 |
| `setData(payload)` / `getData<T>()` | 父子传参 |
| `setState(partial\|fn)` | 动态改 title/confirmLoading 等 |
| `lock()` / `unlock()` | 提交锁定（禁取消+遮罩 spinner+确认 loading） |
| `useStore(selector?)` | 响应式订阅 |

Modal options：`title` `titleTooltip` `description` `isOpen` `confirmText/cancelText` `confirmLoading` `confirmDisabled` `showConfirmButton/showCancelButton` `footer/header` `centered` `fullscreen/fullscreenButton` `draggable` `destroyOnClose`(默认 true) `loading` `closeOnClickModal/closeOnPressEscape` `openAutoFocus` `overlayBlur` `zIndex` `animationType`('slide'/'scale') `appendToMain`；回调 `onConfirm/onCancel/onBeforeClose/onOpenChange/onOpened/onClosed`
Modal slots：默认、`title` `description` `footer` `prepend-footer` `center-footer` `append-footer`
Drawer 额外：`placement`('left'/'right'/'top'/'bottom'，默认 right)，无 fullscreen/draggable/centered

### 命令式弹窗
```ts
import { alert, confirm, prompt } from '@vben/common-ui';
await confirm({ content: '确认删除？', title: '提示' }); // 取消时 reject
const { value } = await prompt({ component: 'Input', title: '请输入' });
```
props：`content` `title` `icon`('error'/'info'/'question'/'success'/'warning' 或组件) `showCancel` `confirmText/cancelText` `beforeClose(scope)` `centered` `bordered`；prompt 增加 `component` `componentProps` `defaultValue`

## 表单（useVbenForm，经 #/adapter/form）

返回 `[Form, formApi]`。formApi 常用方法：
`getValues<T>()` `setValues(fields)` `setFieldValue(field, value)` `validate()` `validateField(name)` `submitForm()` `resetForm()` `resetValidate()` `setState(partial)` `updateSchema(schema[])` `removeSchemaByFields(fields)` `getFieldComponentRef(name)` `scrollToFirstError()` `useStore(selector)`

### VbenFormSchema 关键字段
- `fieldName`(必填) `component`(组件名字符串) `componentProps`(对象或 `(values, actions) => props`)
- `label` `defaultValue` `rules`(`'required'`/`'selectRequired'`/zod) `help` `description` `suffix`
- `dependencies`：`{ triggerFields: [], if/show/disabled/required/rules/componentProps }` 联动
- `hide` `renderComponentContent(value, api)`(组件内 slot) `valueFormat(value, setValue, values)`
- 布局：`formItemClass`(col-span-N) `wrapperClass` `labelWidth` `disabled`

### 表单级 VbenFormProps
`schema` `layout`('horizontal'/'vertical'/'inline') `wrapperClass`('grid-cols-N') `showCollapseButton` `collapsed/collapsedRows` `handleSubmit/handleReset/handleValuesChange` `submitOnChange` `submitOnEnter` `actionButtonsReverse` `showDefaultActions` `fieldMappingTime` `commonConfig` `scrollToFirstError`

## 表格（useVbenVxeGrid，经 #/adapter/vxe-table）

返回 `[Grid, gridApi]`。gridApi：
| 成员 | 说明 |
|---|---|
| `grid` | vxe 原生实例（`getCheckboxRecords` `commitProxy` `scrollTo` `reloadRow`…） |
| `formApi` | 搜索表单 api |
| `query(params?)` | 刷新（保留当前页） |
| `reload(params?)` | 刷新（回第一页） |
| `setGridOptions(options)` | 合并更新 columns/data 等 |
| `setLoading(bool)` / `setState(partial)` | loading / 任意 props |
| `toggleSearchForm(show?)` | 切换搜索表单 |
| `markRowAsViewed/isRowViewed/…` | 已读行（需配 viewedRowOptions） |

options：`gridOptions`（vxe 原生：columns/proxyConfig/pagerConfig/rowConfig/checkboxConfig/toolbarConfig/height）`gridEvents` `formOptions`（搜索表单）`showSearchForm` `tableTitle` `viewedRowOptions`
slots：`table-title` `toolbar-actions`(左) `toolbar-tools`(右) + vxe 原生 slots

单元格渲染器（adapter 注册，详见 vxe-grid-form.instructions.md）：`CellTag` `CellSwitch` `CellImage` `CellLink` `CellOperation`

## 远程数据组件

### ApiComponent
通用"接口驱动选项"包装器（ApiSelect 等的底层）。
- props：`component`(内部组件) `api` `params` `resultField` `labelField`('label') `valueField`('value') `childrenField` `disabledField` `immediate` `alwaysLoad` `beforeFetch/afterFetch` `autoSelect`('first'/'last'/'one'/fn/false)
- 表单中直接用注册名：`component: 'ApiSelect'`，componentProps 传 `api` 等

## 工作台 / 分析页 / 认证 / 个人中心

| 组件 | 关键 props |
|---|---|
| `WorkbenchHeader` | `avatar`；slots `title` `description` |
| `WorkbenchProject` | `title` `items`(icon/title/content/date/group/color/url)；emit click |
| `WorkbenchQuickNav` | `title` `items`(icon/title/color/url) |
| `WorkbenchTodo` | `title` `items`(title/content/date/completed) |
| `WorkbenchTrends` | `title` `items`(avatar/title/content/date) |
| `AnalysisChartCard` | `title`；默认 slot 放图表 |
| `AnalysisChartsTabs` | `tabs: TabOption[]` |
| `AnalysisOverview` | `items`(icon/title/totalTitle/totalValue/value) |
| `AuthenticationLogin` 系列 | `showCodeLogin/showQrcodeLogin/showRegister/showForgetPassword/showRememberMe/showThirdPartyLogin` `title/subTitle` `submitButtonText` `loading` |
| `Profile` | `userInfo` `tabs` `title` |
| `Profile*Setting` | `formSchema`(fieldName/label/value/description) |

## 工具组件

| 组件 | 关键 props |
|---|---|
| `CountTo` | `endVal`(必填) `startVal` `duration` `decimals` `separator` `prefix/suffix` `transition` |
| `VCropper` | `img`(必填) `aspectRatio`('1:1') `width`(500) `height`(400) |
| `EllipsisText` | `line`(1) `maxWidth` `expand` `tooltip` `tooltipWhenEllipsis` `placement` |
| `IconPicker` | `prefix`(图标集) `icons` `pageSize` `type`('icon'/'input') |
| `JsonViewer` | `value`(必填) `expandDepth` `copyable` `sort` `boxed` `theme` |
| `Loading` / `Spinner` | `spinning` `text`(仅 Loading) `minLoadingTime`；指令 `v-loading` |
| `Tippy` | `theme`('auto'/'dark'/'light') `animation` + tippy.js 全 props；指令 `v-tippy` |
| `Tree` | `treeData`(必填) `multiple` `checkStrictly` `autoCheckParent` `labelField/valueField/childrenField` `showIcon` `defaultExpandedKeys/Level` |
| `VResize` | 拖拽调整大小容器，`stickSize`(8) |

## 验证码

| 组件 | 关键 props |
|---|---|
| `SliderCaptcha` | `text` `successText`；emit `success/end`，actionType `resume()` |
| `SliderRotateCaptcha` | `src`(图) `diffDegree`(20) `imageSize`(260) |
| `SliderTranslateCaptcha` | `src` `canvasWidth`(420) `canvasHeight`(280) `squareLength`(42) |
| `PointSelectionCaptcha` | `captchaImage`(必填) `width/height` `title` `showConfirm` `hintImage/hintText` |

## 图表 / 富文本（@vben/plugins）

```ts
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
const chartRef = ref(); const { renderEcharts } = useEcharts(chartRef);
renderEcharts(options); // 内置暗色联动、resize 防抖
// <EchartsUI ref="chartRef" height="300px" />

import { VbenTiptap, VbenTiptapPreview } from '@vben/plugins/tiptap'; // 富文本
```
