import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * @description: 职位信息
 */
export interface PositionEntity {
  // 父级编号
  parentId: number;
  // 当前编号
  id: number;
  // 职位名称
  positionName: string;
  // 是否开启
  isEnable: string;
  // 备注
  memo: string;
}

export interface PositionTree {
  // 父级编号
  parentId: number;
  // 当前编号
  id: number;
  // 部门名称
  title: string;
  // 下级目录
  children: Array<PositionTree>;
}
/**
 * 查询参数类型
 */
export type PositionParams = Recordable<any>;

export type PositionPageResultModel = Recordable<PositionEntity>;

enum Api {
  // 查询所有职位
  all = '/webapi/bean/position/all',
  // 保存职位
  detail = '/webapi/bean/position/detail',
  // 获取职位分页
  page = '/webapi/bean/position/page',
  // 删除职位
  remove = '/webapi/bean/position/remove',
  // 保存职位
  save = '/webapi/bean/position/save',
  // 职位信息下拉展示(动态搜索数据源)
  select = '/webapi/bean/position/select',
  // 获取下拉职位树
  tree = '/webapi/bean/position/tree',
}

export function doPositionPage(params: Recordable<any>) {
  return requestClient.post<PositionPageResultModel>(Api.page, params);
}

export function doSelect(params: Recordable<any>) {
  return requestClient.get(Api.select, { params });
}

export function doPositionAll(params: Recordable<any>) {
  return requestClient.get(Api.all, { params });
}

export function doPositionSave(params: Recordable<any>) {
  return requestClient.post(Api.save, params);
}

export function doPositionRemove(params: Recordable<any>) {
  return requestClient.get(Api.remove, { params });
}

export function doPositionDetail(params: Recordable<any>) {
  return requestClient.get(Api.detail, { params });
}
export function doPositionTree(params: Recordable<any>) {
  return requestClient.post(Api.tree, params);
}
