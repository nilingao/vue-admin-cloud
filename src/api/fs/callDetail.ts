import { defHttp } from '@/utils/http/axios';
import {
  CallDetailEntity,
  CallDetailParams,
  CallDetailPageResultModel,
} from './model/callDetailModel';

enum Api {
  // 通话详情分页
  page = '/webapi/fs/call_detail/page',
  // 通话详情详情
  detail = '/webapi/fs/call_detail/detail',
  // 通话详情保存
  save = '/webapi/fs/call_detail/save',
  // 通话详情删除
  remove = '/webapi/fs/call_detail/remove',
}

export function doCallDetailPage(params: CallDetailParams) {
  return defHttp.post<CallDetailPageResultModel>({
    url: Api.page,
    params,
  });
}

export function doCallDetailDetail(params: { id: number }) {
  return defHttp.get<CallDetailEntity>({
    url: Api.detail,
    params,
  });
}

export function doCallDetailSave(params: CallDetailEntity) {
  return defHttp.post({
    url: Api.save,
    params,
  });
}

export function doCallDetailRemove(params: { id: number }) {
  return defHttp.post({
    url: Api.remove,
    params,
  });
}
