---
name: api-wrapper
description: >
  按项目约定生成 apps/web-antd/src/api 下的接口文件（typed wrapper + enum Api +
  requestClient）。Use when creating or modifying API files, adding backend endpoints,
  接口封装, api wrapper, "加个接口", "对接后端", or when a new page needs its api/<域>/<实体>.ts.
---

# API Wrapper 生成

## 前置

1. 域目录从调用方页面路径推断：`views/index/system/*` → `api/sys`，`views/oa|work/*` → `api/oa`，`views/video/*` → `api/video`，`views/fs/*` 无独立域（复用 sys/oa），公告 → `api/notice`；推断不出时问用户
2. 缺接口 URL、请求方式、字段时**先问用户**，不要臆造
3. 先 `codegraph_explore` 看同域现有文件，实体名/函数名风格保持一致

## 文件模板（照抄结构，范例 `api/sys/position.ts`）

```ts
import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

/** @description: <实体>信息 */
export interface XxxEntity extends Recordable<any> {
  id: number;
  // 字段逐个中文行注释
}

export type XxxParams = Recordable<any>;
export type XxxPageResultModel = Recordable<XxxEntity>;

enum Api {
  // 每个 URL 一行中文注释，按字母序
  detail = '/webapi/bean/xxx/detail',
  page = '/webapi/bean/xxx/page',
  remove = '/webapi/bean/xxx/remove',
  save = '/webapi/bean/xxx/save',
}

export function doXxxPage(params: Recordable<any>) {
  return requestClient.post<XxxPageResultModel>(Api.page, params);
}

export function doXxxSave(params: Recordable<any>) {
  return requestClient.post(Api.save, params);
}

export function doXxxRemove(params: Recordable<any>) {
  return requestClient.get(Api.remove, { params });
}

export function doXxxDetail(params: Recordable<any>) {
  return requestClient.get<XxxEntity>(Api.detail, { params });
}
```

## 命名约定（全项目一致，勿自创）

- URL 前缀：`/webapi/bean/*`（核心业务）、`/webapi/config/*`（配置类）、`/webapi/sms|oa|activiti|video|notice/*`（对应域）
- 函数名：`do<实体><动作>`；分页 `do*Page`（POST）、保存 `do*Save` 或 `do*Insert/do*Update`、删除 `do*Remove`、详情 `do*Detail`、树 `do*Tree`、下拉 `do*Select`
- 类型：实体 `<X>Entity extends Recordable<any>`，分页结果 `<X>PageResultModel`
- 只用 `requestClient`（已带 token、刷新重认证、租户头 schemasTenantId）；**禁止**直接 import axios 或新建实例
- 文件加入 `api/<域>` 后，若该域有 index.ts 汇总导出则同步补充

## 完成后

- 运行 `pnpm check:type` 验证
- 若同时在建页面，回到 `/crud-page` 流程
