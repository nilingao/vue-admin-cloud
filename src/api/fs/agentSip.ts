import { defHttp } from '@/utils/http/axios';
import { AgentSipEntity, AgentSipParams, AgentSipPageResultModel } from './model/agentSipModel';

enum Api {
  // 坐席SIP分页
  page = '/webapi/fs/agent_sip/page',
  // 坐席SIP详情
  detail = '/webapi/fs/agent_sip/detail',
  // 坐席SIP保存
  save = '/webapi/fs/agent_sip/save',
  // 坐席SIP删除
  remove = '/webapi/fs/agent_sip/remove',
}

export function doAgentSipPage(params: AgentSipParams) {
  return defHttp.post<AgentSipPageResultModel>({
    url: Api.page,
    params,
  });
}

export function doAgentSipDetail(params: { id: number }) {
  return defHttp.get<AgentSipEntity>({
    url: Api.detail,
    params,
  });
}

export function doAgentSipSave(params: AgentSipEntity) {
  return defHttp.post({
    url: Api.save,
    params,
  });
}

export function doAgentSipRemove(params: { id: number }) {
  return defHttp.post({
    url: Api.remove,
    params,
  });
}
