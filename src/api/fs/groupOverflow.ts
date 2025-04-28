import { defHttp } from '@/utils/http/axios';
import {
  GroupOverflowEntity,
  GroupOverflowParams,
  GroupOverflowPageResultModel,
} from './model/groupOverflowModel';

enum Api {
  page = '/webapi/fs/group_overflow/page',
  detail = '/webapi/fs/group_overflow/detail',
  save = '/webapi/fs/group_overflow/save',
  remove = '/webapi/fs/group_overflow/remove',
}

export function doGroupOverflowPage(params: GroupOverflowParams) {
  return defHttp.post<GroupOverflowPageResultModel>({ url: Api.page, params });
}

export function doGroupOverflowDetail(params: { id: number }) {
  return defHttp.get<GroupOverflowEntity>({ url: Api.detail, params });
}

export function doGroupOverflowSave(params: GroupOverflowEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doGroupOverflowRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
