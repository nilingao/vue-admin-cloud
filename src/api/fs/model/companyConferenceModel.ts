import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface CompanyConferenceEntity {
  id?: number;
  // 根据实际业务需要添加其他字段
}

export interface CompanyConferenceParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type CompanyConferencePageResultModel = BasicFetchResult<CompanyConferenceEntity>;
