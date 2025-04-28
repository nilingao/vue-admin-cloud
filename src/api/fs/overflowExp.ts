import { defHttp } from '@/utils/http/axios';
import {
  OverflowExpEntity,
  OverflowExpParams,
  OverflowExpPageResultModel,
} from './model/overflowExpModel';

enum Api {
  page = '/webapi/fs/overflow_exp/page',
  detail = '/webapi/fs/overflow_exp/detail',
  save = '/webapi/fs/overflow_exp/save',
  remove = '/webapi/fs/overflow_exp/remove',
}

export function doOverflowExpPage(params: OverflowExpParams) {
  return defHttp.post<OverflowExpPageResultModel>({ url: Api.page, params });
}

export function doOverflowExpDetail(params: { id: number }) {
  return defHttp.get<OverflowExpEntity>({ url: Api.detail, params });
}

export function doOverflowExpSave(params: OverflowExpEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doOverflowExpRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
