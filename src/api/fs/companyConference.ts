import { defHttp } from '@/utils/http/axios';
import {
  CompanyConferenceEntity,
  CompanyConferenceParams,
  CompanyConferencePageResultModel,
} from './model/companyConferenceModel';

enum Api {
  page = '/webapi/fs/company_conference/page',
  detail = '/webapi/fs/company_conference/detail',
  save = '/webapi/fs/company_conference/save',
  remove = '/webapi/fs/company_conference/remove',
}

export function doCompanyConferencePage(params: CompanyConferenceParams) {
  return defHttp.post<CompanyConferencePageResultModel>({ url: Api.page, params });
}

export function doCompanyConferenceDetail(params: { id: number }) {
  return defHttp.get<CompanyConferenceEntity>({ url: Api.detail, params });
}

export function doCompanyConferenceSave(params: CompanyConferenceEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doCompanyConferenceRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
