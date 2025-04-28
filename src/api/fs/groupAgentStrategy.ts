import { defHttp } from '@/utils/http/axios';
import {
  GroupAgentStrategyEntity,
  GroupAgentStrategyParams,
  GroupAgentStrategyPageResultModel,
} from './model/groupAgentStrategyModel';

enum Api {
  page = '/webapi/fs/group_agent_strategy/page',
  detail = '/webapi/fs/group_agent_strategy/detail',
  save = '/webapi/fs/group_agent_strategy/save',
  remove = '/webapi/fs/group_agent_strategy/remove',
}

export function doGroupAgentStrategyPage(params: GroupAgentStrategyParams) {
  return defHttp.post<GroupAgentStrategyPageResultModel>({ url: Api.page, params });
}

export function doGroupAgentStrategyDetail(params: { id: number }) {
  return defHttp.get<GroupAgentStrategyEntity>({ url: Api.detail, params });
}

export function doGroupAgentStrategySave(params: GroupAgentStrategyEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doGroupAgentStrategyRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
