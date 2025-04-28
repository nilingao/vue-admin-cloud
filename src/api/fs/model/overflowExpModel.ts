import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface OverflowExpEntity {
  id?: number;
  // 根据实际业务需要添加其他溢出经验字段
}

export interface OverflowExpParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type OverflowExpPageResultModel = BasicFetchResult<OverflowExpEntity>;
