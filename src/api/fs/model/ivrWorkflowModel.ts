import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface IvrWorkflowEntity {
  id?: number;
  // 根据实际业务需要添加其他IVR工作流字段
}

export interface IvrWorkflowParams extends BasicPageParams {
  // 根据实际业务需要添加查询条件字段
}

export type IvrWorkflowPageResultModel = BasicFetchResult<IvrWorkflowEntity>;
