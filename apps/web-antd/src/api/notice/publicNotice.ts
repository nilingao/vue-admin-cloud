import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 平台通知公告
 */
export interface PublicNoticeEntity extends Recordable<any> {
  /** 公告开始时间 */
  beginTime?: string;
  /** 公告内容 */
  content?: string;
  /** 创建时间 */
  createTime?: string;
  /** 公告结束时间 */
  endTime?: string;
  /** 编号 */
  id?: number | string;
  /** 是否已读 */
  readNotice?: number | string;
  /** 状态 */
  status?: number | string;
  /** 标题 */
  title?: string;
  /** 通知类型 */
  noticeType?: number | string;
}

export type PublicNoticeParams = Recordable<any>;

export type PublicNoticePageResultModel = Recordable<PublicNoticeEntity>;

enum Api {
  /** 平台通知公告详情 */
  detail = '/webapi/notice/public_notice/detail',
  /** 新增平台通知公告 */
  insert = '/webapi/notice/public_notice/insert',
  /** 平台通知公告分页 */
  page = '/webapi/notice/public_notice/page',
  /** 删除平台通知公告 */
  remove = '/webapi/notice/public_notice/remove',
  /** 修改平台通知公告 */
  update = '/webapi/notice/public_notice/update',
  /** 用户查看公告详情并标记已读 */
  userReadNoticeDetail = '/webapi/notice/public_notice/user_read_notice_detail',
  /** 用户公告分页 */
  userPage = '/webapi/notice/public_notice/user_page',
}

export function getPublicNoticePage(params: PublicNoticeParams) {
  return requestClient.post<PublicNoticePageResultModel>(Api.page, params);
}

export function getUserPublicNoticePage(params: PublicNoticeParams) {
  return requestClient.post<PublicNoticePageResultModel>(Api.userPage, params);
}

export function doPublicNoticeInsert(params: PublicNoticeEntity) {
  return requestClient.post(Api.insert, params);
}

export function doPublicNoticeUpdate(params: PublicNoticeEntity) {
  return requestClient.post(Api.update, params);
}

export function doPublicNoticeRemove(params: Pick<PublicNoticeEntity, 'id'>) {
  return requestClient.get(Api.remove, { params });
}

export function doPublicNoticeDetail(params: Pick<PublicNoticeEntity, 'id'>) {
  return requestClient.get<PublicNoticeEntity>(Api.detail, { params });
}

export function doUserReadNoticeDetail(params: Pick<PublicNoticeEntity, 'id'>) {
  return requestClient.get<PublicNoticeEntity>(Api.userReadNoticeDetail, {
    params,
  });
}
