import { Socket } from 'socket.io-client';
import { SocketModel, Namespace } from '../common';
import { SocketNamespace, SocketOutEvent } from '@/enums/SocketEnum';
import rootSocketEmitter from '@/hooks/socket/rootSocketEmitter';

class LoginQrNamespace implements Namespace {
  private socket: Socket;
  private readonly namespace: SocketNamespace;
  private readonly token: Boolean;
  private readonly path: String;

  constructor() {
    this.namespace = SocketNamespace.QR_NAMESPACE;
    this.path = '/sms-socket/socket.io';
    this.token = false;
  }

  //获取当前类参数
  getParam(): SocketModel {
    return {
      namespace: this.namespace,
      init: true,
      token: this.token,
      path: this.path,
    };
  }
  //设置当前Socket
  setSocket(socket: Socket) {
    this.socket = socket;
    //设置事件
    this.setEvent();
  }
  getSocket() {
    return this.socket;
  }
  private setEvent() {
    if (!this.socket) return;
    this.socket.on(SocketOutEvent.OUT_LOGIN_QR_CODE_EVENT, (data) => {
      rootSocketEmitter.emit(SocketOutEvent.OUT_LOGIN_QR_CODE_EVENT, data);
    });
    this.socket.on(SocketOutEvent.OUT_LOGIN_INFO_EVENT, (data) => {
      rootSocketEmitter.emit(SocketOutEvent.OUT_LOGIN_INFO_EVENT, data);
    });
    this.socket.on(SocketOutEvent.OUT_LOGIN_BIND_EVENT, (data) => {
      rootSocketEmitter.emit(SocketOutEvent.OUT_LOGIN_BIND_EVENT, data);
    });
  }
}

export default LoginQrNamespace;
