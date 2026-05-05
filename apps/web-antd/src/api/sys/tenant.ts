import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

// 默认系统租户编号
export const sysTenantId = 1;

export interface TenantModel extends Recordable<any> {
  /** 账号数量 */
  accountCount?: number | string;
  /** 租户编号 */
  id: number | undefined;
  /** 租户状态：1 启用，0 禁用 */
  status?: number;
  /** 租户名称 */
  tenantName?: string;
  /** 租户联系人编号 */
  tenantUserId?: number;
  /** 租户联系人名称 */
  tenantUserName?: string;
}

export type TenantParams = Recordable<any>;

export type TenantPageResultModel = Recordable<TenantModel>;

enum Api {
  /** 租户详情 */
  detail = '/webapi/config/tenant/detail',
  /** 新增租户 */
  insert = '/webapi/config/tenant/insert',
  /** 租户分页 */
  page = '/webapi/config/tenant/page',
  /** 删除租户 */
  remove = '/webapi/config/tenant/remove',
  /** 租户下拉数据 */
  select = '/webapi/config/tenant/select',
  /** 租户权限列表 */
  tenantPrivilegeList = '/webapi/config/tenant/tenant_privilege_list',
  /** 租户权限保存 */
  tenantPrivilegeSave = '/webapi/config/tenant/tenant_privilege_save',
  /** 编辑租户 */
  update = '/webapi/config/tenant/update',
}

export function getTenantPage(params: TenantParams) {
  return requestClient.post<TenantPageResultModel>(Api.page, params);
}

export function doTenantSelect(params: Recordable<any>) {
  return requestClient.get(Api.select, { params });
}

export function doTenantInsert(params: Recordable<any>) {
  return requestClient.post(Api.insert, params);
}

export function doTenantUpdate(params: TenantModel) {
  return requestClient.post(Api.update, params);
}

export function doTenantRemove(params: Recordable<any>) {
  return requestClient.get(Api.remove, { params });
}

export function doTenantDetail(params: Recordable<any>) {
  return requestClient.get<TenantModel>(Api.detail, { params });
}

export function doTenantPrivilegeList(params: Recordable<any>) {
  return requestClient.get<string[]>(Api.tenantPrivilegeList, { params });
}

export function doTenantPrivilegeSave(params: Recordable<any>) {
  return requestClient.post(Api.tenantPrivilegeSave, params);
}
