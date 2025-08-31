import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  export interface Result {
    access_token: string;
    refresh_token: string;
  }

  export interface DataResult {
    code: number;
    data: Result;
    message: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    data: DataResult;
  }

  export interface RefreshTokenResult {
    data: DataResult;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return baseRequestClient.post<AuthApi.LoginResult>(
    '/webapi/bean/user/login',
    data,
  );
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi(refreshToken: string) {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>(
    '/webapi/bean/user/login',
    {
      grantType: 'refresh_token',
      loginType: 'WEB_ACCOUNT',
      refreshToken: {
        refreshToken,
      },
    },
  );
}

/**
 * 退出登录
 */
export async function logoutApi(loginType = 'WEB_ACCOUNT') {
  return requestClient.get('/webapi/bean/user/logout', {
    params: { loginType },
  });
}
