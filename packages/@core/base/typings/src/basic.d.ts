interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

interface BasicUserInfo {
  [key: string]: any;
  avatar?: string;
  /**
   * 头像
   */
  imageUrl: string;
  /**
   * 用户昵称
   */
  nickName: string;
  realName?: string;
  /**
   * 用户角色
   */
  roleIdList?: string[];
  /**
   * 用户名
   */
  userName: string;
  username?: string;
}

type ClassType =
  | Array<false | object | string>
  | false
  | null
  | object
  | string;

export type { BasicOption, BasicUserInfo, ClassType, SelectOption, TabOption };
