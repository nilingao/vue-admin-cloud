import type { UserInfo } from '#/store';
import type { ErrorMessageMode } from '#/axios';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { PageEnum } from '@/enums/pageEnum';
import {
  ROLES_KEY,
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_INFO_KEY,
  CHECK_URL_TOKEN_KEY,
  ABILITY_KEY,
  SEARCH_TENANT_KEY,
} from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { GetUserInfoModel, LoginParams } from '@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi } from '@/api/sys/user';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { router } from '@/router';
import { usePermissionStore } from '@/store/modules/permission';
import { SystemEnum } from '@/enums/systemEnum';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { useSystemStore } from './system';
import { isArray } from '@/utils/is';
import { h } from 'vue';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  searchTenant?: string | number | undefined;
  checkUrl?: string | undefined;
  refresh_token?: string;
  roleList: Array<string>;
  abilityList: Array<string>;
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // searchTenant
    searchTenant: undefined,
    // token
    token: undefined,
    // refresh_token
    refresh_token: undefined,
    // roleList
    roleList: [],
    // 权限集合
    abilityList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    // 点击的菜单
    checkUrl: undefined,
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRefreshToken(state): string {
      return state.refresh_token || getAuthCache<string>(REFRESH_TOKEN_KEY);
    },
    getRoleList(state): Array<string> {
      return state.roleList && state.roleList.length > 0
        ? state.roleList
        : getAuthCache<Array<string>>(ROLES_KEY);
    },
    getAbilityList(state): Array<string> {
      return state.abilityList && state.abilityList.length > 0
        ? this.abilityList
        : getAuthCache<Array<string>>(ABILITY_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
    getCheckUrl(state): string | undefined {
      return state.checkUrl;
    },
    getSearchTenant(state): string | number | undefined {
      return state.searchTenant || getAuthCache<number>(SEARCH_TENANT_KEY);
    },
  },
  actions: {
    setToken(info: string | undefined, refresh_token: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      this.refresh_token = refresh_token ? refresh_token : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
      setAuthCache(REFRESH_TOKEN_KEY, refresh_token);
    },
    setRefreshToken(refresh_token: string | undefined) {
      this.refresh_token = refresh_token ? refresh_token : ''; // for null or undefined value
      setAuthCache(REFRESH_TOKEN_KEY, refresh_token);
    },
    setRoleList(roleList: Array<string>) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setAbilityList(abilityList: Array<string>) {
      this.abilityList = abilityList;
      setAuthCache(ABILITY_KEY, abilityList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    setCheckUrl(url: string | undefined) {
      this.checkUrl = url;
      setAuthCache(CHECK_URL_TOKEN_KEY, url);
    },
    setSearchTenant(searchTenant: string | number | undefined) {
      this.searchTenant = searchTenant;
      setAuthCache(SEARCH_TENANT_KEY, searchTenant);
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { access_token, refresh_token } = data;
        // save token
        this.setToken(access_token, refresh_token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * @description: refreshToken
     */
    async refreshToken() {
      try {
        const data = await loginApi({
          grantType: 'refresh_token',
          loginType: 'WEB_ACCOUNT',
          refreshToken: {
            refreshToken: this.getRefreshToken,
          },
        });
        const { access_token, refresh_token } = data;
        // save token
        this.setToken(access_token, refresh_token);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();

        // 动态路由加载（首次）
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          // 记录动态路由加载完成
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      const systemStore = useSystemStore();
      if (!this.getToken) return null;
      systemStore.getSystemConfigAction(); //加载权限配置信息
      systemStore.getAreaListAction(); //加载省市区配置信息
      systemStore.getDictMapAction(); //加载后端字典配置类
      const userInfo = await getUserInfo();
      const { roleIdList = [], privilegeList = [], imageUrl } = userInfo;
      if (isArray(roleIdList)) {
        this.setRoleList(roleIdList);
      } else {
        this.setRoleList([]);
      }
      if (isArray(privilegeList)) {
        this.setAbilityList(privilegeList);
      }
      if (imageUrl) {
        userInfo.imageUrl = systemStore.getSystemConfigMap[SystemEnum.SYSTEM_PATH] + imageUrl;
      }
      this.setUserInfo(userInfo);

      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        doLogout({loginType:'WEB_ACCOUNT'}).then(() => {
          this.close(goLogin);
          console.log('注销Token成功');
        }).catch(() => {
          console.log('注销Token失败');
        }).finally(() => {
          this.close(goLogin);
        });
      }else{
        this.close(goLogin);
      }
    },
    //清空缓存
    close(goLogin = false) {
      const systemStore = useSystemStore();
      this.setToken(undefined, undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      systemStore.setSystemConfigMap({}); //清空配置信息
      if (goLogin) {
        // 直接回登陆页
        router.replace(PageEnum.BASE_LOGIN);
      } else {
        // 回登陆页带上当前路由地址
        router.replace({
          path: PageEnum.BASE_LOGIN,
          query: {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          },
        });
      }    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          // 主动登出，不带redirect地址
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
