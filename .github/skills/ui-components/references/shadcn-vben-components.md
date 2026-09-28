# shadcn-ui 原子件 + Vben* 组件（@vben-core/shadcn-ui）

大部分 Vben\* 组件已从 `@vben/common-ui` re-export，**优先从 common-ui 导入**；未 re-export 的（如 `VbenSegmented`）才从 `@vben-core/shadcn-ui`。

## ui/ 原子组件（reka-ui + shadcn 风格，组合式子组件）

| 组件族 | 导出 |
|---|---|
| Accordion | `Accordion/Item/Trigger/Content` |
| AlertDialog | `AlertDialog` + `Trigger/Content/Header/Footer/Title/Description/Action/Cancel` |
| Avatar | `Avatar/AvatarImage/AvatarFallback` |
| Badge | `Badge`（variant: default/secondary/destructive/outline）+ `badgeVariants` |
| Breadcrumb | `Breadcrumb` + `Item/Link/List/Page/Separator/Ellipsis` |
| Button | `Button` + `buttonVariants`（size: default/sm/lg/icon/xs；variant: default/destructive/ghost/heavy/icon/link/outline/secondary） |
| Card | `Card` + `Header/Title/Description/Content/Footer/Action` |
| Checkbox | `Checkbox` |
| ContextMenu | `ContextMenu` + 全套子组件 |
| Dialog | `Dialog` + `Trigger/Content/Header/Footer/Title/Description/Close/Overlay` |
| DropdownMenu | `DropdownMenu` + 全套子组件 |
| Form | `FormItem/FormLabel/FormControl/FormDescription/FormMessage`（vee-validate） |
| HoverCard | `HoverCard/Trigger/Content` |
| Input 系 | `Input` `Textarea` `Label` |
| NumberField | `NumberField` + `Input/Content/Increment/Decrement` |
| Pagination | `Pagination` + `Content/Item/First/Last/Next/Previous/Ellipsis` |
| PinInput | `PinInput/Group/Slot/Separator` |
| Popover | `Popover/Trigger/Content/Anchor` |
| RadioGroup | `RadioGroup/RadioGroupItem` |
| Resizable | `ResizablePanelGroup/Panel/Handle` |
| ScrollArea | `ScrollArea/ScrollBar` |
| Select | `Select` + `Trigger/Content/Item/ItemText/Group/Label/Separator/Value` |
| Separator | `Separator` |
| Sheet | `Sheet` + `Trigger/Content/Header/Footer/Title/Description/Close`（侧滑） |
| Switch | `Switch` |
| Tabs | `Tabs/TabsList/TabsTrigger/TabsContent/TabsIndicator` |
| Toggle | `Toggle/ToggleGroup/ToggleGroupItem` |
| Tooltip | `Tooltip/Trigger/Content/Provider` |
| Tree | `VbenTree` |

> 注意：业务页面里 antd 组件（Button/Select/Table…）从 `ant-design-vue` 导入；shadcn 原子件主要用于框架内部与自定义场景，两者不要混用在同一表单。

## components/ Vben* 组件

| 组件 | 用途 | 关键 props |
|---|---|---|
| `VbenButton` | 增强按钮 | `loading` `disabled` `size` `variant` `as/asChild` |
| `VbenIconButton` | 图标按钮（自带 tooltip） | `tooltip` `tooltipSide` `variant`(ghost)；默认 slot 放图标 |
| `VbenButtonGroup` | 按钮式单/多选组 | `options`(label/value) `multiple` `maxCount` `allowClear` `beforeChange` `size` |
| `VbenCheckButtonGroup` | check 风格按钮组 | 同上 |
| `VbenAvatar` | 头像（在线状态点） | `src` `alt` `size` `dot` `dotClass` `fit` |
| `VbenScrollbar` | 自定义滚动条容器 | `horizontal` `shadow` `scrollBarClass` |
| `VbenContextMenu` | 右键菜单 | `items`(key/text/icon/handler/disabled/hidden/separator/shortcut) |
| `VbenDropdownMenu` | 下拉菜单 | `menus`(label/value/icon/handler/disabled/separator) |
| `VbenDropdownRadioMenu` | 单选下拉（带选中态） | 同上 |
| `VbenDescriptions` / `Item` | 描述列表（详情） | `items`(label/content/span) `column` `bordered` `colon` `layout`('horizontal'/'vertical') `size` `title` `extra` |
| `VbenTableAction` | 表格行操作组（权限过滤+更多下拉+气泡确认） | `actions`(text/icon/onClick/auth/ifShow/disabled/danger/tooltip/popConfirm) `dropdownActions` `divider` `moreText` |
| `VbenCountToAnimator` | 数字滚动（简版） | `startVal` `endVal` `duration` `decimals` `prefix/suffix` `transition` `autoplay` |
| `VbenFullScreen` | 全屏切换按钮 | 无 |
| `VbenLogo` | 系统 Logo | `collapsed` `logoMode`('icon'/'full') `href` |
| `VbenSelect` | 简单下拉 | `options`(label/value) `allowClear` `placeholder`；v-model |
| `VbenSegmented` | 分段控制器（⚠️ 仅 @vben-core/shadcn-ui） | `tabs`(label/value) `defaultValue`；v-model |
| `VbenIcon` | 图标渲染（组件/iconify 名/URL 三态） | `icon` `fallback` |
| `VbenLoading` / `VbenSpinner` | 全局加载 | `spinning` `text`(仅 Loading) |
| `VbenInputPassword` | 密码输入（可见切换+强度条） | `passwordStrength`；v-model |
| `VbenPinInput` | 验证码分格输入 | `codeLength` `handleSendCode` `createText(countdown)` `maxTime` |
| `VbenTooltip` | 提示气泡 | `side` `delayDuration` `contentClass`；slots `trigger`+默认 |
| `VbenHelpTooltip` | 问号帮助提示 | `triggerClass` |
| `VbenPopover` | 弹出层 | `contentClass` `contentProps` `triggerClass` |
| `VbenHoverCard` | 悬停卡片 | `contentClass` `contentProps` |
| `VbenCollapsible` | 折叠面板 | `open`(v-model) `showTrigger` |
| `VbenCollapsibleParams` | 可折叠参数面板 | `params`(key/description/option/defaultValue) `visibleCount` `maxHeight` |
| `VbenCheckbox` | 复选框（半选） | `indeterminate` |
| `VbenBreadcrumbView` | 面包屑 | `breadcrumbs` `showIcon` `styleType` |
| `VbenBackTop` | 回到顶部 | `target` `visibilityHeight`(200) `bottom/right` |
| `VbenExpandableArrow` | 展开/收起箭头 | v-model:collapsed |
| `VbenSpineText` | 流光文字动画 | `animationDuration` |
| `VbenRenderContent` | 渲染 content（字符串/组件/函数） | `content` `renderBr` |

## 图标（@vben/icons）

```ts
import { IconifyIcon, createIconifyIcon, Plus, Search } from '@vben/icons';
// <IconifyIcon icon="ant-design:setting-outlined" />  任意 iconify 名
// <Plus />  预置 lucide 组件
// const MyIcon = createIconifyIcon('mdi:home');
```
