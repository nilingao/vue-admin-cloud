import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemMenuApi {
  /** 徽标颜色集合 */
  export const BadgeVariants = [
    'default',
    'destructive',
    'primary',
    'success',
    'warning',
  ] as const;
  /** 徽标类型集合 */
  export const BadgeTypes = ['dot', 'normal'] as const;
  /** 菜单类型集合 */
  export const MenuTypes = [
    'catalog',
    'menu',
    'embedded',
    'link',
    'button',
  ] as const;
  export interface SystemMenu {
    [key: string]: any;
    /** 后端权限标识 */
    authCode: string;
    /** 子级 */
    children?: SystemMenu[];
    /** 组件 */
    component?: string;
    /** 菜单ID */
    id: string;
    /** 菜单元数据 */
    meta?: {
      /** 激活时显示的图标 */
      activeIcon?: string;
      /** 作为路由时，需要激活的菜单的Path */
      activePath?: string;
      /** 固定在标签栏 */
      affixTab?: boolean;
      /** 在标签栏固定的顺序 */
      affixTabOrder?: number;
      /** 徽标内容(当徽标类型为normal时有效) */
      badge?: string;
      /** 徽标类型 */
      badgeType?: (typeof BadgeTypes)[number];
      /** 徽标颜色 */
      badgeVariants?: (typeof BadgeVariants)[number];
      /** 在菜单中隐藏下级 */
      hideChildrenInMenu?: boolean;
      /** 在面包屑中隐藏 */
      hideInBreadcrumb?: boolean;
      /** 在菜单中隐藏 */
      hideInMenu?: boolean;
      /** 在标签栏中隐藏 */
      hideInTab?: boolean;
      /** 菜单图标 */
      icon?: string;
      /** 内嵌Iframe的URL */
      iframeSrc?: string;
      /** 是否缓存页面 */
      keepAlive?: boolean;
      /** 外链页面的URL */
      link?: string;
      /** 同一个路由最大打开的标签数 */
      maxNumOfOpenTab?: number;
      /** 无需基础布局 */
      noBasicLayout?: boolean;
      /** 是否在新窗口打开 */
      openInNewWindow?: boolean;
      /** 菜单排序 */
      order?: number;
      /** 额外的路由参数 */
      query?: Recordable<any>;
      /** 菜单标题 */
      title?: string;
    };
    /** 菜单名称 */
    name: string;
    /** 路由路径 */
    path: string;
    /** 父级ID */
    pid: string;
    /** 重定向 */
    redirect?: string;
    /** 菜单类型 */
    type: (typeof MenuTypes)[number];
  }
}
// 权限与菜单在一个ts中
enum Api {
  /**
   * 菜单协议
   */
  // 获取用户路由菜单
  GetMenuList = '/webapi/bean/menu/user_tree_menu',
  // 查询所有菜单
  menuAll = '/webapi/bean/menu/all',
  // 菜单详情
  menuDetail = '/webapi/bean/menu/detail',
  // 获取菜单分页
  menuPage = '/webapi/bean/menu/page',
  // 获取菜单权限树
  menuPrivilegeTree = '/webapi/bean/menu/menu_privilege_tree',
  // 删除菜单
  menuRemove = '/webapi/bean/menu/remove',
  // 保存菜单
  menuSave = '/webapi/bean/menu/save',
  // 获取下拉菜单树
  menuTree = '/webapi/bean/menu/tree',
  // 权限详情
  privilegeDetail = '/webapi/bean/privilege/detail',
  // 删除权限
  privilegeRemove = '/webapi/bean/privilege/remove',
  /**
   * 权限协议
   */
  // 保存权限
  privilegeSave = '/webapi/bean/privilege/save',
  // 获取租户菜单权限树
  tenantMenuPrivilegeTree = '/webapi/bean/menu/tenant_menu_privilege_tree',
}

/**
 * @description: 菜单协议
 */
// 获取用户路由菜单
export const getMenuList = () => {
  return requestClient.post<Array<SystemMenuApi.SystemMenu>>(
    Api.GetMenuList,
    null,
    {
      dataHeaderTenant: false,
    },
  );
};
// 获取菜单分页
export function doMenuPage(params: Recordable<any>) {
  return requestClient.post<Array<SystemMenuApi.SystemMenu>>(
    Api.menuPage,
    params,
  );
}
// 获取菜单权限树
export function doMenuPrivilegeTree() {
  return requestClient.get(Api.menuPrivilegeTree);
}
// 获取菜单权限树
export function doTenantMenuPrivilegeTree(params: Recordable<any>) {
  return requestClient.get(Api.tenantMenuPrivilegeTree, { params });
}

// 查询所有菜单
export function doMenuAll() {
  return requestClient.get(Api.menuAll);
}
// 保存菜单
export function doMenuSave(params: Recordable<any>) {
  return requestClient.post(Api.menuSave, params);
}
// 删除菜单
export function doMenuRemove(params: Recordable<any>) {
  return requestClient.get(Api.menuRemove, { params });
}
// 菜单详情
export function doMenuDetail(params: Recordable<any>) {
  return requestClient.get(Api.menuDetail, { params });
}
// 菜单树
export function doMenuTree(params: Recordable<any>) {
  return requestClient.post<Recordable<any>>(Api.menuTree, params);
}
/**
 * @description: 权限协议
 */
// 保存权限
export function doPrivilegeSave(params: Recordable<any>) {
  return requestClient.post(Api.privilegeSave, params);
}
// 删除权限
export function doPrivilegeRemove(params: Recordable<any>) {
  return requestClient.get(Api.privilegeRemove, { params });
}
// 权限详情
export function doPrivilegeDetail(params: Recordable<any>) {
  return requestClient.get(Api.privilegeDetail, { params });
}
