import { defHttp } from '@/utils/http/axios';
import { SkillEntity, SkillParams, SkillPageResultModel } from './model/skillModel';

enum Api {
  page = '/webapi/fs/skill/page',
  detail = '/webapi/fs/skill/detail',
  save = '/webapi/fs/skill/save',
  remove = '/webapi/fs/skill/remove',
}

export function doSkillPage(params: SkillParams) {
  return defHttp.post<SkillPageResultModel>({ url: Api.page, params });
}

export function doSkillDetail(params: { id: number }) {
  return defHttp.get<SkillEntity>({ url: Api.detail, params });
}

export function doSkillSave(params: SkillEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doSkillRemove(params: { id: number }) {
  return defHttp.delete({ url: Api.remove, params });
}
