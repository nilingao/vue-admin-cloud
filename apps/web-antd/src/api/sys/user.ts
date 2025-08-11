import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface AuthorizationCodeParams {
  code: string;
  redirectUri: string;
}
export interface CodeParams {
  username: string;
  password: string;
  key: string;
  verificationCode: string;
}
export interface SmsParams {
  smsCodeCode: string;
  phone: string;
}
export interface RefreshTokenParams {
  refreshToken: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: number | string;
  access_token: string;
  refresh_token: string;
  role?: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  /**
   * 用户编号
   */
  id: number | string;
  /**
   * 用户姓名
   */
  userName: string;
  /**
   * 用户昵称
   */
  nickName?: string;
  /**
   * 用户图像
   */
  imageUrl: string;
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
   * 用户角色
   */
  roleIdList?: Array<string>;
  /**
   * 用户职位
   */
  positionIdList?: Array<string>;
  /**
   * 用户部门
   */
  departmentIdList?: Array<string>;
  /**
   * 用户权限
   */
  privilegeList?: Array<string>;
}
export interface LoginParams {
  grantType:
    | 'authorization_code'
    | 'client_credentials'
    | 'code'
    | 'implicit'
    | 'password'
    | 'refresh_token'
    | 'sms';
  loginType: string;
  authorizationCode?: AuthorizationCodeParams;
  code?: CodeParams;
  sms?: SmsParams;
  refreshToken?: RefreshTokenParams;
}
export interface UserPageModel {
  userId: number | string;
  loginAccount: string;
  userName: string;
  nickName: string;
  idCard: string;
  phone: string;
  address: string;
  loginLastTime: string;
}
export interface UserInfoModel {
  // 用户id
  id?: number | string;
  // 头像
  imageUrl: string;
  // 用户名
  userName: string;
  // 昵称
  nickName?: string;
  // 手机号
  phone?: string;
  // 男女
  gender?: number;
  // 身份证
  idCard?: string;
  // 地址
  address?: string;
  // 备注
  memo?: string;
  // 是否系统管理员
  isAdmin?: number;
  // 是否禁用
  isEnabled?: number;
  // 省区编码
  provinceId?: number;
  // 市区编码
  cityId?: number;
  // 区域编码
  areaId?: number;
}

export interface RememberLoing {
  rememberMe: boolean;
  username: string;
  password: string;
}
enum Api {
  // 获取用户列表信息
  choiceUserPage = '/webapi/bean/user/choice_user_page',
  // 删除用户
  delete = '/webapi/bean/user/delete',
  // 用户信息下拉展示(动态搜索数据源)
  findExportEntityInfo = '/webapi/bean/user/find_export_entity_info',
  // 用户信息下拉展示(动态搜索数据源)
  findExportUrl = '/webapi/bean/user/find_export_url',
  // 根据当前登陆用户获取绑定其他端登陆账户
  findUserBind = '/webapi/bean/user/find_user_bind',
  // 生成验证码的接口
  getCode = '/webapi/bean/user/getcode',
  // 获取用户部门
  GetUserDepartment = '/webapi/bean/user/user_connect_department',
  // 获取当前登录用户信息
  GetUserInfo = '/webapi/bean/user/login_info',
  // 获取用户列表信息
  GetUserPage = '/webapi/bean/user/page',
  // 获取用户职位
  GetUserPosition = '/webapi/bean/user/user_connect_position',
  // 获取用户角色
  GetUserRole = '/webapi/bean/user/user_connect_role',
  // 新增用户
  insert = '/webapi/bean/user/insert',
  // 保存用户部门
  SaveUserDepartment = '/webapi/bean/user/save_user_department',
  // 保存用户职位
  SaveUserPosition = '/webapi/bean/user/save_user_position',
  // 保存用户角色
  SaveUserRole = '/webapi/bean/user/save_user_role',
  // 用户信息下拉展示(动态搜索数据源)
  select = '/webapi/bean/user/select',
  // 发送短信
  SmsSend = '/webapi/sms/sms_send/send',
  // web用户解绑小程序用户
  unbindMiniWeb = '/webapi/mini/unbind_mini_web',
  // 修改用户
  update = '/webapi/bean/user/update',
  // 修改用户
  updateLoginUserInfo = '/webapi/bean/user/update_login_user_info',
  // 获取用户信息
  UserInfo = '/webapi/bean/user/info',
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return requestClient.get<GetUserInfoModel>(Api.GetUserInfo, {
    dataHeaderTenant: false,
  });
}

export function UserInfoApi(params: Recordable<any>) {
  return requestClient.get<UserInfoModel>(Api.UserInfo, { params });
}

export function doSelect(params: Recordable<any>) {
  return requestClient.get(Api.select, { params });
}

/**
 * @description: 获取用户分页接口
 */
export function getUserPage(params: Recordable<any>) {
  return requestClient.post<UserPageModel>(Api.GetUserPage, params);
}

/**
 * @description: 获取用户分页接口
 */
export function getChoiceUserPage(params: Recordable<any>) {
  return requestClient.post<UserPageModel>(Api.choiceUserPage, params);
}

export function doInsert(params: Recordable<any>) {
  return requestClient.post(Api.insert, params);
}

export function doUpdate(params: Recordable<any>) {
  return requestClient.post(Api.update, params);
}

export function doUpdateLoginUserInfo(params: Recordable<any>) {
  return requestClient.post(Api.updateLoginUserInfo, params);
}

export function doFindUserBind() {
  return requestClient.get(Api.findUserBind);
}

export function doDelete(params: Recordable<any>) {
  return requestClient.get(Api.delete, { params });
}

export function GetUserRole(params: Recordable<any>) {
  return requestClient.get(Api.GetUserRole, { params });
}

export function SaveUserRole(params: Recordable<any>) {
  return requestClient.post(Api.SaveUserRole, params);
}

export function GetUserDepartment(params: Recordable<any>) {
  return requestClient.get(Api.GetUserDepartment, { params });
}

export function SaveUserDepartment(params: Recordable<any>) {
  return requestClient.post(Api.SaveUserDepartment, params);
}

export function GetUserPosition(params: Recordable<any>) {
  return requestClient.get(Api.GetUserPosition, { params });
}

export function SaveUserPosition(params: Recordable<any>) {
  return requestClient.post(Api.SaveUserPosition, params);
}

export function doGetCode() {
  return requestClient.post(Api.getCode);
}

export function doExportEntityInfo(params: Recordable<any>) {
  return requestClient.get(Api.findExportEntityInfo, { params });
}

export function doExportUrl(params: Recordable<any>) {
  return requestClient.post(Api.findExportUrl, params, {
    responseType: 'blob',
  });
}
export function doUnBindMiniWeb() {
  return requestClient.post(Api.unbindMiniWeb);
}
