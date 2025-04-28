import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

/**
 * 坐席状态日志实体
 */
export interface AgentStateLogEntity {
  id?: number;
  // 根据实际业务需要添加其他字段
}

/**
 * 查询参数类型
 */
export interface AgentStateLogParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

/**
 * 分页结果类型
 */
export type AgentStateLogPageResultModel = BasicFetchResult<AgentStateLogEntity>;
