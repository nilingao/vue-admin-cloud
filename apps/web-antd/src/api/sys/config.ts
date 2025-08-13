import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * @description: 系统设置信息
 */
export interface ConfigEntity {
  // 编码
  k: string;
  // 值
  v: string;
  // 设置名称
  configName: string;
}

/**
 * 查询参数类型
 */
export type ConfigParams = Recordable<any>;

export type ConfigPageResultModel = Recordable<ConfigEntity>;

enum Api {
  // 查询系统设置
  all = '/webapi/config/config/all',
  // 保存系统设置
  detail = '/webapi/config/config/detail',
  // 获取系统设置分页
  page = '/webapi/config/config/page',
  // 保存系统设置
  update = '/webapi/config/config/update',
}
export function doConfigPage(params: ConfigParams) {
  return requestClient.post<ConfigPageResultModel>(Api.page, params);
}

export function doConfigAll() {
  return requestClient.get(Api.all);
}

export function doConfigUpdate(params: ConfigEntity) {
  return requestClient.post(Api.update, params);
}

export function doConfigDetail(params: Recordable<any>) {
  return requestClient.get(Api.detail, { params });
}
