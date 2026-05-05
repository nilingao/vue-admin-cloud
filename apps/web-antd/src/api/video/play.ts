import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface VideoPlayResult {
  app?: string;
  deviceId?: string;
  channelId?: string;
  stream?: string;
  streamId?: string;
  mediaServerId?: string;
  sslStatus?: number;
  wsFlv?: { url?: string };
  wssFlv?: { url?: string };
  flv?: { url?: string };
  httpsFlv?: { url?: string };
  rtsp?: { url?: string };
  rtmp?: { url?: string };
}

enum Api {
  convert = '/webapi/video/play/convert',
  convertStop = '/webapi/video/play/convert_stop',
  start = '/webapi/video/play/start',
  stop = '/webapi/video/play/stop',
}

export function doPlayStart(params: Recordable<any>) {
  return requestClient.get<VideoPlayResult>(Api.start, { params });
}

export function doPlayStop(params: Recordable<any>) {
  return requestClient.get(Api.stop, { params });
}

export function doPlayConvert(params: Recordable<any>) {
  return requestClient.get<VideoPlayResult>(Api.convert, { params });
}

export function doPlayConvertStop(params: Recordable<any>) {
  return requestClient.get(Api.convertStop, { params });
}
