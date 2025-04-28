import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

/**
 * 通话按键实体
 */
export interface CallDtmfEntity {
  id?: number;
  // 根据实际业务需要添加其他字段
}

/**
 * 查询参数类型
 */
export interface CallDtmfParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

/**
 * 分页结果类型
 */
export type CallDtmfPageResultModel = BasicFetchResult<CallDtmfEntity>;
