import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface VdnPhoneEntity {
  id?: number;
  // 根据实际业务需要添加其他VDN电话字段
}

export interface VdnPhoneParams extends BasicPageParams {
  vdnCodeId?: number;
  // 根据实际业务需要添加查询条件字段
}

export type VdnPhonePageResultModel = BasicFetchResult<VdnPhoneEntity>;
