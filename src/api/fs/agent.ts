import { defHttp } from '@/utils/http/axios';
import { AgentEntity, AgentParams, AgentPageResultModel } from './model/agentModel';

enum Api {
  // 坐席管理分页
  page = '/webapi/fs/agent/page',
  // 坐席管理详情
  detail = '/webapi/fs/agent/detail',
  // 坐席管理保存
  save = '/webapi/fs/agent/save',
  // 坐席管理删除
  remove = '/webapi/fs/agent/remove',
}

export function doAgentPage(params: AgentParams) {
  return defHttp.post<AgentPageResultModel>({
    url: Api.page,
    params,
  });
}

export function doAgentDetail(params: AgentEntity) {
  return defHttp.get<AgentEntity>({
    url: Api.detail,
    params,
  });
}

export function doAgentSave(params: AgentEntity) {
  return defHttp.post({
    url: Api.save,
    params,
  });
}

export function doAgentRemove(params: AgentEntity) {
  return defHttp.post({
    url: Api.remove,
    params,
  });
}
