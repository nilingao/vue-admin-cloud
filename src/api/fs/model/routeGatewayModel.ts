import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface RouteGatewayEntity {
  id?: number;
  // 根据实际业务需要添加其他路由网关字段
}

export interface RouteGatewayParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type RouteGatewayPageResultModel = BasicFetchResult<RouteGatewayEntity>;
