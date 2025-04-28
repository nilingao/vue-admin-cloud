import { defHttp } from '@/utils/http/axios';
import { CallDtmfEntity, CallDtmfParams, CallDtmfPageResultModel } from './model/callDtmfModel';

enum Api {
  // 通话按键分页
  page = '/webapi/fs/call_dtmf/page',
  // 通话按键详情
  detail = '/webapi/fs/call_dtmf/detail',
  // 通话按键保存
  save = '/webapi/fs/call_dtmf/save',
  // 通话按键删除
  remove = '/webapi/fs/call_dtmf/remove',
}

export function doCallDtmfPage(params: CallDtmfParams) {
  return defHttp.post<CallDtmfPageResultModel>({
    url: Api.page,
    params,
  });
}

export function doCallDtmfDetail(params: { id: number }) {
  return defHttp.get<CallDtmfEntity>({
    url: Api.detail,
    params,
  });
}

export function doCallDtmfSave(params: CallDtmfEntity) {
  return defHttp.post({
    url: Api.save,
    params,
  });
}

export function doCallDtmfRemove(params: { id: number }) {
  return defHttp.post({
    url: Api.remove,
    params,
  });
}
