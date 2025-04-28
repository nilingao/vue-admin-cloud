import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

/**
 * AI引擎实体
 */
export interface AiEngineEntity {
  id?: number;
  // 根据实际业务需要添加其他字段
}

/**
 * 查询参数类型
 */
export interface AiEngineParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

/**
 * 分页结果类型
 */
export type AiEnginePageResultModel = BasicFetchResult<AiEngineEntity>;
