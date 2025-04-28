import { defHttp } from '@/utils/http/axios';
import {
  VdnCodeEntity,
  VdnCodeParams,
  VdnCodePageResultModel,
  IVRModel,
} from './model/vdnCodeModel';

enum Api {
  page = '/webapi/fs/vdn_code/page',
  detail = '/webapi/fs/vdn_code/detail',
  save = '/webapi/fs/vdn_code/save',
  remove = '/webapi/fs/vdn_code/remove',
  findVdnIvr = '/webapi/fs/vdn_code/find_vdn_ivr',
  saveVdnIvr = '/webapi/fs/vdn_code/save_vdn_ivr',
}

export function doVdnCodePage(params: VdnCodeParams) {
  return defHttp.post<VdnCodePageResultModel>({ url: Api.page, params });
}

export function doVdnCodeDetail(params: { id: number }) {
  return defHttp.get<VdnCodeEntity>({ url: Api.detail, params });
}

export function doVdnCodeSave(params: VdnCodeEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doVdnCodeRemove(params: { id: number }) {
  return defHttp.delete({ url: Api.remove, params });
}

export function doFindVdnIvr(params: { id: number }) {
  return defHttp.get<IVRModel>({ url: Api.findVdnIvr, params });
}

export function doSaveVdnIvr(params: IVRModel) {
  return defHttp.post({ url: Api.saveVdnIvr, params });
}
