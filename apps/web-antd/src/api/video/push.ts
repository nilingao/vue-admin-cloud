import type { Recordable } from '@vben/types';

import type { VideoPlayResult } from './play';

import { requestClient } from '#/api/request';

export interface PushEntity {
  aliveSecond?: number;
  app?: string;
  gbId?: string;
  gbStreamId?: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  mediaServerId?: string;
  name?: string;
  onSelf?: number;
  originType?: number;
  originTypeStr?: string;
  pushIng?: number;
  pushTime?: string;
  serverId?: string;
  status?: number;
  stream?: string;
  totalReaderCount?: string;
}

export type PushPageResultModel = Recordable<PushEntity>;

enum Api {
  detail = '/webapi/video/stream/push/detail',
  getPlayUrl = '/webapi/video/stream/push/get_play_url',
  page = '/webapi/video/stream/push/page',
  remove = '/webapi/video/stream/push/remove',
  save = '/webapi/video/stream/push/save',
}

export function doPushPage(params: Recordable<any>) {
  return requestClient.post<PushPageResultModel>(Api.page, params);
}

export function doPushSave(params: PushEntity) {
  return requestClient.post(Api.save, params);
}

export function doPushDetail(params: Recordable<any>) {
  return requestClient.get<PushEntity>(Api.detail, { params });
}

export function doPushRemove(params: Recordable<any>) {
  return requestClient.delete(Api.remove, { params });
}

export function doPushGetPlayUrl(params: Recordable<any>) {
  return requestClient.get<VideoPlayResult>(Api.getPlayUrl, { params });
}
