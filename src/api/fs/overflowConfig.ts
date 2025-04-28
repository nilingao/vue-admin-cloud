import { defHttp } from '@/utils/http/axios';
import {
  OverflowConfigEntity,
  OverflowConfigParams,
  OverflowConfigPageResultModel,
} from './model/overflowConfigModel';

enum Api {
  page = '/webapi/fs/overflow_config/page',
  detail = '/webapi/fs/overflow_config/detail',
  save = '/webapi/fs/overflow_config/save',
  remove = '/webapi/fs/overflow_config/remove',
}

export function doOverflowConfigPage(params: OverflowConfigParams) {
  return defHttp.post<OverflowConfigPageResultModel>({ url: Api.page, params });
}

export function doOverflowConfigDetail(params: { id: number }) {
  return defHttp.get<OverflowConfigEntity>({ url: Api.detail, params });
}

export function doOverflowConfigSave(params: OverflowConfigEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doOverflowConfigRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
