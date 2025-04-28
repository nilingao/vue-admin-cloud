import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface PlaybackEntity {
  id?: number;
  // 根据实际业务需要添加其他字段
}

export interface PlaybackParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type PlaybackPageResultModel = BasicFetchResult<PlaybackEntity>;
