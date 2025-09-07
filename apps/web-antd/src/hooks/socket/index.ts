import type { Namespace } from './common';

import { watch } from 'vue';

import { useAccessStore } from '@vben/stores';

import { SocketNamespace } from '#/enums/SocketEnum';
import { useSocketStore } from '#/store/model';

/**
 * 初始化加载的socket
 */
export async function useInitSocket() {
  const accessStore = useAccessStore();
  const useSocket = useSocketStore();
  // 获取namespace 下所有空间
  const namespaceFiles: Record<string, any> = import.meta.glob(
    './namespace/*.ts',
    {
      eager: true,
    },
  );
  Object.keys(namespaceFiles).forEach((key: string) => {
    const NamespaceClass = namespaceFiles[key].default;
    const namespace: Namespace = new NamespaceClass();
    useSocket.setNamespaceMap(namespace);
  });
  watch(
    () => accessStore.accessToken,
    () => {
      Object.keys(useSocket.getNamespaceMap).forEach(
        async (key: SocketNamespace | string) => {
          let nameSpace: Namespace = useSocket.getNamespace(
            key as SocketNamespace,
          );
          if (!nameSpace) {
            nameSpace = useSocket.getNamespaceMap[key] as Namespace;
          }
          const socket = nameSpace.getSocket();
          if (socket) {
            socket.disconnect();
          }
        },
      );
      Object.keys(useSocket.getNamespaceMap).forEach(
        async (key: SocketNamespace | string) => {
          let nameSpace: Namespace = useSocket.getNamespace(
            key as SocketNamespace,
          );
          if (!nameSpace) {
            nameSpace = useSocket.getNamespaceMap[key] as Namespace;
          }
          const param = nameSpace.getParam();
          if (!param.init) {
            return;
          }
          if (accessStore.accessToken) {
            await useSocket.setSocketMap(nameSpace, accessStore.accessToken);
          } else if (!param.token) {
            await useSocket.setSocketMap(nameSpace, undefined);
          }
        },
      );
    },
    { immediate: true },
  );
}
// Fs通话模块加载的
export async function useFsSocket(
  namespace: SocketNamespace,
  socketUrl?: string,
) {
  const accessStore = useAccessStore();
  const useSocket = useSocketStore();
  watch(
    () => accessStore.accessToken,
    async () => {
      let nameSpace: Namespace = useSocket.getNamespace(namespace);
      if (!nameSpace) {
        nameSpace = useSocket.getNamespaceMap[namespace] as Namespace;
      }
      if (!accessStore.accessToken) {
        return;
      }
      // 创建Socket监听
      await useSocket.setSocketMap(
        nameSpace,
        accessStore.accessToken,
        socketUrl,
      );
    },
    { immediate: true },
  );
}
