import { defHttp } from '@/utils/http/axios';
import {
  CompanyPhoneEntity,
  CompanyPhoneParams,
  CompanyPhonePageResultModel,
} from './model/companyPhoneModel';

enum Api {
  page = '/webapi/fs/company_phone/page',
  detail = '/webapi/fs/company_phone/detail',
  save = '/webapi/fs/company_phone/save',
  remove = '/webapi/fs/company_phone/remove',
}

export function doCompanyPhonePage(params: CompanyPhoneParams) {
  return defHttp.post<CompanyPhonePageResultModel>({ url: Api.page, params });
}

export function doCompanyPhoneDetail(params: { id: number }) {
  return defHttp.get<CompanyPhoneEntity>({ url: Api.detail, params });
}

export function doCompanyPhoneSave(params: CompanyPhoneEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doCompanyPhoneRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
