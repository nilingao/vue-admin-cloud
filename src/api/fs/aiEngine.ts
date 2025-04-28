import { defHttp } from '@/utils/http/axios';
import { AiEngineEntity, AiEngineParams, AiEnginePageResultModel } from './model/aiEngineModel';

enum Api {
  // AI引擎分页
  page = '/webapi/fs/ai_engine/page',
  // AI引擎详情
  detail = '/webapi/fs/ai_engine/detail',
  // AI引擎保存
  save = '/webapi/fs/ai_engine/save',
  // AI引擎删除
  remove = '/webapi/fs/ai_engine/remove',
}

export function doAiEnginePage(params: AiEngineParams) {
  return defHttp.post<AiEnginePageResultModel>({
    url: Api.page,
    params,
  });
}

export function doAiEngineDetail(params: { id: number }) {
  return defHttp.get<AiEngineEntity>({
    url: Api.detail,
    params,
  });
}

export function doAiEngineSave(params: AiEngineEntity) {
  return defHttp.post({
    url: Api.save,
    params,
  });
}

export function doAiEngineRemove(params: { id: number }) {
  return defHttp.post({
    url: Api.remove,
    params,
  });
}
