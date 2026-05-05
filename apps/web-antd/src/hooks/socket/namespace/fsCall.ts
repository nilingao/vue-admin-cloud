import type { Socket } from 'socket.io-client';

import type { Namespace, SocketModel } from '../common';

import { SocketNamespace, SocketOutEvent } from '#/enums/SocketEnum';
import rootSocketEmitter from '#/hooks/socket/rootSocketEmitter';

class FsCallNamespace implements Namespace {
  private readonly namespace: SocketNamespace;
  private readonly path: string;
  private socket?: Socket;
  private readonly token: boolean;

  constructor() {
    this.namespace = SocketNamespace.AGENT_NAMESPACE;
    this.path = '/fs-socket/socket.io';
    this.token = true;
  }

  // 获取当前类参数
  getParam(): SocketModel {
    return {
      namespace: this.namespace,
      init: false,
      token: this.token,
      path: this.path,
    };
  }
  getSocket() {
    return this.socket;
  }
  // 设置当前Socket
  setSocket(socket: Socket) {
    this.socket = socket;
    // 设置事件
    this.setEvent();
  }
  private setEvent() {
    if (!this.socket) return;
    this.socket.on(SocketOutEvent.AGENT_OUT_LOGIN, (data: any) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_LOGIN, data);
    });
    this.socket.on(SocketOutEvent.AGENT_OUT_PUSH_PATH, (data: any) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_PUSH_PATH, data);
    });
    this.socket.on(SocketOutEvent.AGENT_OUT_STATUS, (data: any) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_STATUS, data);
    });
    this.socket.on(SocketOutEvent.AGENT_OUT_PUSH_PATH_LOGOUT, (data: any) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_PUSH_PATH_LOGOUT, data);
    });
    this.socket.on(SocketOutEvent.AGENT_OUT_CALL_PHONE, (data: any) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_CALL_PHONE, data);
    });
    this.socket.on(SocketOutEvent.AGENT_OUT_HANG_UP_PHONE, (data: any) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_HANG_UP_PHONE, data);
    });
    this.socket.on(SocketOutEvent.AGENT_OUT_PHONE_NOTIFICATION, (data: any) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_PHONE_NOTIFICATION, data);
    });
    this.socket.on(SocketOutEvent.AGENT_OUT_CALL_NOTIFICATION, (data: any) => {
      rootSocketEmitter.emit(SocketOutEvent.AGENT_OUT_CALL_NOTIFICATION, data);
    });
  }
}

export default FsCallNamespace;
