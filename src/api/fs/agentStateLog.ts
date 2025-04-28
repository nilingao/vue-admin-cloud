import { defHttp } from '@/utils/http/axios';
import {
  AgentStateLogEntity,
  AgentStateLogParams,
  AgentStateLogPageResultModel,
} from './model/agentStateLogModel';

enum Api {
  // 坐席状态日志分页
  page = '/webapi/fs/agent_state_log/page',
  // 坐席状态日志详情
  detail = '/webapi/fs/agent_state_log/detail',
  // 坐席状态日志保存
  save = '/webapi/fs/agent_state_log/save',
  // 坐席状态日志删除
  remove = '/webapi/fs/agent_state_log/remove',
}

export function doAgentStateLogPage(params: AgentStateLogParams) {
  return defHttp.post<AgentStateLogPageResultModel>({
    url: Api.page,
    params,
  });
}

export function doAgentStateLogDetail(params: { id: number }) {
  return defHttp.get<AgentStateLogEntity>({
    url: Api.detail,
    params,
  });
}

export function doAgentStateLogSave(params: AgentStateLogEntity) {
  return defHttp.post({
    url: Api.save,
    params,
  });
}

export function doAgentStateLogRemove(params: { id: number }) {
  return defHttp.post({
    url: Api.remove,
    params,
  });
}
