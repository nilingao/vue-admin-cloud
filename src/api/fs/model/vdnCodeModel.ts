import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface VdnCodeEntity {
  id?: number;
  // 根据实际业务需要添加其他VDN号码字段
}

export interface VdnCodeParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type VdnCodePageResultModel = BasicFetchResult<VdnCodeEntity>;

export interface IVRModel {
  // 根据实际业务需要添加IVR相关字段
}

export interface IVRMenu {
  // 根据实际业务需要添加IVR菜单字段
}
