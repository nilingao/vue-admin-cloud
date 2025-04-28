import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface SkillAgentEntity {
  id?: number;
  // 根据实际业务需要添加其他技能坐席字段
}

export interface SkillAgentParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type SkillAgentPageResultModel = BasicFetchResult<SkillAgentEntity>;
