import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface OverflowFrontEntity {
  id?: number;
  // 根据实际业务需要添加其他溢出前端字段
}

export interface OverflowFrontParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type OverflowFrontPageResultModel = BasicFetchResult<OverflowFrontEntity>;
