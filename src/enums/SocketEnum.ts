/**
 * @description: Request result set
 */
export enum ResultEnum {
  SUCCESS = 0, //操作完成
  OVERDUE = 1, //二维码已过期
  ERROR = 2, //操作错误
}
//socket空间
export enum SocketNamespace {
  PUBLIC_MEMBER_NAMESPACE = 'public_member_namespace', //通知公告
  QR_NAMESPACE = 'qr_namespace', //微信扫码
  //-----以下客服事件---------
  AGENT_NAMESPACE = 'socket_agent', //客服相关操作socket
}

//socket发送事件
export enum SocketInEvent {
  IN_LOGIN_QR_CODE_EVENT = 'in_login_qr_code_event', //发送二维码信息
  //-----以下客服事件---------
  AGENT_IN_STATUS = 'AGENT:IN:STATUS', //客服信息请求
  AGENT_IN_CALL_PHONE = 'AGENT:IN:CALL_PHONE', //客服拨打电话
  AGENT_IN_HANG_UP_PHONE = 'AGENT:IN:HANG_UP_PHONE', //客服挂断电话
  AGENT_IN_CALL_NOTIFICATION = 'AGENT:IN:CALL_NOTIFICATION', //客服来电操作
}

//socket监听事件
export enum SocketOutEvent {
  OUT_LOGIN_QR_CODE_EVENT = 'out_login_qr_code_event', //二维码信息
  OUT_LOGIN_INFO_EVENT = 'out_login_info_event', //登陆信息
  OUT_LOGIN_BIND_EVENT = 'out_login_bind_event', //绑定信息
  PUBLIC_MEMBER_EVENT = 'public_member_event', //平台通知信息
  //-----以下客服事件---------
  AGENT_OUT_LOGIN = 'AGENT:OUT:LOGIN', //登陆回调回调
  AGENT_OUT_STATUS = 'AGENT:OUT:STATUS', //客服信息通知
  AGENT_OUT_PUSH_PATH = 'AGENT:OUT:PUSH_PATH', //客服回调推流地址
  AGENT_OUT_PUSH_PATH_LOGOUT = 'AGENT:OUT:PUSH_PATH_LOGOUT', //客服推流关闭
  AGENT_OUT_CALL_PHONE = 'AGENT:OUT:CALL_PHONE', //推流回调
  AGENT_OUT_HANG_UP_PHONE = 'AGENT:OUT:HANG_UP_PHONE', //客服挂断电话回调
  AGENT_OUT_PHONE_NOTIFICATION = 'AGENT:OUT:PHONE_NOTIFICATION', //客服消息通知回调
  AGENT_OUT_CALL_NOTIFICATION = 'AGENT:OUT:CALL_NOTIFICATION', //客服来电回调
}

//socket监听事件
export enum SocketData {
  WX_MINI_QR_LOGIN_DATA = 1, //微信小程序二维码登录
  WX_MINI_QR_BIND_DATA = 2, //微信小程序二维码绑定web
}
