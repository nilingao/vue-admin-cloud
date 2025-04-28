import { defHttp } from '@/utils/http/axios';
import {
  RouteGatewayEntity,
  RouteGatewayParams,
  RouteGatewayPageResultModel,
} from './model/routeGatewayModel';

enum Api {
  page = '/webapi/fs/route_gateway/page',
  detail = '/webapi/fs/route_gateway/detail',
  save = '/webapi/fs/route_gateway/save',
  remove = '/webapi/fs/route_gateway/remove',
}

export function doRouteGatewayPage(params: RouteGatewayParams) {
  return defHttp.post<RouteGatewayPageResultModel>({ url: Api.page, params });
}

export function doRouteGatewayDetail(params: { id: number }) {
  return defHttp.get<RouteGatewayEntity>({ url: Api.detail, params });
}

export function doRouteGatewaySave(params: RouteGatewayEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doRouteGatewayRemove(params: { id: number }) {
  return defHttp.delete({ url: Api.remove, params });
}
