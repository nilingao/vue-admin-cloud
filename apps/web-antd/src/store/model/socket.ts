import type { Socket } from 'socket.io-client';

import type { Recordable } from '@vben/types';

import type { Namespace } from '#/hooks/socket/common';

import { message } from 'ant-design-vue';
import { defineStore } from 'pinia';
import VueSocketIO from 'socket.io-client';

import { SocketInEvent, SocketNamespace } from '../../enums/SocketEnum';

interface SocketState {
  namespaceMap: Recordable<Namespace>;
  socketMap: Recordable<Namespace | undefined>;
}

export const useSocketStore = defineStore('app-socket', {
  state: (): SocketState => ({
    namespaceMap: {},
    socketMap: {},
  }),
  getters: {
    getNamespaceMap(): Recordable<Namespace> {
      return { ...this.namespaceMap };
    },
    getSocketMap(): Recordable<Namespace | undefined> {
      return this.socketMap;
    },
  },
  actions: {
    setNamespaceMap(namespace: Namespace): void {
      this.namespaceMap[namespace.getParam().namespace] = namespace;
    },
    /**
     * 创建socket
     * @param namespace 空间名
     * @param token 是否添加token
     * @returns
     */
    async setSocketMap(
      namespace: Namespace,
      token?: string,
      socketUrl?: string,
    ): Promise<void> {
      let nameSpace: Namespace | undefined = this.getNamespace(
        namespace.getParam().namespace,
      );
      if (!nameSpace) {
        nameSpace = namespace;
      }
      let socket = nameSpace.getSocket();
      if (socket) {
        socket.disconnect();
      }
      const query = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};
      const url =
        (socketUrl || import.meta.env.VITE_SOCKET_URL) +
        nameSpace.getParam().namespace;
      socket = new VueSocketIO(url, {
        // 自动链接
        autoConnect: false,
        // 重新链接
        reconnection: true,
        // 创建新的客户端
        forceNew: true,
        // 重新链接的最大延迟（毫秒）
        reconnectionDelayMax: 5000,
        // 链接地址
        path: namespace.getParam().path || '/socket.io',
        // 请求附加参数
        query,
        transports: ['websocket', 'polling'],
        // 请求头
        // extraHeaders: {},
      });
      socket.connect();
      // 设置socket公共事件
      setEvent(socket);
      // 设置socket独立事件
      nameSpace.setSocket(socket);
      // 缓存socket空间
      this.socketMap[nameSpace.getParam().namespace] = nameSpace;
    },
    getNamespace(namespace: SocketNamespace): Namespace | undefined {
      return this.socketMap[namespace];
    },
    delNamespace(namespace: SocketNamespace): void {
      const nameSpace = this.socketMap[namespace];
      if (nameSpace) {
        nameSpace.getSocket()?.disconnect();
        this.socketMap[namespace] = undefined;
      }
    },
    sendMessage(
      namespace: SocketNamespace,
      event: SocketInEvent,
      message: any,
    ) {
      const nameSpace = this.socketMap[namespace];
      if (!nameSpace) {
        throw new Error(`socket is null! namespace:${namespace}`);
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
const setEvent = (
  socket: Socket,
  reconnectCount = 0,
  reconnectErrorCount = 10,
) => {
  if (socket) {
    // https://socket.io/docs/v2/client-api/#event-error
    socket?.on('connect', () => {
      message.info('开启链接！');
    });
    // 发生错误时激发
    socket?.on('error', (e: any) => {
      message.error(`errer:${e}`);
    });
    // 在连接错误时激发
    socket?.on('connect_error', () => {
      message.error(`connect_error`);
    });
    // 在连接超时时激发
    socket?.on('connect_timeout', () => {
      message.error(`connect_timeout`);
    });
    // 在成功的重新连接后发射。
    socket?.on('reconnect', () => {
      message.error(`reconnect`);
    });
    // 在成功的重新连接后发射。
    socket?.on('reconnect_attempt', () => {
      reconnectCount = reconnectCount + 1;
      message.error(`reconnect_attempt`);
    });
    // 试图重新连接时被触发。
    socket?.on('reconnecting', () => {
      if (reconnectErrorCount <= reconnectCount) {
        message.error(`重连次数超出${reconnectErrorCount}次`);
        socket.disconnect();
        return;
      }
      message.error(`reconnecting`);
    });
    // 在尝试重新连接错误时激发。
    socket?.on('reconnect_error', () => {
      message.error(`reconnect_error`);
    });
    // 当客户端无法在中重新连接时激发
    socket?.on('reconnect_failed', () => {
      message.error(`reconnect_failed`);
    });
  }
};
