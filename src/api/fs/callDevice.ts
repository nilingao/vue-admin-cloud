import { defHttp } from '@/utils/http/axios';
import {
  CallDeviceEntity,
  CallDeviceParams,
  CallDevicePageResultModel,
} from './model/callDeviceModel';

enum Api {
  // 通话设备分页
  page = '/webapi/fs/call_device/page',
  // 通话设备详情
  detail = '/webapi/fs/call_device/detail',
  // 通话设备删除
  remove = '/webapi/fs/call_device/remove',
}

export function doCallDevicePage(params: CallDeviceParams) {
  return defHttp.post<CallDevicePageResultModel>({
    url: Api.page,
    params,
  });
}

export function doCallDeviceDetail(params: { id: number }) {
  return defHttp.get<CallDeviceEntity>({
    url: Api.detail,
    params,
  });
}

export function doCallDeviceRemove(params: { id: number }) {
  return defHttp.post({
    url: Api.remove,
    params,
  });
}
