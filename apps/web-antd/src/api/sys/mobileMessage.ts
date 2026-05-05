import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface MobileMessageEntity extends Recordable<any> {
  /** 创建时间 */
  createTime?: string;
  /** 短信内容 */
  content?: string;
  /** 操作时间 */
  handleTime?: string;
  /** 编号 */
  id?: number | string;
  /** 手机号 */
  mobile?: string;
  /** 状态：1 未发，2 成功，其它失败 */
  status?: number | string;
  /** 短信类型 */
  type?: number | string;
}

export type MobileMessageParams = Recordable<any>;

export type MobileMessagePageResultModel = Recordable<MobileMessageEntity>;

enum Api {
  /** 发送短信详情 */
  detail = '/webapi/sms/mobile_message/detail',
  /** 发送短信分页 */
  page = '/webapi/sms/mobile_message/page',
}

export function getMobileMessagePage(params: MobileMessageParams) {
  return requestClient.post<MobileMessagePageResultModel>(Api.page, params);
}

export function doMobileMessageDetail(params: Pick<MobileMessageEntity, 'id'>) {
  return requestClient.get<MobileMessageEntity>(Api.detail, { params });
}
