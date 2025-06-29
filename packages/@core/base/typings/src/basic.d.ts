interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

interface BasicUserInfo {
  /**
   * 用户id
   */
  id: string;
  /**
   * 头像
   */
  imageUrl: string;
  /**
   * 用户昵称
   */
  nickName: string;
  /**
   * 用户角色
   */
  roleIdList?: string[];
  /**
   * 用户名
   */
  userName: string;
}

type ClassType = Array<object | string> | object | string;

export type { BasicOption, BasicUserInfo, ClassType, SelectOption, TabOption };
