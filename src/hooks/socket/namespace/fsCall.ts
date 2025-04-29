import { Socket } from 'socket.io-client';
import { SocketModel, Namespace } from '../common';
import { SocketNamespace, SocketOutEvent } from '@/enums/SocketEnum';
import rootSocketEmitter from '@/hooks/socket/rootSocketEmitter';

class FsCallNamespace implements Namespace {
  private socket: Socket;
  private readonly namespace: SocketNamespace;
  private readonly token: Boolean;
  private readonly path: String;

  constructor() {
    this.namespace = SocketNamespace.AGENT_NAMESPACE;
    this.path = '/fs-socket/socket.io';
    this.token = true;
  }

  //获取当前类参数
  getParam(): SocketModel {
    return {
      namespace: this.namespace,
      init: false,
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
    this.socket.on(SocketOutEvent.AGENT_OUT_LOGIN, (data) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_LOGIN, data);
    });
    this.socket.on(SocketOutEvent.AGENT_OUT_PUSH_PATH, (data) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_PUSH_PATH, data);
    });
    this.socket.on(SocketOutEvent.AGENT_OUT_STATUS, (data) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_STATUS, data);
    });
    this.socket.on(SocketOutEvent.AGENT_OUT_PUSH_PATH_LOGOUT, (data) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_PUSH_PATH_LOGOUT, data);
    });
    this.socket.on(SocketOutEvent.AGENT_OUT_CALL_PHONE, (data) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_CALL_PHONE, data);
    });
    this.socket.on(SocketOutEvent.AGENT_OUT_HANG_UP_PHONE, (data) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_HANG_UP_PHONE, data);
    });
    this.socket.on(SocketOutEvent.AGENT_OUT_PHONE_NOTIFICATION, (data) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_PHONE_NOTIFICATION, data);
    });
    this.socket.on(SocketOutEvent.AGENT_OUT_CALL_NOTIFICATION, (data) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_CALL_NOTIFICATION, data);
    });
  }
}

export default FsCallNamespace;
