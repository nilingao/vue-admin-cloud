import { defHttp } from '@/utils/http/axios';
import {
  OverflowFrontEntity,
  OverflowFrontParams,
  OverflowFrontPageResultModel,
} from './model/overflowFrontModel';

enum Api {
  page = '/webapi/fs/overflow_front/page',
  detail = '/webapi/fs/overflow_front/detail',
  save = '/webapi/fs/overflow_front/save',
  remove = '/webapi/fs/overflow_front/remove',
}

export function doOverflowFrontPage(params: OverflowFrontParams) {
  return defHttp.post<OverflowFrontPageResultModel>({ url: Api.page, params });
}

export function doOverflowFrontDetail(params: { id: number }) {
  return defHttp.get<OverflowFrontEntity>({ url: Api.detail, params });
}

export function doOverflowFrontSave(params: OverflowFrontEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doOverflowFrontRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
