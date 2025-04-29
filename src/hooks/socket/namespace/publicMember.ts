import { Socket } from 'socket.io-client';
import { SocketModel, Namespace } from '../common';
import { SocketNamespace, SocketOutEvent } from '@/enums/SocketEnum';
import rootSocketEmitter from '@/hooks/socket/rootSocketEmitter';

class PublicMemberNamespace implements Namespace {
  private socket: Socket;
  private readonly namespace: SocketNamespace;
  private readonly token: Boolean;
  private readonly path: String;

  constructor() {
    this.namespace = SocketNamespace.PUBLIC_MEMBER_NAMESPACE;
    this.path = '/sms-socket/socket.io';
    this.token = true;
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
    //监听事件
    this.socket.on(SocketOutEvent.PUBLIC_MEMBER_EVENT, (data) => {
      rootSocketEmitter.emit(SocketOutEvent.PUBLIC_MEMBER_EVENT, data);
    });
  }
}
export default PublicMemberNamespace;
