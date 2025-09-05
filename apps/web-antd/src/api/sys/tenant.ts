import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

// 默认系统租户编号
export const sysTenantId = 1;

/**
 * @description: 租户信息
 */
export interface TenantModel extends Recordable<any> {
  // 键
  id: number | undefined;
  // 租户名
  tenantName?: string;
  // 租户联系人编号
  tenantUserId?: number;
  // 租户联系人名称
  tenantUserName?: string;
  // 租户状态（0正常 1停用）
  status?: number;
  // 账号数量
  accountCount?: string;
}

/**
 * 查询参数类型
 */
export type TenantParams = Recordable<any>;

export type TenantPageResultModel = Recordable<TenantModel>;

enum Api {
  // 保存租户
  detail = '/webapi/config/tenant/detail',
  // 新增租户
  insert = '/webapi/config/tenant/insert',
  // 获取租户分页
  page = '/webapi/config/tenant/page',
  // 删除租户
  remove = '/webapi/config/tenant/remove',
  // 租户信息下拉展示(动态搜索数据源)
  select = '/webapi/config/tenant/select',
  // 租户权限信息
  tenantPrivilegeList = '/webapi/config/tenant/tenant_privilege_list',
  // 租户权限保存
  tenantPrivilegeSave = '/webapi/config/tenant/tenant_privilege_save',
  // 编辑租户
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
  return requestClient.get(Api.tenantPrivilegeList, { params });
}

export function doTenantPrivilegeSave(params: Recordable<any>) {
  return requestClient.post(Api.tenantPrivilegeSave, params);
}
