import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface GroupMemoryConfigEntity {
  id?: number;
  // 根据实际业务需要添加其他字段
}

export interface GroupMemoryConfigParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type GroupMemoryConfigPageResultModel = BasicFetchResult<GroupMemoryConfigEntity>;
