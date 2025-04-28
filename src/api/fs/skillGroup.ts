import { defHttp } from '@/utils/http/axios';
import {
  SkillGroupEntity,
  SkillGroupParams,
  SkillGroupPageResultModel,
} from './model/skillGroupModel';

enum Api {
  page = '/webapi/fs/skill_group/page',
  detail = '/webapi/fs/skill_group/detail',
  save = '/webapi/fs/skill_group/save',
  remove = '/webapi/fs/skill_group/remove',
}

export function doSkillGroupPage(params: SkillGroupParams) {
  return defHttp.post<SkillGroupPageResultModel>({ url: Api.page, params });
}

export function doSkillGroupDetail(params: { id: number }) {
  return defHttp.get<SkillGroupEntity>({ url: Api.detail, params });
}

export function doSkillGroupSave(params: SkillGroupEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doSkillGroupRemove(params: { id: number }) {
  return defHttp.delete({ url: Api.remove, params });
}
