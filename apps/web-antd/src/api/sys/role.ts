import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface RoleModel {
  // 角色编号
  id: number;
  // 角色名称
  roleName: string;
  // 角色备注
  memo: string;
}
export type RolePageResultModel = Recordable<RoleModel>;

enum Api {
  // 查询所有角色
  all = '/webapi/bean/role/all',
  // 保存角色
  detail = '/webapi/bean/role/detail',
  // 获取角色分页
  page = '/webapi/bean/role/page',
  // 删除角色
  remove = '/webapi/bean/role/remove',
  // 保存角色
  save = '/webapi/bean/role/save',
  // 角色信息下拉展示(动态搜索数据源)
  select = '/webapi/bean/role/select',
}

export function getRolePage(params: Recordable<any>) {
  return requestClient.post<RolePageResultModel>(Api.page, params);
}

export function doSelect(params: Recordable<any>) {
  return requestClient.get(Api.select, { params });
}

export function doAll(params: Recordable<any>) {
  return requestClient.get(Api.all, { params });
}

export function doSave(params: Recordable<any>) {
  return requestClient.post(Api.save, params);
}

export function doRemove(params: Recordable<any>) {
  return requestClient.get(Api.remove, { params });
}

export function doDetail(params: Recordable<any>) {
  return requestClient.get(Api.detail, { params });
}
