import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface OverflowConfigEntity {
  id?: number;
  // 根据实际业务需要添加其他溢出配置字段
}

export interface OverflowConfigParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type OverflowConfigPageResultModel = BasicFetchResult<OverflowConfigEntity>;
