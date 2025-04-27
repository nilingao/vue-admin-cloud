import { defineStore } from 'pinia';
import { store } from '@/store';
import { SocketNamespace, SocketInEvent } from '../../enums/SocketEnum';
import io, { Socket } from 'socket.io-client';
import { Namespace } from '@/hooks/socket/common';

interface SocketState {
  socketMap: Recordable<Socket> | {};
}
export const useSocketStore = defineStore({
  id: 'app-socket',
  state: (): SocketState => ({
    socketMap: {},
  }),
  getters: {
    getSocketMap(): Recordable<Socket> | {} {
      return this.socketMap;
    },
  },
  actions: {
    /**
     * 创建socket
     * @param namespace 空间名
     * @param token 是否添加token
     * @returns
     */
    setSocketMap(
      namespace: Namespace,
      token?: string,
      socketUrl?: string,
      path: string = '/sms-socket/socket.io',
    ): void {
      let nameSpace: Namespace = this.getNamespace(namespace.getParam().namespace);
      if (!nameSpace) {
        nameSpace = namespace;
      }
      let socket: Socket = nameSpace.getSocket();
      if (socket) {
        socket.disconnect();
      }
      const query = token
        ? {
            Authorization: 'Bearer ' + token,
          }
        : {};
      const url =
        (socketUrl ? socketUrl : import.meta.env.VITE_SOCKET_URL) + nameSpace.getParam().namespace;
      socket = io(url, {
        //自动链接
        autoConnect: false,
        //重新链接
        reconnection: true,
        //重新链接的最大延迟（毫秒）
        reconnectionDelayMax: 5000,
        //链接地址
        path: path,
        //请求附加参数
        query: query,
        transports: ['websocket', 'polling'],
        // 请求头
        // extraHeaders: {},
      });
      socket.connect();
      //设置socket公共事件
      setEvent(socket);
      //设置socket独立事件
      nameSpace.setSocket(socket);
      //缓存socket空间
      this.socketMap[nameSpace.getParam().namespace] = nameSpace;
    },
    getNamespace(namespace: SocketNamespace): Namespace {
      return this.socketMap[namespace];
    },
    delNamespace(namespace: SocketNamespace): void {
      const nameSpace: Namespace = this.socketMap[namespace];
      if (nameSpace) {
        nameSpace.getSocket()?.disconnect();
        delete this.socketMap[namespace];
      }
    },
    sendMessage(namespace: SocketNamespace, event: SocketInEvent, message: any) {
      const nameSpace: Namespace = this.socketMap[namespace];
      if (!nameSpace) {
        new Error('socket is null! namespace:' + namespace);
      }
      nameSpace.getSocket()?.emit(event, message);
    },
  },
});

/**
 * 设置监听公共事件
 * @param socket 客户端
 * @param reconnectCount 重连次数
 * @param reconnectErrorCount 默认错误次数
 */
const setEvent = (socket: Socket, reconnectCount = 0, reconnectErrorCount = 10) => {
  if (socket) {
    //https://socket.io/docs/v2/client-api/#event-error
    socket?.on('connect', () => {
      console.log('开启链接！！！');
    });
    //发生错误时激发
    socket?.on('error', (e) => {
      console.log('errer:' + e);
    });
    //在连接错误时激发
    socket?.on('connect_error', () => {
      console.log('connect_error');
    });
    //在连接超时时激发
    socket?.on('connect_timeout', () => {
      console.log('connect_timeout');
    });
    //在成功的重新连接后发射。
    socket?.on('reconnect', () => {
      console.log('reconnect');
    });
    //在成功的重新连接后发射。
    socket?.on('reconnect_attempt', () => {
      reconnectCount = reconnectCount + 1;
      console.log('reconnect_attempt');
    });
    //试图重新连接时被触发。
    socket?.on('reconnecting', () => {
      if (reconnectErrorCount <= reconnectCount) {
        console.log('重连次数超出' + reconnectErrorCount + '次');
        socket.disconnect();
      }
      console.log('reconnecting');
    });
    //在尝试重新连接错误时激发。
    socket?.on('reconnect_error', () => {
      console.log('reconnect_error');
    });
    //当客户端无法在中重新连接时激发
    socket?.on('reconnect_failed', () => {
      console.log('reconnect_failed');
    });
  }
};
// Need to be used outside the setup
export function useSocketWithOut() {
  return useSocketStore(store);
}
