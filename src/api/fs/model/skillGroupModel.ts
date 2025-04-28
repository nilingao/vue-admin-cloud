import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface SkillGroupEntity {
  id?: number;
  // 根据实际业务需要添加其他技能组字段
}

export interface SkillGroupParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type SkillGroupPageResultModel = BasicFetchResult<SkillGroupEntity>;
