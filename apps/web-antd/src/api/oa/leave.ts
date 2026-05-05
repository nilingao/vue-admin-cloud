import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface LeaveEntity {
  day?: number;
  endTime?: string;
  id?: string;
  memo?: string;
  processInstanceId?: string;
  startTime?: string;
}

enum Api {
  delete = '/webapi/oa/leave/delete',
  find = '/webapi/oa/leave/find',
  insert = '/webapi/oa/leave/insert',
}

export function doFindLeave(params: Recordable<any>) {
  return requestClient.get<LeaveEntity>(Api.find, { params });
}

export function doInsertLeave(params: LeaveEntity) {
  return requestClient.post(Api.insert, params);
}

export function doDeleteLeave(params: LeaveEntity) {
  return requestClient.post(Api.delete, params);
}
