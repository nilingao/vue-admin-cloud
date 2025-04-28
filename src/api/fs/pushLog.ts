import { defHttp } from '@/utils/http/axios';
import { PushLogEntity, PushLogParams, PushLogPageResultModel } from './model/pushLogModel';

enum Api {
  page = '/webapi/fs/push_log/page',
  detail = '/webapi/fs/push_log/detail',
  remove = '/webapi/fs/push_log/remove',
}

export function doPushLogPage(params: PushLogParams) {
  return defHttp.post<PushLogPageResultModel>({ url: Api.page, params });
}

export function doPushLogDetail(params: { id: number }) {
  return defHttp.get<PushLogEntity>({ url: Api.detail, params });
}

export function doPushLogRemove(params: { id: number }) {
  return defHttp.delete({ url: Api.remove, params });
}
