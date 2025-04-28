import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface SkillEntity {
  id?: number;
  // 根据实际业务需要添加其他技能字段
}

export interface SkillParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type SkillPageResultModel = BasicFetchResult<SkillEntity>;
