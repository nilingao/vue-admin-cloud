---
name: video-play
description: >
  GB28181 视频监控播放链路复用指南：VideoPlayModal 播放弹窗、VideoJessibucaPlay
  播放器、buildVideoPlayOptions 播放地址构建、云台/录像控制。Use when building video
  playback, 视频监控, 播放弹窗, 分屏播放, Jessibuca, 云台控制, PTZ, 录像回放, GB28181,
  or modifying apps/web-antd/src/views/video/** or components/Video/**.
---

# 视频播放链路（复用，勿重造播放器）

链路：后端返回 `VideoPlayResult` → `buildVideoPlayOptions()` 构建多协议地址 → `VideoPlayModal` 弹窗（选流 + 云台 + 测速）→ 内部 `VideoJessibucaPlay` 实际播放。play/proxy/push/dispatch/channel 五个页面已复用同一套。

## 播放弹窗（最常用）

```ts
import VideoPlayModal from '../modules/VideoPlayModal.vue';
const [PlayModal, playModalApi] = useVbenModal({ connectedComponent: VideoPlayModal, destroyOnClose: true });

// 拿到播放数据后打开（data 为 doXxxGetPlayUrl / doPlayStart 的返回）
const data = await doProxyGetPlayUrl({ id: row.id });
playModalApi.setData(data).open();
```

- 弹窗内部已处理：多协议选流（FLV/WS-FLV/TS/HLS/RTC）、token 拼接、云台 PTZ（`doPtzPtz/Focus/Iris`）、测速、流信息轮询
- 模板放 `<PlayModal />` 即可，无需传 props

## 直接用播放器（弹窗不满足时，如分屏调度台）

```ts
import { VideoJessibucaPlay } from '#/components/Video';
// <VideoJessibucaPlay ref="playerRef" :video-url="url" :is-mute="true" />
// playerRef.value.play(url) / .pause() / .destroy()；底层 useJessibuca 已封装 WASM 加载/重连/resize
```

- 播放地址构建统一用 `buildVideoPlayOptions(data, token)` + `getDefaultStreamPlayType()`（`views/video/modules/video-play-url.ts`，有单测，**勿自己拼 URL**）
- 分屏参考 `views/video/dispatch/`（通道树 + 1/4/9 分屏）

## WebRTC（FreeSWITCH 对讲，非监控）

`FsRtcPlay` + `useFsRtc`（`#/components/Video`），配合 `fs/call` 的 socket AGENT 事件，见 `socket-namespace` skill。

## API 与常量

- 接口全在 `api/video/*`：`device/deviceChannel/play/record/ptz/platform/mediaServer/proxy/push/audioPush`，命名遵循 `api-wrapper` skill
- 视频域字典 key 常量在 `enums/commonEnum.ts`（TRANSPORT_TYPE_ENUM/DEVICE_TYPE_ENUM/PTZ_TYPE_ENUM…），配合 `system-dict` skill 的 `useSystemStore().dictMap` 翻译成中文

## 硬规则

- 新增视频页优先复用 `VideoPlayModal`；确需自定义才用 `VideoJessibucaPlay`
- 播放器脚本（jessibuca decoder）在 `public/script/jessibuca/`，已配 CDN 版本参数，勿重复引入第三方播放器库
