import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface MediaServerEntity {
  autoConfig?: number;
  defaultServer?: number;
  enable?: number;
  hookAliveInterval?: number;
  hookIp?: string;
  httpPort?: number;
  httpSslPort?: number;
  id?: string;
  ip?: string;
  keepaliveTime?: string;
  recordAssistPort?: number;
  rtmpPort?: number;
  rtmpSslPort?: number;
  rtpEnable?: number;
  rtpPortRange?: string;
  rtpProxyPort?: number;
  rtspPort?: number;
  rtspSslPort?: number;
  sdpIp?: string;
  secret?: string;
  sslStatus?: number;
  status?: number;
  streamIp?: string;
  videoHttpPrefix?: string;
  videoPlayPrefix?: string;
}

export type MediaServerParams = Recordable<any>;

export type MediaServerPageResultModel = Recordable<MediaServerEntity>;

enum Api {
  detail = '/webapi/video/media/server/detail',
  findMediaInfo = '/webapi/video/media/server/find_media_info',
  findPlayUrl = '/webapi/video/media/server/find_play_url',
  page = '/webapi/video/media/server/page',
  remove = '/webapi/video/media/server/remove',
  save = '/webapi/video/media/server/save',
}

export function doMediaPage(params: MediaServerParams) {
  return requestClient.post<MediaServerPageResultModel>(Api.page, params);
}

export function doMediaSave(params: MediaServerEntity) {
  return requestClient.post(Api.save, params);
}

export function doMediaDetail(params: Pick<MediaServerEntity, 'id'>) {
  return requestClient.get<MediaServerEntity>(Api.detail, { params });
}

export function doMediaRemove(params: Pick<MediaServerEntity, 'id'>) {
  return requestClient.delete(Api.remove, { params });
}

export function doMediaFindPlayUrl(params: Recordable<any>) {
  return requestClient.get<Recordable<any>>(Api.findPlayUrl, { params });
}

export function doMediaInfo(params: Recordable<any>) {
  return requestClient.get<Recordable<any>>(Api.findMediaInfo, { params });
}
