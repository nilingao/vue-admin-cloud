import type { Ref } from 'vue';

import { ref, unref } from 'vue';

import { merge } from '@vben/utils';

import { isFunction } from '@vben-core/shared/utils';

import { useScriptTag } from '@vueuse/core';

const publicPath = import.meta.env.VITE_BASE || '/';

export interface RtcProps {
  audioEnable?: boolean;
  debug?: boolean;
  funApi: ((sdp: string) => Promise<any>) | undefined;
  recvOnly?: boolean;
  recvSdp?: string;
  simulecast?: boolean;
  usedatachannel?: boolean;
  useCamera?: boolean;
  useDtmf?: boolean;
  videoEnable?: boolean;
}

interface FsRtcEndpoint {
  close: () => void;
  on: (eventName: string, callback: (event?: any) => void) => void;
  pc?: {
    connectionState?: string;
  };
  receive: (sdp?: string) => void;
  sendTones: (message: string) => void;
  start: () => void;
}

declare global {
  interface Window {
    FSRTCClient?: {
      Endpoint: new (options: Record<string, any>) => FsRtcEndpoint;
    };
  }
}

export function useFsRtc(
  rtcProps: RtcProps,
  container?: Ref<HTMLVideoElement | undefined>,
) {
  const success = ref(false);
  const fsRtcClient = ref<FsRtcEndpoint>();
  const localStream = ref(0);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let playTimer: ReturnType<typeof setInterval> | undefined;
  let playTimeout: ReturnType<typeof setTimeout> | undefined;

  useScriptTag(`${publicPath}script/freeswitch/FSRTCClient.js`, () => {
    success.value = true;
  });

  function clearPlayTimers() {
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = undefined;
    }
    if (playTimeout) {
      clearTimeout(playTimeout);
      playTimeout = undefined;
    }
  }

  function eventCallback(type: string, message: string) {
    console.warn(`RTC event type:${type} message:${message}`);
  }

  function createVideoDom() {
    if (!isFunction(rtcProps.funApi) || !window.FSRTCClient?.Endpoint) {
      return false;
    }
    try {
      fsRtcClient.value = new window.FSRTCClient.Endpoint({
        ...merge(
          {
            audioEnable: true,
            debug: false,
            funApi: undefined,
            recvOnly: true,
            simulcast: false,
            usedatachannel: false,
            useDtmf: false,
            useCamera: false,
            videoEnable: true,
          },
          rtcProps || {},
        ),
        element: unref(container) || '',
      });
    } catch (error) {
      console.error('初始化 WebRTC 失败：', error);
      return false;
    }

    fsRtcClient.value.on('WEBRTC_INIT_ZLMSDP_URL_ERR', (event) => {
      eventCallback('加载播放时报错：', event);
    });
    fsRtcClient.value.on('WEBRTC_ICE_CANDIDATE_ERROR', () => {
      eventCallback('ICE ERROR', 'ICE 协商出错');
    });
    fsRtcClient.value.on('WEBRTC_ON_REMOTE_STREAMS', () => {
      eventCallback('playing', '播放成功');
    });
    fsRtcClient.value.on('WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED', (event) => {
      eventCallback('OFFER ANSWER ERROR', 'offer answer 交换失败');
      if (event?.code === -400 && event?.msg === '流不存在') {
        timer = setTimeout(() => {
          fsRtcClient.value?.close();
          createVideoDom();
        }, 100);
      }
    });
    fsRtcClient.value.on('WEBRTC_ON_LOCAL_STREAM', () => {
      localStream.value = 1;
      eventCallback('LOCAL STREAM', '获取到了本地流');
    });
    fsRtcClient.value.on('WEBRTC_ON_INIT_STAUTS', () => {
      localStream.value = 2;
      eventCallback('LOCAL STREAM', '加载流媒体成功');
    });

    rtcProps.recvOnly
      ? fsRtcClient.value.receive(rtcProps.recvSdp)
      : fsRtcClient.value.start();

    return true;
  }

  function play() {
    if (!isFunction(rtcProps.funApi)) {
      return false;
    }
    if (success.value) {
      if (!fsRtcClient.value && !createVideoDom()) {
        return false;
      }
      if (!playTimer) {
        playTimer = setInterval(() => play(), 200);
        playTimeout = setTimeout(() => {
          clearPlayTimers();
        }, 5000);
      }
      if (fsRtcClient.value?.pc?.connectionState === 'connected') {
        unref(container)?.play();
        clearPlayTimers();
      }
      return true;
    }
    if (!playTimer) {
      playTimer = setInterval(() => play(), 200);
      playTimeout = setTimeout(() => {
        clearPlayTimers();
      }, 5000);
    }
    return false;
  }

  function sendDtmf(message: string) {
    fsRtcClient.value?.sendTones(message);
  }

  function pause() {
    fsRtcClient.value?.close();
    localStream.value = 0;
  }

  function destroy() {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
    clearPlayTimers();
    localStream.value = 0;
    fsRtcClient.value?.close();
    fsRtcClient.value = undefined;
  }

  return { destroy, fsRtcClient, localStream, pause, play, sendDtmf, success };
}
