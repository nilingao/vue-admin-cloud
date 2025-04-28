import { defHttp } from '@/utils/http/axios';
import { UserAgentEntity } from './model/userAgentModel';

enum Api {
  detail = '/webapi/fs/user_agent/detail',
  save = '/webapi/fs/user_agent/save',
  remove = '/webapi/fs/user_agent/remove',
}

export function doUserAgentDetail(params: { id: number }) {
  return defHttp.get<UserAgentEntity>({ url: Api.detail, params });
}

export function doUserAgentSave(params: UserAgentEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doUserAgentRemove(params: { id: number }) {
  return defHttp.delete({ url: Api.remove, params });
}
