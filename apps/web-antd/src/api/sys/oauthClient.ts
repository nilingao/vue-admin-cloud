import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * OAuth 客户端
 */
export interface OauthClientEntity extends Recordable<any> {
  /** 认证令牌时效，单位秒 */
  accessTokenValidity?: number;
  /** 扩展信息 */
  additionalInformation?: string;
  /** 权限列表 */
  authorities?: string;
  /** 授权方式，逗号分隔 */
  authorizedGrantTypes?: string;
  /** 是否自动放行 */
  autoapprove?: string;
  /** 客户端 ID */
  clientId?: string;
  /** 客户端密钥 */
  clientSecret?: string;
  /** 刷新令牌时效，单位秒 */
  refreshTokenValidity?: number;
  /** 资源 ID 列表 */
  resourceIds?: string;
  /** 授权范围 */
  scope?: string;
  /** 回调地址 */
  webServerRedirectUri?: string;
}

export type OauthClientParams = Recordable<any>;

export type OauthClientPageResultModel = Recordable<OauthClientEntity>;

enum Api {
  /** OAuth 客户端详情 */
  detail = '/webapi/config/oauth_client/detail',
  /** OAuth 客户端分页 */
  page = '/webapi/config/oauth_client/page',
  /** 删除 OAuth 客户端 */
  remove = '/webapi/config/oauth_client/remove',
  /** 保存 OAuth 客户端 */
  save = '/webapi/config/oauth_client/save',
}

export function getOauthClientPage(params: OauthClientParams) {
  return requestClient.post<OauthClientPageResultModel>(Api.page, params);
}

export function doOauthClientSave(params: OauthClientEntity) {
  return requestClient.post(Api.save, params);
}

export function doOauthClientRemove(
  params: Pick<OauthClientEntity, 'clientId'>,
) {
  return requestClient.get(Api.remove, { params });
}

export function doOauthClientDetail(
  params: Pick<OauthClientEntity, 'clientId'>,
) {
  return requestClient.get<OauthClientEntity>(Api.detail, { params });
}
