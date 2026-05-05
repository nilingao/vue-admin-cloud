import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 系统配置
 */
export interface ConfigEntity {
  /** 配置名称 */
  configName: string;
  /** 配置键 */
  k: string;
  /** 配置值 */
  v: string;
}

export type ConfigParams = Recordable<any>;

export type ConfigPageResultModel = Recordable<ConfigEntity>;

enum Api {
  /** 查询全部系统配置 */
  all = '/webapi/config/config/all',
  /** 查询系统配置详情 */
  detail = '/webapi/config/config/detail',
  /** 获取系统配置分页 */
  page = '/webapi/config/config/page',
  /** 修改系统配置 */
  update = '/webapi/config/config/update',
}

export function doConfigPage(params: ConfigParams) {
  return requestClient.post<ConfigPageResultModel>(Api.page, params);
}

export function doConfigAll() {
  return requestClient.get<ConfigEntity[]>(Api.all);
}

export function doConfigUpdate(params: ConfigEntity) {
  return requestClient.post(Api.update, params);
}

export function doConfigDetail(params: Pick<ConfigEntity, 'k'>) {
  return requestClient.get<ConfigEntity>(Api.detail, { params });
}
