import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return requestClient.post<RouteRecordStringComponent[]>(
    '/webapi/bean/menu/user_tree_menu',
  );
}
