import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface PlatformEntity {
  administrativeDivision?: string;
  asMessageChannel?: number;
  catalogGroup?: number;
  catalogId?: string;
  characterSet?: number;
  deviceGbId?: string;
  deviceIp?: string;
  devicePort?: number;
  enable?: number;
  expires?: number;
  id?: number;
  keepTimeout?: number;
  name?: string;
  password?: string;
  ptz?: number;
  rtcp?: number;
  serverGbDomain?: string;
  serverGbId?: string;
  serverIp?: string;
  serverPort?: number;
  startOfflinePush?: number;
  status?: number;
  transport?: number;
  treeType?: number;
  username?: string;
}

export interface PlatformSipItem {
  gbId: string;
  ip?: string;
  port?: number;
}

export type PlatformParams = Recordable<any>;
export type PlatformPageResultModel = Recordable<PlatformEntity>;

enum Api {
  catalogDelete = '/webapi/video/platform/catalog/delete',
  catalogDeleteRelation = '/webapi/video/platform/catalog/delete_relation',
  catalogInsert = '/webapi/video/platform/catalog/insert',
  catalogTree = '/webapi/video/platform/catalog/tree',
  catalogUpdate = '/webapi/video/platform/catalog/update',
  channelBindKey = '/webapi/video/platform/gb_channel/channel_bind_key',
  delete = '/webapi/video/parent/platform/delete',
  detail = '/webapi/video/parent/platform/detail',
  gbChannelDelete = '/webapi/video/platform/gb_channel/delete',
  gbChannelInsert = '/webapi/video/platform/gb_channel/insert',
  gbChannelList = '/webapi/video/platform/gb_channel/device_channel_list',
  gbStreamDelete = '/webapi/video/platform/gb_stream/del',
  gbStreamInsert = '/webapi/video/platform/gb_stream/add',
  gbStreamList = '/webapi/video/platform/gb_stream/gb_stream_list',
  insert = '/webapi/video/parent/platform/insert',
  page = '/webapi/video/parent/platform/page',
  sipList = '/webapi/video/parent/platform/sip_list',
  streamBindKey = '/webapi/video/platform/gb_stream/stream_bind_key',
  update = '/webapi/video/parent/platform/update',
}

export function doPlatformSipList(params: Recordable<any> = {}) {
  return requestClient.get<PlatformSipItem[]>(Api.sipList, { params });
}

export function doPlatformPage(params: PlatformParams) {
  return requestClient.post<PlatformPageResultModel>(Api.page, params);
}

export function doPlatformInsert(params: PlatformEntity) {
  return requestClient.post(Api.insert, params);
}

export function doPlatformUpdate(params: PlatformEntity) {
  return requestClient.post(Api.update, params);
}

export function doPlatformDetail(params: Pick<PlatformEntity, 'id'>) {
  return requestClient.get<PlatformEntity>(Api.detail, { params });
}

export function doPlatformRemove(params: Pick<PlatformEntity, 'id'>) {
  return requestClient.delete(Api.delete, { params });
}

export function doPlatformCatalogTree(params: Recordable<any>) {
  return requestClient.get<Recordable<any>[]>(Api.catalogTree, { params });
}

export function doPlatformCatalogInsert(params: Recordable<any>) {
  return requestClient.post(Api.catalogInsert, params);
}

export function doPlatformCatalogUpdate(params: Recordable<any>) {
  return requestClient.post(Api.catalogUpdate, params);
}

export function doPlatformCatalogDelete(params: Recordable<any>) {
  return requestClient.delete(Api.catalogDelete, { params });
}

export function doPlatformCatalogDeleteRelation(params: Recordable<any>) {
  return requestClient.delete(Api.catalogDeleteRelation, { params });
}

export function doPlatformGbChannelList() {
  return requestClient.get<Recordable<any>[]>(Api.gbChannelList);
}

export function doPlatformChannelBindKey(params: Recordable<any>) {
  return requestClient.post<Recordable<any>>(Api.channelBindKey, params);
}

export function doPlatformGbChannelInsert(params: Recordable<any>) {
  return requestClient.post(Api.gbChannelInsert, params);
}

export function doPlatformGbChannelDelete(params: Recordable<any>) {
  return requestClient.post(Api.gbChannelDelete, params);
}

export function doPlatformGbStreamList() {
  return requestClient.get<Recordable<any>[]>(Api.gbStreamList);
}

export function doPlatformStreamBindKey(params: Recordable<any>) {
  return requestClient.post<Recordable<any>>(Api.streamBindKey, params);
}

export function doPlatformGbStreamInsert(params: Recordable<any>) {
  return requestClient.post(Api.gbStreamInsert, params);
}

export function doPlatformGbStreamDelete(params: Recordable<any>) {
  return requestClient.post(Api.gbStreamDelete, params);
}
