import { defHttp } from '@/utils/http/axios';
import { CallLogEntity, CallLogParams, CallLogPageResultModel } from './model/callLogModel';

enum Api {
  page = '/webapi/fs/call_log/page',
  detail = '/webapi/fs/call_log/detail',
  save = '/webapi/fs/call_log/save',
  remove = '/webapi/fs/call_log/remove',
}

export function doCallLogPage(params: CallLogParams) {
  return defHttp.post<CallLogPageResultModel>({ url: Api.page, params });
}

export function doCallLogDetail(params: { id: number }) {
  return defHttp.get<CallLogEntity>({ url: Api.detail, params });
}

export function doCallLogSave(params: CallLogEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doCallLogRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
