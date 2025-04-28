import { defHttp } from '@/utils/http/axios';
import {
  SkillAgentEntity,
  SkillAgentParams,
  SkillAgentPageResultModel,
} from './model/skillAgentModel';

enum Api {
  page = '/webapi/fs/skill_agent/page',
  detail = '/webapi/fs/skill_agent/detail',
  save = '/webapi/fs/skill_agent/save',
  remove = '/webapi/fs/skill_agent/remove',
}

export function doSkillAgentPage(params: SkillAgentParams) {
  return defHttp.post<SkillAgentPageResultModel>({ url: Api.page, params });
}

export function doSkillAgentDetail(params: { id: number }) {
  return defHttp.get<SkillAgentEntity>({ url: Api.detail, params });
}

export function doSkillAgentSave(params: SkillAgentEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doSkillAgentRemove(params: { id: number }) {
  return defHttp.delete({ url: Api.remove, params });
}
