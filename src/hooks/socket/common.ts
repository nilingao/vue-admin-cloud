import { Socket } from 'socket.io-client';
import { SocketNamespace } from '@/enums/SocketEnum';
/**
 * @description: 空间类方法
 */
export interface Namespace {
  //获取空间参数
  getParam(): SocketModel;
  //设置socket
  setSocket(socket: Socket): void;
  //获取socket
  getSocket(): Socket;
}

/**
 * @description: socket类型
 */
export interface SocketModel {
  //空间名
  namespace: SocketNamespace;
  //值
  init: Boolean;
  //值
  token: Boolean;
  //请求socket地址
  path: String;
}
