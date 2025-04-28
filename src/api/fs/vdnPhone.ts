import { defHttp } from '@/utils/http/axios';
import { VdnPhoneEntity, VdnPhoneParams, VdnPhonePageResultModel } from './model/vdnPhoneModel';

enum Api {
  page = '/webapi/fs/vdn_phone/page',
  detail = '/webapi/fs/vdn_phone/detail',
  save = '/webapi/fs/vdn_phone/save',
  remove = '/webapi/fs/vdn_phone/remove',
}

export function doVdnPhonePage(params: VdnPhoneParams) {
  return defHttp.post<VdnPhonePageResultModel>({ url: Api.page, params });
}

export function doVdnPhoneDetail(params: { id: number }) {
  return defHttp.get<VdnPhoneEntity>({ url: Api.detail, params });
}

export function doVdnPhoneSave(params: VdnPhoneEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doVdnPhoneRemove(params: { id: number }) {
  return defHttp.delete({ url: Api.remove, params });
}
