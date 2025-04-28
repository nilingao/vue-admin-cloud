import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface RouteGroupEntity {
  id?: number;
  // 根据实际业务需要添加其他路由组字段
}

export interface RouteGroupParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type RouteGroupPageResultModel = BasicFetchResult<RouteGroupEntity>;
