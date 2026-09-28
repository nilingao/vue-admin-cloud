---
name: system-dict
description: >
  使用后端字典、系统参数、行政区划数据：useSystemStore 已在登录时预加载并持久化，
  页面直接取 getter，禁止重复调接口。Use when rendering dictionary values, 字典翻译,
  下拉选项来自后端, 系统参数, 行政区划, 省市区, dictMap, systemConfig, areaList,
  or when a table column / form select needs backend enum data.
---

# 字典 / 系统参数 / 行政区划（useSystemStore）

数据在**登录时已预加载**（`store/core/auth.ts` 调 `getSystemConfigAction/getAreaListAction/getDictMapAction`）并 pinia persist 持久化。页面只读 getter，**不要再调 `getSystem/getAreaInfoList/doDictionaryItemMap` 接口**。

```ts
import { useSystemStore } from '#/store/model';
const systemStore = useSystemStore();
```

## 三类数据

| 数据 | getter | 结构 | 典型用法 |
|---|---|---|---|
| 后端字典 | `systemStore.getDictMap` | `Record<字典key, DictionaryItemEntity[]>` | 表格列翻译、下拉 options |
| 系统参数 | `systemStore.getSystemConfig(key)` | `string`（kv） | minio 路径等配置项 |
| 行政区划 | `systemStore.getAreaList` | `AreaEntity[]`（省市区树） | Cascader `options: systemStore.getAreaList`（见 tenant/data.ts） |

## 字典 key 常量

视频域字典 key 已定义在 `enums/commonEnum.ts`（`TRANSPORT_TYPE_ENUM`、`DEVICE_TYPE_ENUM`、`PTZ_TYPE_ENUM` 等）。取用：

```ts
systemStore.getDictMap[TRANSPORT_TYPE_ENUM] // DictionaryItemEntity[]
```

新业务域的字典 key **先加到 enums**，不要在页面里写字符串字面量。

## 表格/表单中翻译字典（参考 views/video/play/modules/data.ts）

- 列渲染：`CellTag` 的 `options` 传字典数组映射的 `{ color, label, value }`
- 表单下拉：schema 里 `component: 'Select'` + `componentProps.options` 由 dictMap 映射；远程搜索型用 `ApiSelect`
- 字典项字段以 `DictionaryItemEntity`（`api/sys/dictionary.ts`）为准，先 codegraph 查看

## 硬规则

- 需要刷新字典（管理端改了字典后）才调 `getDictMapAction()`，普通页面只读
- 字典缺失显示原值，不要抛错阻塞页面
