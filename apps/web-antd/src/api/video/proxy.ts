import type { Recordable } from '@vben/types';

import type { VideoPlayResult } from './play';

import { requestClient } from '#/api/request';

export interface ProxyEntity {
  app?: string;
  dstUrl?: string;
  enable?: number;
  enableAudio?: number;
  enableDisableNoneReader?: number;
  enableMp4?: number;
  enableRemoveNoneReader?: number;
  ffmpegCmdKey?: string;
  gbId?: string;
  gbStreamId?: number;
  id?: number;
  latitude?: number;
  longitude?: number;
  mediaServerId?: string;
  name?: string;
  rtpType?: number;
  srcUrl?: string;
  status?: number;
  stream?: string;
  timeoutMs?: number;
  type?: number;
  url?: string;
}

export type ProxyPageResultModel = Recordable<ProxyEntity>;

enum Api {
  detail = '/webapi/video/stream/proxy/detail',
  findFfmpegCmd = '/webapi/video/stream/proxy/find_ffmpeg_cmd',
  getPlayUrl = '/webapi/video/stream/proxy/get_play_url',
  page = '/webapi/video/stream/proxy/page',
  remove = '/webapi/video/stream/proxy/remove',
  save = '/webapi/video/stream/proxy/save',
  start = '/webapi/video/stream/proxy/start',
  stop = '/webapi/video/stream/proxy/stop',
}

export function doProxyPage(params: Recordable<any>) {
  return requestClient.post<ProxyPageResultModel>(Api.page, params);
}

export function doProxySave(params: ProxyEntity) {
  return requestClient.post(Api.save, params);
}

export function doProxyDetail(params: Recordable<any>) {
  return requestClient.get<ProxyEntity>(Api.detail, { params });
}

export function doProxyRemove(params: Recordable<any>) {
  return requestClient.delete(Api.remove, { params });
}

export function doProxyFindFfmpegCmd(params: Recordable<any>) {
  return requestClient.get<Recordable<any>[]>(Api.findFfmpegCmd, { params });
}

export function doProxyStart(params: Recordable<any>) {
  return requestClient.get(Api.start, { params });
}

export function doProxyStop(params: Recordable<any>) {
  return requestClient.get(Api.stop, { params });
}

export function doProxyGetPlayUrl(params: Recordable<any>) {
  return requestClient.get<VideoPlayResult>(Api.getPlayUrl, { params });
}
