import { defHttp } from '@/utils/http/axios';
import { GroupEntity, GroupParams, GroupPageResultModel } from './model/groupModel';

enum Api {
  page = '/webapi/fs/group/page',
  detail = '/webapi/fs/group/detail',
  save = '/webapi/fs/group/save',
  remove = '/webapi/fs/group/remove',
}

export function doGroupPage(params: GroupParams) {
  return defHttp.post<GroupPageResultModel>({ url: Api.page, params });
}

export function doGroupDetail(params: { id: number }) {
  return defHttp.get<GroupEntity>({ url: Api.detail, params });
}

export function doGroupSave(params: GroupEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doGroupRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
