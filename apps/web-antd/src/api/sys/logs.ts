import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface LogsEntity extends Recordable<any> {
  /** 访问接口 */
  api?: string;
  /** 访问时间 */
  createTime?: string;
  /** 持续时间 */
  duration?: number;
  /** 持续时间结束 */
  durationEnd?: number;
  /** 持续时间开始 */
  durationStart?: number;
  /** 编号 */
  id?: number | string;
  /** 访问者 ip */
  ip?: string;
  /** ip 归属地 */
  ipAttribution?: string;
  /** 请求方式 */
  method?: string;
  /** 请求参数 */
  param?: string;
  /** 响应参数 */
  result?: string;
  /** 日志类型：0 其他，1 登录，2 新增，3 修改，4 删除 */
  type?: number | string;
}

export type LogsParams = Recordable<any>;

export type LogsPageResultModel = Recordable<LogsEntity>;

enum Api {
  /** 日志详情 */
  detail = '/webapi/config/logs/detail',
  /** 日志分页 */
  page = '/webapi/config/logs/page',
}

export function doLogsPage(params: LogsParams) {
  return requestClient.post<LogsPageResultModel>(Api.page, params);
}

export function doLogsDetail(params: Pick<LogsEntity, 'id'>) {
  return requestClient.get<LogsEntity>(Api.detail, { params });
}
