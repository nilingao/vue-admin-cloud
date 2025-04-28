import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface CompanyEntity {
  id?: number;
  // 根据实际业务需要添加其他字段
}

export interface CompanyParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type CompanyPageResultModel = BasicFetchResult<CompanyEntity>;
