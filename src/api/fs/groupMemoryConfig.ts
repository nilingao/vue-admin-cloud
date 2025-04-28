import { defHttp } from '@/utils/http/axios';
import {
  GroupMemoryConfigEntity,
  GroupMemoryConfigParams,
  GroupMemoryConfigPageResultModel,
} from './model/groupMemoryConfigModel';

enum Api {
  page = '/webapi/fs/group_memory_config/page',
  detail = '/webapi/fs/group_memory_config/detail',
  save = '/webapi/fs/group_memory_config/save',
  remove = '/webapi/fs/group_memory_config/remove',
}

export function doGroupMemoryConfigPage(params: GroupMemoryConfigParams) {
  return defHttp.post<GroupMemoryConfigPageResultModel>({ url: Api.page, params });
}

export function doGroupMemoryConfigDetail(params: { id: number }) {
  return defHttp.get<GroupMemoryConfigEntity>({ url: Api.detail, params });
}

export function doGroupMemoryConfigSave(params: GroupMemoryConfigEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doGroupMemoryConfigRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
