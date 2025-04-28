import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface PlatformEntity {
  id?: number;
  // 根据实际业务需要添加其他平台字段
}

export interface PlatformParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type PlatformPageResultModel = BasicFetchResult<PlatformEntity>;
