import type { Namespace, SocketModel } from '../common';

import { Socket } from 'socket.io-client';

import { SocketNamespace, SocketOutEvent } from '#/enums/SocketEnum';
import rootSocketEmitter from '#/hooks/socket/rootSocketEmitter';

class PublicMemberNamespace implements Namespace {
  private readonly namespace: SocketNamespace;
  private readonly path: string;
  private socket: Socket;
  private readonly token: boolean;

  constructor() {
    this.namespace = SocketNamespace.PUBLIC_MEMBER_NAMESPACE;
    this.path = '/sms-socket/socket.io';
    this.token = true;
  }
  // 获取当前类参数
  getParam(): SocketModel {
    return {
      namespace: this.namespace,
      init: true,
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
    // 监听事件
    this.socket.on(SocketOutEvent.PUBLIC_MEMBER_EVENT, (data: any) => {
      rootSocketEmitter.emit(SocketOutEvent.PUBLIC_MEMBER_EVENT, data);
    });
  }
}
export default PublicMemberNamespace;
