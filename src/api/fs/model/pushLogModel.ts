import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface PushLogEntity {
  id?: number;
  // 根据实际业务需要添加其他推送日志字段
}

export interface PushLogParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type PushLogPageResultModel = BasicFetchResult<PushLogEntity>;
