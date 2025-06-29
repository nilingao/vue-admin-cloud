import type { BasicUserInfo } from '@vben-core/typings';

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
  /**
   * 登录账号
   */
  loginAccount?: string;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 性别
   */
  gender?: number;
  /**
   * 省编码
   */
  provinceId?: number;
  /**
   * 市编码
   */
  cityId?: number;
  /**
   * 区编码
   */
  areaId?: number;
  /**
   * 身份证
   */
  idCard?: string;
  /**
   * 住址
   */
  address?: string;
  /**
   * 备注
   */
  memo?: string;
  /**
   * 最后登录时间
   */
  loginLastTime?: string;
  /**
   * 是否系统管理员
   */
  isAdmin?: number;
  /**
   * 是否启用
   */
  isEnabled?: number;
  /**
   * 租户编号
   */
  tenantId?: number;
  /**
   * 租户是否被禁用
   */
  tenantStatus?: number;
  /**
   * 用户职位
   */
  positionIdList: string[];
  /**
   * 用户部门
   */
  departmentIdList: string[];
  /**
   * 用户权限
   */
  privilegeList: string[];
  /**
   * 用户首页
   */
  homePath?: string;
}

export type { UserInfo };
