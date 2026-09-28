---
description: "Use when writing or modifying CRUD pages, VxeGrid tables, VbenForm schemas, data.ts files, table cell renderers, or the adapter layer in apps/web-antd. Covers useVbenVxeGrid, VbenFormSchema, CellOperation/CellTag/CellSwitch, zod rules, registered form components."
applyTo: ["apps/web-antd/src/views/**", "apps/web-antd/src/adapter/**"]
---

# Adapter 层用法（VbenForm / VxeGrid）

页面只从 `#/adapter/*` 导入，**不要**直接从 `@vben/plugins/vxe-table`、`@vben/common-ui` 导入表格/表单 API。

```ts
import type { OnActionClickParams, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { VbenFormSchema } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useVbenForm, z } from '#/adapter/form';
```

## 表格（useVbenVxeGrid）

返回 `[Grid, gridApi]`。标准配置（照抄，勿增删）：

```ts
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: { schema: useGridFormSchema(), submitOnChange: false },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    rowConfig: { keyField: 'id' },
    proxyConfig: { ajax: { query: async (formValues) => (await doXxxPage({ ...formValues })).items } },
    toolbarConfig: { custom: true, export: false, refresh: true, search: true, zoom: true },
    // 二选一：分页列表用 pagerConfig，树形用 treeConfig（参考 position/index.vue）
  } as VxeTableGridOptions,
});
```

- 刷新：`gridApi.query()`；模板插槽：`#table-title`、`#toolbar-actions`、`#toolbar-tools`
- 行操作统一走 `onActionClick({ code, row }: OnActionClickParams<T>)` + switch 分发

## 单元格渲染器（cellRender.name，注册于 adapter/vxe-table.ts）

| 名称 | 用途 | 关键参数 |
|---|---|---|
| `CellTag` | 状态标签 | 默认 1=启用/0=禁用；自定义传 `options: [{ color, label, value }]` |
| `CellSwitch` | 行内开关 | `attrs.beforeChange(newVal, row)` 返回 false 阻止变更 |
| `CellImage` / `CellLink` | 图片 / 链接按钮 | `props` 透传 |
| `CellOperation` | 操作列 | `options: [{ code, text?, show? }]`，预设 `edit/detail/delete`；`show: () => hasAccessByCodes(['模块.实体:update'])`；`attrs.onClick` 接 onActionClick |

## 表单 schema（VbenFormSchema）

- `component` 只能取已注册组件名（`adapter/component/index.ts` 的 `ComponentType`）：
  `Input` `InputNumber` `InputPassword` `Textarea` `Select` `ApiSelect` `ApiTreeSelect` `ApiCascader` `Cascader` `TreeSelect` `RadioGroup` `CheckboxGroup` `Switch` `Checkbox` `Radio` `DatePicker` `RangePicker` `TimePicker` `Rate` `Mentions` `AutoComplete` `Upload` `IconPicker` `Divider` `Space` `DefaultButton` `PrimaryButton`
- `Checkbox/Radio/Switch` 的 v-model 是 `checked`，`Upload` 是 `fileList`（adapter 已处理，componentProps 勿再传 value）
- Api 系组件传 `api: async () => ...` 远程数据；树形传 `childrenField: 'children'`
- 校验用 zod：`rules: z.string().min(2, $t('ui.formRules.minLength', [$t('key'), 2]))`；必填快捷规则 `'required'` / `'selectRequired'`（已国际化）

## 其他硬约定

- 弹窗用 `useVbenModal({ connectedComponent, destroyOnClose: true })`，`formModalApi.setData(row).open()` 传数据，成功后 `emit('success')` → 父页 `gridApi.query()`
- 修改 adapter 层时：新注册表单组件必须同步 `adapter/component/index.ts` 的 `ComponentType` 联合类型与 `ComponentPropsMap` 接口（一一对应，否则 schema 无类型提示）；新单元格渲染器在 `adapter/vxe-table.ts` 用 `vxeUI.renderer.add('CellXxx', ...)` 注册
- 完整范例：`views/index/system/position/`（结构）、`views/index/system/menu/`（i18n + zod）
- i18n 与权限约定见 `.github/instructions/i18n-access.instructions.md`
