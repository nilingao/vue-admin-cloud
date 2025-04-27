import { useUserStore } from '@/store/modules/user';
import { useSocketStore } from '@/store/modules/socket';
import { SocketNamespace } from '@/enums/SocketEnum';
import { watch } from 'vue';
import { Namespace } from './common';
import FsCallNamespace from './namespace/fs/fsCall';
/**
 * 初始化加载的socket
 */
export async function useInitSocket() {
  const userStore = useUserStore();
  const useSocket = useSocketStore();
  const notTokenNamespaceMap: Record<SocketNamespace, Namespace> | {} = {},
    tokenNamespaceMap: Record<SocketNamespace, Namespace> | {} = {};
  //获取namespace 下所有空间
  const namespaceFiles: Record<SocketNamespace, any> = import.meta.glob(
    './namespace/init/**/*.ts',
    {
      eager: true,
    },
  );
  Object.keys(namespaceFiles).forEach((key: string | SocketNamespace) => {
    const namespace: Namespace = new namespaceFiles[key].default();
    const param = namespace.getParam();
    if (!param.token) {
      notTokenNamespaceMap[param.namespace] = namespace;
    }
    tokenNamespaceMap[param.namespace] = namespace;
  });
  watch(
    () => userStore.getToken,
    () => {
      Object.keys(tokenNamespaceMap).forEach(async (key: string | SocketNamespace) => {
        let nameSpace: Namespace = useSocket.getNamespace(key as SocketNamespace);
        if (!nameSpace) {
          nameSpace = tokenNamespaceMap[key] as Namespace;
        }
        const socket = nameSpace.getSocket();
        if (socket) {
          socket.disconnect();
        }
      });
      if (userStore.getToken) {
        Object.keys(tokenNamespaceMap).forEach(async (key: string | SocketNamespace) => {
          let nameSpace: Namespace = useSocket.getNamespace(key as SocketNamespace);
          if (!nameSpace) {
            nameSpace = tokenNamespaceMap[key] as Namespace;
          }
          useSocket.setSocketMap(nameSpace, userStore.getToken);
        });
      } else {
        Object.keys(notTokenNamespaceMap).forEach(async (key) => {
          let nameSpace: Namespace = useSocket.getNamespace(key as SocketNamespace);
          if (!nameSpace) {
            nameSpace = notTokenNamespaceMap[key] as Namespace;
          }
          useSocket.setSocketMap(nameSpace);
        });
      }
    },
    { immediate: true },
  );
}
//Fs通话模块加载的
export async function useFsSocket(socketUrl: string, path: string) {
  const userStore = useUserStore();
  const useSocket = useSocketStore();
  watch(
    () => userStore.getToken,
    async () => {
      let nameSpace: Namespace = useSocket.getNamespace(SocketNamespace.AGENT_NAMESPACE);
      if (!nameSpace) {
        nameSpace = new FsCallNamespace() as Namespace;
      }
      if (!userStore.getToken) {
        return;
      }
      //创建Socket监听
      useSocket.setSocketMap(nameSpace, userStore.getToken, socketUrl, path);
    },
    { immediate: true },
  );
}
