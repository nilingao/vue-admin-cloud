import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * @description: 部门信息
 */
export interface DepartmentEntity extends Recordable<any> {
  // 父级编号
  parentId?: number;
  // 当前编号
  id: number;
  // 部门名称
  departmentName: string;
  // 是否开启
  isEnable: string;
  // 备注
  memo: string;
}

export interface DepartmentTree {
  // 父级编号
  parentId: number;
  // 当前编号
  id: number;
  // 部门名称
  title: string;
  // 下级目录
  children: Array<DepartmentTree>;
}
/**
 * 查询参数类型
 */
export type DepartmentParams = Recordable<any>;

export type DepartmentPageResultModel = Recordable<DepartmentEntity>;

enum Api {
  // 查询所有部门
  all = '/webapi/bean/department/all',
  // 部门权限信息
  departmentPrivilegeList = '/webapi/bean/department/department_privilege_list',
  // 部门权限保存
  departmentPrivilegeSave = '/webapi/bean/department/department_privilege_save',
  // 保存部门
  detail = '/webapi/bean/department/detail',
  // 获取部门分页
  page = '/webapi/bean/department/page',
  // 删除部门
  remove = '/webapi/bean/department/remove',
  // 保存部门
  save = '/webapi/bean/department/save',
  // 部门信息下拉展示(动态搜索数据源)
  select = '/webapi/bean/department/select',
  // 获取下拉部门树
  tree = '/webapi/bean/department/tree',
}

export function doDepartmentPage(params: DepartmentParams) {
  return requestClient.post<DepartmentPageResultModel>(Api.page, params);
}

export function doDepartmentAll() {
  return requestClient.get(Api.all);
}

export function doSelect(params: Recordable<any>) {
  return requestClient.get(Api.select, { params });
}

export function doDepartmentSave(params: DepartmentEntity) {
  return requestClient.post(Api.save, params);
}

export function doDepartmentRemove(params: Recordable<any>) {
  return requestClient.get(Api.remove, { params });
}

export function doDepartmentDetail(params: Recordable<any>) {
  return requestClient.get(Api.detail, { params });
}

export function doDepartmentTree(params: Recordable<any>) {
  return requestClient.post<DepartmentTree[]>(Api.tree, params);
}
export function doDepartmentPrivilegeList(params: Recordable<any>) {
  return requestClient.get(Api.departmentPrivilegeList, { params });
}

export function doDepartmentPrivilegeSave(params: Recordable<any>) {
  return requestClient.post(Api.departmentPrivilegeSave, params);
}
