<template>
  <video
    :class="`${prefixCls} relative w-full h-full m-auto `"
    controls
    :muted="props.muted"
    id="containerRef"
    ref="containerRef"
  >
    Your browser is too old which doesn't support HTML5 video.
  </video>
</template>
<script lang="ts" setup>
  import { useDesign } from '@/hooks/web/useDesign';
  import { ref, reactive, onUnmounted } from 'vue';
  import { isDevMode } from '@/utils/env';
  import { useFsRtc } from './useFsRtc';
  import { isFunction } from '@/utils/is';

  const containerRef = ref();
  const { prefixCls } = useDesign('fs-rtp-play');
  const props = defineProps({
    sendSdpApi: {
      type: Function,
      default: null,
    },
    //是否静音
    muted: {
      type: Boolean,
      default: true,
    },
  });

  const use = reactive({
    debug: isDevMode(),
    funApi: (sdp) => {
      return new Promise((resolve, reject) => {
        if (!isFunction(props.sendSdpApi)) {
          reject('sendSdpApi is not a function');
        }
        props
          .sendSdpApi(sdp)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    audioEnable: true,
    videoEnable: false,
    useDtmf: false,
    useCamera: false,
    recvSdp: '',
    recvOnly: true,
  });
  const { success, sendDtmf, play, destroy } = useFsRtc(use, containerRef);
  const call = (pushStats) => {
    use.audioEnable = pushStats.audioEnable;
    use.videoEnable = pushStats.videoEnable;
    use.useDtmf = pushStats.useDtmf;
    use.useCamera = pushStats.useCamera;
    use.recvSdp = pushStats.recvSdp;
    use.recvOnly = pushStats.recvOnly;
    start();
  };

  const start = () => {
    destroy();
    play();
  };

  onUnmounted(() => {
    destroy();
  });

  defineExpose({ success, sendDtmf, call, destroy });
</script>

<style lang="less" scoped></style>
