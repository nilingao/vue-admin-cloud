---
name: socket-namespace
description: >
  新增 socket.io 实时功能的插件式流程：在 hooks/socket/namespace/ 加一个类文件即被
  useInitSocket 自动注册，事件经 rootSocketEmitter 解耦分发。Use when adding realtime
  features, socket.io, websocket, 实时推送, 扫码登录, 客服通话事件, AGENT events,
  "socket namespace", or modifying apps/web-antd/src/hooks/socket/**.
---

# Socket Namespace 插件模式

架构：`useInitSocket()`（bootstrap.ts 调用）用 `import.meta.glob('./namespace/*.ts')` **自动注册**所有 namespace 类 → watch accessToken 建连/断连 → 各 namespace 在 `setSocket` 里把 socket 事件转发到全局 `rootSocketEmitter`（mitt）→ 组件只订阅 emitter，与 socket 解耦。

## 新增一个实时功能的步骤

1. **加事件常量**：`src/enums/SocketEnum.ts` 的 `SocketNamespace`（命名空间枚举）、`SocketOutEvent`/`SocketInEvent`（事件名）
2. **建 namespace 类**：`src/hooks/socket/namespace/<name>.ts`，照抄 `fsCall.ts` 结构：

```ts
class XxxNamespace implements Namespace {
  private readonly namespace = SocketNamespace.XXX_NAMESPACE;
  private readonly path = '/xxx-socket/socket.io';
  private readonly token = true; // 是否需要 accessToken 才建连
  private socket?: Socket;

  getParam(): SocketModel {
    return { namespace: this.namespace, init: false, token: this.token, path: this.path };
  }
  getSocket() { return this.socket; }
  setSocket(socket: Socket) {
    this.socket = socket;
    socket.on(SocketOutEvent.XXX_EVENT, (data: any) => {
      rootSocketEmitter.emit(SocketOutEvent.XXX_EVENT, data);
    });
  }
}
export default XxxNamespace; // 必须 default 导出，glob 自动注册，勿改 useInitSocket
```

3. **触发建连**：
   - `init: true` → 登录后自动建连（如公告推送 publicMember）
   - `init: false` → 页面里调 `useFsSocket(SocketNamespace.XXX_NAMESPACE)` 按需建连（如 fs/call）
4. **组件消费**：`rootSocketEmitter.on(SocketOutEvent.XXX_EVENT, handler)`，`onUnmounted` 时 `off`

## 现有 namespace（先复用勿重建）

| 文件 | 命名空间/路径 | 用途 |
|---|---|---|
| `fsCall.ts` | AGENT `/fs-socket` | 客服软电话事件（登录/状态/来电/挂断/通知） |
| `loginQr.ts` | `/sms-socket`（免 token） | 微信扫码登录 |
| `publicMember.ts` | 平台公告 | 公告实时推送 |

## 硬规则

- socket URL 来自 `VITE_SOCKET_URL`（.env.development: wss://www.nilongao.cn/）
- 组件**不直接**持有 socket 实例发事件；发送用 `useSocketStore().getNamespace(ns).getSocket().emit(...)` 或经封装
- 事件名一律走 `SocketEnum`，禁止字符串字面量
