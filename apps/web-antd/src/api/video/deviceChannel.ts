import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface DeviceChannelEntity {
  address?: string;
  channelId?: string;
  civilCode?: string;
  deviceId?: string;
  hasAudio?: number;
  hasRecord?: number;
  id?: string;
  latitude?: number | string;
  longitude?: number | string;
  manufacture?: string;
  model?: string;
  name?: string;
  owner?: string;
  parentId?: string;
  password?: string;
  ptzType?: number;
  streamId?: string;
  subCount?: number;
  status?: number;
}

export type DeviceChannelPageResultModel = Recordable<DeviceChannelEntity>;

enum Api {
  del = '/webapi/video/device/channel/del',
  detail = '/webapi/video/device/channel/detail',
  page = '/webapi/video/device/channel/page',
  save = '/webapi/video/device/channel/save',
  sync = '/webapi/video/device/channel/sync',
  syncStatus = '/webapi/video/device/channel/sync_status',
  tree = '/webapi/video/device/channel/tree',
}

export function doTreeDeviceChannel() {
  return requestClient.get<Recordable<any>[]>(Api.tree);
}

export function doDeviceChannelPage(params: Recordable<any>) {
  return requestClient.post<DeviceChannelPageResultModel>(Api.page, params);
}

export function doSaveDeviceChannel(params: DeviceChannelEntity) {
  return requestClient.post(Api.save, params);
}

export function doDetailDeviceChannel(params: Recordable<any>) {
  return requestClient.get<DeviceChannelEntity>(Api.detail, { params });
}

export function doDelDeviceChannel(params: Recordable<any>) {
  return requestClient.delete(Api.del, { params });
}

export function doSyncDeviceChannel(params: Recordable<any>) {
  return requestClient.get(Api.sync, { params });
}

export function doSyncStatusDeviceChannel(params: Recordable<any>) {
  return requestClient.get<{
    current?: number;
    errorMsg?: string;
    syncIng?: boolean;
    total?: number;
  }>(Api.syncStatus, { params });
}
