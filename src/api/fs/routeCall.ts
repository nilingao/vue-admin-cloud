import { defHttp } from '@/utils/http/axios';
import { RouteCallEntity, RouteCallParams, RouteCallPageResultModel } from './model/routeCallModel';

enum Api {
  page = '/webapi/fs/route_call/page',
  detail = '/webapi/fs/route_call/detail',
  save = '/webapi/fs/route_call/save',
  remove = '/webapi/fs/route_call/remove',
}

export function doRouteCallPage(params: RouteCallParams) {
  return defHttp.post<RouteCallPageResultModel>({ url: Api.page, params });
}

export function doRouteCallDetail(params: { id: number }) {
  return defHttp.get<RouteCallEntity>({ url: Api.detail, params });
}

export function doRouteCallSave(params: RouteCallEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doRouteCallRemove(params: { id: number }) {
  return defHttp.delete({ url: Api.remove, params });
}
