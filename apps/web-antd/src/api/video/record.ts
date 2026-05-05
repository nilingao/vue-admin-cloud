import type { Recordable } from '@vben/types';

import type { VideoPlayResult } from './play';

import { requestClient } from '#/api/request';

export interface VideoRecordItem {
  address?: string;
  deviceId?: string;
  endTime: string;
  filePath?: string;
  fileSize?: string;
  name?: string;
  recorderId?: string;
  secrecy?: number;
  startTime: string;
  type?: string;
}

export interface VideoRecordInfo {
  channelId?: string;
  count?: number;
  deviceId?: string;
  name?: string;
  recordList: VideoRecordItem[];
  sn?: string;
  sumNum?: number;
}

export interface VideoRecordDownload {
  stream?: string;
  [key: string]: any;
}

enum Api {
  downloadDel = '/webapi/video/gb/video/download/del',
  downloadList = '/webapi/video/gb/video/download/list',
  downloadStart = '/webapi/video/gb/video/download/start',
  downloadStop = '/webapi/video/gb/video/download/stop',
  list = '/webapi/video/gb/video/list',
  playbackRestore = '/webapi/video/playback/restore',
  playbackSeek = '/webapi/video/playback/seek',
  playbackSpeed = '/webapi/video/playback/speed',
  playbackStart = '/webapi/video/playback/start',
  playbackStop = '/webapi/video/playback/stop',
  playbackSuspend = '/webapi/video/playback/suspend',
}

export function doRecordList(params: Recordable<any>) {
  return requestClient.get<VideoRecordInfo>(Api.list, { params });
}

export function doRecordDownloadStart(params: Recordable<any>) {
  return requestClient.get(Api.downloadStart, { params });
}

export function doRecordDownloadStop(params: Recordable<any>) {
  return requestClient.get(Api.downloadStop, { params });
}

export function doRecordDownloadList(params: Recordable<any> = {}) {
  return requestClient.get<VideoRecordDownload[]>(Api.downloadList, { params });
}

export function doRecordDownloadDel(params: Recordable<any>) {
  return requestClient.get(Api.downloadDel, { params });
}

export function doRecordStartPlay(params: Recordable<any>) {
  return requestClient.get<VideoPlayResult>(Api.playbackStart, { params });
}

export function doRecordStopPlay(params: Recordable<any>) {
  return requestClient.get(Api.playbackStop, { params });
}

export function doRecordSuspend(params: Recordable<any>) {
  return requestClient.get(Api.playbackSuspend, { params });
}

export function doRecordRestore(params: Recordable<any>) {
  return requestClient.get(Api.playbackRestore, { params });
}

export function doRecordSeek(params: Recordable<any>) {
  return requestClient.get(Api.playbackSeek, { params });
}

export function doRecordSpeed(params: Recordable<any>) {
  return requestClient.get(Api.playbackSpeed, { params });
}
