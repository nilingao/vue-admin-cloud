<script lang="ts" setup>
import { onUnmounted, reactive, ref } from 'vue';

import { isFunction } from '@vben-core/shared/utils';

import { useFsRtc } from './useFsRtc';

interface PushStats {
  audioEnable: boolean;
  recvOnly: boolean;
  recvSdp: string;
  useCamera: boolean;
  useDtmf: boolean;
  videoEnable: boolean;
}

const props = withDefaults(
  defineProps<{
    muted?: boolean;
    sendSdpApi?: (sdp: string) => Promise<any>;
  }>(),
  {
    muted: true,
    sendSdpApi: undefined,
  },
);

const containerRef = ref<HTMLVideoElement>();

const rtcOptions = reactive({
  audioEnable: true,
  debug: import.meta.env.DEV,
  funApi: (sdp: string) =>
    new Promise((resolve, reject) => {
      if (!isFunction(props.sendSdpApi)) {
        reject(new Error('sendSdpApi is not a function'));
        return;
      }
      props.sendSdpApi(sdp).then(resolve).catch(reject);
    }),
  recvOnly: true,
  recvSdp: '',
  useCamera: false,
  useDtmf: false,
  videoEnable: false,
});

const { destroy, play, sendDtmf, success } = useFsRtc(rtcOptions, containerRef);

function call(pushStats: PushStats) {
  rtcOptions.audioEnable = pushStats.audioEnable;
  rtcOptions.videoEnable = pushStats.videoEnable;
  rtcOptions.useDtmf = pushStats.useDtmf;
  rtcOptions.useCamera = pushStats.useCamera;
  rtcOptions.recvSdp = pushStats.recvSdp;
  rtcOptions.recvOnly = pushStats.recvOnly;
  destroy();
  play();
}

onUnmounted(() => {
  destroy();
});

defineExpose({ call, destroy, sendDtmf, success });
</script>

<template>
  <video
    id="fs-rtc-container"
    ref="containerRef"
    class="h-full w-full bg-black"
    controls
    :muted="props.muted"
  >
    Your browser is too old which doesn't support HTML5 video.
  </video>
</template>
