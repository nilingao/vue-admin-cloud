import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface GroupAgentStrategyEntity {
  id?: number;
  // 根据实际业务需要添加其他字段
}

export interface GroupAgentStrategyParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type GroupAgentStrategyPageResultModel = BasicFetchResult<GroupAgentStrategyEntity>;
