import { defHttp } from '@/utils/http/axios';
import {
  AgentGroupEntity,
  AgentGroupParams,
  AgentGroupPageResultModel,
} from './model/agentGroupModel';

enum Api {
  // 坐席技能组分页
  page = '/webapi/fs/agent_group/page',
  // 坐席技能组详情
  detail = '/webapi/fs/agent_group/detail',
  // 坐席技能组保存
  save = '/webapi/fs/agent_group/save',
  // 坐席技能组删除
  remove = '/webapi/fs/agent_group/remove',
}

export function doAgentGroupPage(params: AgentGroupParams) {
  return defHttp.post<AgentGroupPageResultModel>({
    url: Api.page,
    params,
  });
}

export function doAgentGroupDetail(params: { id: number }) {
  return defHttp.get<AgentGroupEntity>({
    url: Api.detail,
    params,
  });
}

export function doAgentGroupSave(params: AgentGroupEntity) {
  return defHttp.post({
    url: Api.save,
    params,
  });
}

export function doAgentGroupRemove(params: { id: number }) {
  return defHttp.post({
    url: Api.remove,
    params,
  });
}
