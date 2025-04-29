import { useUserStore } from '@/store/modules/user';
import { useSocketStore } from '@/store/modules/socket';
import { SocketNamespace } from '@/enums/SocketEnum';
import { watch } from 'vue';
import { Namespace } from './common';
/**
 * 初始化加载的socket
 */
export async function useInitSocket() {
  const userStore = useUserStore();
  const useSocket = useSocketStore();
  //获取namespace 下所有空间
  const namespaceFiles: Record<SocketNamespace, any> = import.meta.glob('./namespace/*.ts', {
    eager: true,
  });
  Object.keys(namespaceFiles).forEach((key: string | SocketNamespace) => {
    const namespace: Namespace = new namespaceFiles[key].default();
    useSocket.setNamespaceMap(namespace);
  });
  watch(
    () => userStore.getToken,
    () => {
      Object.keys(useSocket.getNamespaceMap).forEach(async (key: string | SocketNamespace) => {
        let nameSpace: Namespace = useSocket.getNamespace(key as SocketNamespace);
        if (!nameSpace) {
          nameSpace = useSocket.getNamespaceMap[key] as Namespace;
        }
        const socket = nameSpace.getSocket();
        if (socket) {
          socket.disconnect();
        }
      });
      Object.keys(useSocket.getNamespaceMap).forEach(async (key: string | SocketNamespace) => {
        let nameSpace: Namespace = useSocket.getNamespace(key as SocketNamespace);
        if (!nameSpace) {
          nameSpace = useSocket.getNamespaceMap[key] as Namespace;
        }
        const param = nameSpace.getParam();
        if (!param.init) {
          return;
        }
        if (userStore.getToken) {
          await useSocket.setSocketMap(nameSpace, userStore.getToken);
        } else if (!param.token) {
          await useSocket.setSocketMap(nameSpace, undefined);
        }
      });
    },
    { immediate: true },
  );
}
//Fs通话模块加载的
export async function useFsSocket(namespace: SocketNamespace, socketUrl?: string) {
  const userStore = useUserStore();
  const useSocket = useSocketStore();
  watch(
    () => userStore.getToken,
    async () => {
      let nameSpace: Namespace = useSocket.getNamespace(namespace);
      if (!nameSpace) {
        nameSpace = useSocket.getNamespaceMap[namespace] as Namespace;
      }
      if (!userStore.getToken) {
        return;
      }
      //创建Socket监听
      await useSocket.setSocketMap(nameSpace, userStore.getToken, socketUrl);
    },
    { immediate: true },
  );
}
