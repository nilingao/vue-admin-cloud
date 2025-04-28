import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface RouteCallEntity {
  id?: number;
  // 根据实际业务需要添加其他路由呼叫字段
}

export interface RouteCallParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type RouteCallPageResultModel = BasicFetchResult<RouteCallEntity>;
