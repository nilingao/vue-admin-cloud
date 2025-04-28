import { defHttp } from '@/utils/http/axios';
import {
  CompanyDisplayEntity,
  CompanyDisplayParams,
  CompanyDisplayPageResultModel,
} from './model/companyDisplayModel';

enum Api {
  page = '/webapi/fs/company_display/page',
  detail = '/webapi/fs/company_display/detail',
  save = '/webapi/fs/company_display/save',
  remove = '/webapi/fs/company_display/remove',
}

export function doCompanyDisplayPage(params: CompanyDisplayParams) {
  return defHttp.post<CompanyDisplayPageResultModel>({ url: Api.page, params });
}

export function doCompanyDisplayDetail(params: { id: number }) {
  return defHttp.get<CompanyDisplayEntity>({ url: Api.detail, params });
}

export function doCompanyDisplaySave(params: CompanyDisplayEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doCompanyDisplayRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
