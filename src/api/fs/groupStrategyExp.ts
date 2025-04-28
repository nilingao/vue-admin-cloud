import { defHttp } from '@/utils/http/axios';
import {
  GroupStrategyExpEntity,
  GroupStrategyExpParams,
  GroupStrategyExpPageResultModel,
} from './model/groupStrategyExpModel';

enum Api {
  page = '/webapi/fs/group_strategy_exp/page',
  detail = '/webapi/fs/group_strategy_exp/detail',
  save = '/webapi/fs/group_strategy_exp/save',
  remove = '/webapi/fs/group_strategy_exp/remove',
}

export function doGroupStrategyExpPage(params: GroupStrategyExpParams) {
  return defHttp.post<GroupStrategyExpPageResultModel>({ url: Api.page, params });
}

export function doGroupStrategyExpDetail(params: { id: number }) {
  return defHttp.get<GroupStrategyExpEntity>({ url: Api.detail, params });
}

export function doGroupStrategyExpSave(params: GroupStrategyExpEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doGroupStrategyExpRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
