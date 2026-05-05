import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface MobileMessageTemplateEntity extends Recordable<any> {
  /** 唯一编码 */
  code?: string;
  /** 短信配置编号 */
  configId?: number | string;
  /** 内容 */
  content?: string;
  /** 编号 */
  id?: number | string;
  /** 是否启用 */
  isEnable?: number | string;
  /** 排序号 */
  num?: number | string;
  /** 接收人 */
  receiver?: string;
  /** 标题 */
  title?: string;
  /** 类型 */
  type?: number | string;
  /** 变量 */
  variable?: string;
}

export type MobileMessageTemplateParams = Recordable<any>;

export type MobileMessageTemplatePageResultModel =
  Recordable<MobileMessageTemplateEntity>;

enum Api {
  /** 短信配置模板详情 */
  detail = '/webapi/sms/mobile_message_template/detail',
  /** 新增短信配置模板 */
  insert = '/webapi/sms/mobile_message_template/insert',
  /** 短信配置模板分页 */
  page = '/webapi/sms/mobile_message_template/page',
  /** 删除短信配置模板 */
  remove = '/webapi/sms/mobile_message_template/remove',
  /** 修改短信配置模板 */
  update = '/webapi/sms/mobile_message_template/update',
}

export function getMobileMessageTemplatePage(
  params: MobileMessageTemplateParams,
) {
  return requestClient.post<MobileMessageTemplatePageResultModel>(
    Api.page,
    params,
  );
}

export function doMobileMessageTemplateInsert(
  params: MobileMessageTemplateEntity,
) {
  return requestClient.post(Api.insert, params);
}

export function doMobileMessageTemplateUpdate(
  params: MobileMessageTemplateEntity,
) {
  return requestClient.post(Api.update, params);
}

export function doMobileMessageTemplateRemove(
  params: Pick<MobileMessageTemplateEntity, 'id'>,
) {
  return requestClient.get(Api.remove, { params });
}

export function doMobileMessageTemplateDetail(
  params: Pick<MobileMessageTemplateEntity, 'id'>,
) {
  return requestClient.get<MobileMessageTemplateEntity>(Api.detail, {
    params,
  });
}
