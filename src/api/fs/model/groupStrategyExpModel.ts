import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface GroupStrategyExpEntity {
  id?: number;
  // 根据实际业务需要添加其他字段
}

export interface GroupStrategyExpParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type GroupStrategyExpPageResultModel = BasicFetchResult<GroupStrategyExpEntity>;
