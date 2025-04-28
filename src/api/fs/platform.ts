import { defHttp } from '@/utils/http/axios';
import { PlatformEntity, PlatformParams, PlatformPageResultModel } from './model/platformModel';

enum Api {
  page = '/webapi/fs/platform/page',
  detail = '/webapi/fs/platform/detail',
  save = '/webapi/fs/platform/save',
  remove = '/webapi/fs/platform/remove',
}

export function doPlatformPage(params: PlatformParams) {
  return defHttp.post<PlatformPageResultModel>({ url: Api.page, params });
}

export function doPlatformDetail(params: { id: number }) {
  return defHttp.get<PlatformEntity>({ url: Api.detail, params });
}

export function doPlatformSave(params: PlatformEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doPlatformRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
