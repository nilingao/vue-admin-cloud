import { defHttp } from '@/utils/http/axios';
import {
  IvrWorkflowEntity,
  IvrWorkflowParams,
  IvrWorkflowPageResultModel,
} from './model/ivrWorkflowModel';

enum Api {
  page = '/webapi/fs/ivr_workflow/page',
  detail = '/webapi/fs/ivr_workflow/detail',
  save = '/webapi/fs/ivr_workflow/save',
  remove = '/webapi/fs/ivr_workflow/remove',
}

export function doIvrWorkflowPage(params: IvrWorkflowParams) {
  return defHttp.post<IvrWorkflowPageResultModel>({ url: Api.page, params });
}

export function doIvrWorkflowDetail(params: { id: number }) {
  return defHttp.get<IvrWorkflowEntity>({ url: Api.detail, params });
}

export function doIvrWorkflowSave(params: IvrWorkflowEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doIvrWorkflowRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
