import { defHttp } from '@/utils/http/axios';
import {
  RouteGroupEntity,
  RouteGroupParams,
  RouteGroupPageResultModel,
} from './model/routeGroupModel';

enum Api {
  page = '/webapi/fs/route_group/page',
  detail = '/webapi/fs/route_group/detail',
  save = '/webapi/fs/route_group/save',
  remove = '/webapi/fs/route_group/remove',
}

export function doRouteGroupPage(params: RouteGroupParams) {
  return defHttp.post<RouteGroupPageResultModel>({ url: Api.page, params });
}

export function doRouteGroupDetail(params: { id: number }) {
  return defHttp.get<RouteGroupEntity>({ url: Api.detail, params });
}

export function doRouteGroupSave(params: RouteGroupEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doRouteGroupRemove(params: { id: number }) {
  return defHttp.delete({ url: Api.remove, params });
}
