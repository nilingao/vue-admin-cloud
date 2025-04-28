// 由于没有分页接口，不需要定义Params类型
import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface UserAgentEntity {
  id?: number;
  // 根据实际业务需要添加其他用户坐席字段
}

export interface UserAgentParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type UserAgentPageResultModel = BasicFetchResult<UserAgentEntity>;
