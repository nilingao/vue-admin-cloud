import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

enum DictionaryTypeApi {
  /** 字典类型详情 */
  detail = '/webapi/config/dictionary_type/detail',
  /** 删除字典类型 */
  remove = '/webapi/config/dictionary_type/remove',
  /** 保存字典类型 */
  save = '/webapi/config/dictionary_type/save',
  /** 获取字典类型集合 */
  typeList = '/webapi/config/dictionary_type/find_type_list',
}

/**
 * 字典类型信息
 */
export interface DictionaryTypeEntity extends Recordable<any> {
  /** 类型编码 */
  code?: number | string;
  /** 类型编号 */
  id?: number | string;
  /** 类型名称 */
  name: string;
  /** 状态 */
  status?: number | string;
  /** v2 树组件使用的类型编号字段 */
  typeId?: number | string;
}

/**
 * 字典条目信息
 */
export interface DictionaryItemEntity extends Recordable<any> {
  /** 条目编号 */
  id?: number | string;
  /** 条目名称 */
  name: string;
  /** 排序 */
  sort?: number;
  /** 字典类型编号 */
  typeId: number | string;
  /** 条目值 */
  value: string;
}

export function doDictionaryTypeList() {
  return requestClient.get<DictionaryTypeEntity[]>(DictionaryTypeApi.typeList);
}

export function doDictionaryTypeSave(params: DictionaryTypeEntity) {
  return requestClient.post(DictionaryTypeApi.save, params);
}

export function doDictionaryTypeRemove(params: Recordable<any>) {
  return requestClient.get(DictionaryTypeApi.remove, { params });
}

export function doDictionaryTypeDetail(params: Recordable<any>) {
  return requestClient.get<DictionaryTypeEntity>(DictionaryTypeApi.detail, {
    params,
  });
}

enum DictionaryItemApi {
  /** 字典条目详情 */
  detail = '/webapi/config/dictionary_item/detail',
  /** 获取有效字典条目 */
  findDict = '/webapi/config/dictionary_item/find_dict',
  /** 获取字典条目集合 */
  itemList = '/webapi/config/dictionary_item/find_item_list',
  /** 分页信息 */
  page = '/webapi/config/dictionary_item/page',
  /** 删除字典条目 */
  remove = '/webapi/config/dictionary_item/remove',
  /** 保存字典条目 */
  save = '/webapi/config/dictionary_item/save',
}

export function doDictionaryItemList() {
  return requestClient.get<DictionaryItemEntity[]>(DictionaryItemApi.itemList);
}

export function doDictionaryItemPage(params: Recordable<any>) {
  return requestClient.post<Recordable<DictionaryItemEntity>>(
    DictionaryItemApi.page,
    params,
  );
}

export function doDictionaryItemSave(params: DictionaryItemEntity) {
  return requestClient.post(DictionaryItemApi.save, params);
}

export function doDictionaryItemRemove(params: Recordable<any>) {
  return requestClient.get(DictionaryItemApi.remove, { params });
}

export function doDictionaryItemDetail(params: Recordable<any>) {
  return requestClient.get<DictionaryItemEntity>(DictionaryItemApi.detail, {
    params,
  });
}

export function doDictionaryItemMap() {
  return requestClient.get<Record<string, DictionaryItemEntity[]>>(
    DictionaryItemApi.findDict,
  );
}
