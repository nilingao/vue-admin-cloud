import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

/**
 * 坐席实体
 */
export interface AgentEntity {
  id?: number;
  // 根据实际业务需要添加其他字段
}

/**
 * 查询参数类型
 */
export interface AgentParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

/**
 * 分页结果类型
 */
export type AgentPageResultModel = BasicFetchResult<AgentEntity>;
