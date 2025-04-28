import { defHttp } from '@/utils/http/axios';
import { CompanyEntity, CompanyParams, CompanyPageResultModel } from './model/companyModel';

enum Api {
  page = '/webapi/fs/company/page',
  detail = '/webapi/fs/company/detail',
  save = '/webapi/fs/company/save',
  remove = '/webapi/fs/company/remove',
}

export function doCompanyPage(params: CompanyParams) {
  return defHttp.post<CompanyPageResultModel>({ url: Api.page, params });
}

export function doCompanyDetail(params: { id: number }) {
  return defHttp.get<CompanyEntity>({ url: Api.detail, params });
}

export function doCompanySave(params: CompanyEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doCompanyRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
