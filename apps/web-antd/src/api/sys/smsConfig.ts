import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface SmsConfigEntity extends Recordable<any> {
  /** 账号 */
  account?: string;
  /** 余额 */
  balance?: number;
  /** 配置名称 */
  configName?: string;
  /** 编号 */
  id?: number | string;
  /** 是否启用 */
  isActive?: number | string;
  /** 密码 */
  password?: string;
  /** 签名 */
  sign?: string;
  /** 签名位置 */
  signPlace?: number | string;
  /** 短信类型 */
  smsType?: number | string;
  /** 更新时间 */
  updateTime?: string;
}

export type SmsConfigParams = Recordable<any>;

export type SmsConfigPageResultModel = Recordable<SmsConfigEntity>;

enum Api {
  /** 查询全部短信配置 */
  all = '/webapi/sms/sms_config/all',
  /** 短信配置详情 */
  detail = '/webapi/sms/sms_config/detail',
  /** 新增短信配置 */
  insert = '/webapi/sms/sms_config/insert',
  /** 短信配置分页 */
  page = '/webapi/sms/sms_config/page',
  /** 删除短信配置 */
  remove = '/webapi/sms/sms_config/remove',
  /** 修改短信配置 */
  update = '/webapi/sms/sms_config/update',
}

export function doSmsConfigAll() {
  return requestClient.get<SmsConfigEntity[]>(Api.all);
}

export function getSmsConfigPage(params: SmsConfigParams) {
  return requestClient.post<SmsConfigPageResultModel>(Api.page, params);
}

export function doSmsConfigInsert(params: SmsConfigEntity) {
  return requestClient.post(Api.insert, params);
}

export function doSmsConfigUpdate(params: SmsConfigEntity) {
  return requestClient.post(Api.update, params);
}

export function doSmsConfigRemove(params: Pick<SmsConfigEntity, 'id'>) {
  return requestClient.get(Api.remove, { params });
}

export function doSmsConfigDetail(params: Pick<SmsConfigEntity, 'id'>) {
  return requestClient.get<SmsConfigEntity>(Api.detail, { params });
}
