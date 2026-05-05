import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface DeviceEntity {
  asMessageChannel?: number;
  channelCount?: number;
  charset?: number;
  deviceId?: string;
  firmware?: string;
  geoCoordSys?: number;
  hasAdministrator?: number;
  heartBeatInterval?: number;
  id?: string;
  keepaliveTime?: string;
  manufacturer?: string;
  mediaServerId?: string;
  mobilePositionSubmissionInterval?: number;
  name?: string;
  online?: number;
  password?: string;
  registerTime?: string;
  sdpIp?: string;
  ssrcCheck?: number;
  streamMode?: number;
  subscribeCycleForAlarm?: number;
  subscribeCycleForCatalog?: number;
  subscribeCycleForMobilePosition?: number;
  transport?: number;
  treeType?: number;
}

export type DeviceParams = Recordable<any>;
export type DevicePageResultModel = Recordable<DeviceEntity>;

enum Api {
  basicParam = '/webapi/video/device/basic_param',
  del = '/webapi/video/device/del',
  findDeviceAlarm = '/webapi/video/device/find_device_alarm',
  findDeviceId = '/webapi/video/device/find_device_id',
  findDeviceStatus = '/webapi/video/device/find_device_status',
  guardControl = '/webapi/video/device/guard_control',
  homePosition = '/webapi/video/device/home_position',
  iFrame = '/webapi/video/device/i_frame',
  page = '/webapi/video/device/page',
  queryParam = '/webapi/video/device/query_param',
  recordControl = '/webapi/video/device/record_control',
  resetAlarm = '/webapi/video/device/reset_alarm',
  saveDevice = '/webapi/video/device/save_device',
  startControl = '/webapi/video/device/start_control',
  subscribeInfo = '/webapi/video/device/subscribe_info',
  updateTransport = '/webapi/video/device/update_transport',
  zoomIn = '/webapi/video/device/zoom_in',
  zoomOut = '/webapi/video/device/zoom_out',
}

export function doDevicePage(params: DeviceParams) {
  return requestClient.post<DevicePageResultModel>(Api.page, params);
}

export function doSaveDevice(params: DeviceEntity) {
  return requestClient.post(Api.saveDevice, params);
}

export function doFindDeviceId(params: Pick<DeviceEntity, 'deviceId'>) {
  return requestClient.get<DeviceEntity>(Api.findDeviceId, { params });
}

export function doDelDeviceId(params: Pick<DeviceEntity, 'deviceId'>) {
  return requestClient.delete(Api.del, { params });
}

export function doUpdateTransport(params: Recordable<any>) {
  return requestClient.get(Api.updateTransport, { params });
}

export function doFindDeviceStatus(params: Recordable<any>) {
  return requestClient.get(Api.findDeviceStatus, { params });
}

export function doFindDeviceAlarm(params: Recordable<any>) {
  return requestClient.get(Api.findDeviceAlarm, { params });
}

export function doSubscribeInfo(params: Recordable<any>) {
  return requestClient.get(Api.subscribeInfo, { params });
}

export function doBasicParam(params: Recordable<any>) {
  return requestClient.get(Api.basicParam, { params });
}

export function doQueryParam(params: Recordable<any>) {
  return requestClient.get(Api.queryParam, { params });
}

export function doStartControl(params: Recordable<any>) {
  return requestClient.get(Api.startControl, { params });
}

export function doRecordControl(params: Recordable<any>) {
  return requestClient.get(Api.recordControl, { params });
}

export function doGuardControl(params: Recordable<any>) {
  return requestClient.get(Api.guardControl, { params });
}

export function doResetAlarm(params: Recordable<any>) {
  return requestClient.get(Api.resetAlarm, { params });
}

export function doIFrame(params: Recordable<any>) {
  return requestClient.get(Api.iFrame, { params });
}

export function doHomePosition(params: Recordable<any>) {
  return requestClient.get(Api.homePosition, { params });
}

export function doZoomIn(params: Recordable<any>) {
  return requestClient.get(Api.zoomIn, { params });
}

export function doZoomOut(params: Recordable<any>) {
  return requestClient.get(Api.zoomOut, { params });
}
