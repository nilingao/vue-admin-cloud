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
  import { ref, reactive, onUnmounted, watch } from 'vue';
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
    //是否开启音频
    audioEnable: {
      type: Boolean,
      default: true,
    },
    //是否开启视频
    videoEnable: {
      type: Boolean,
      default: true,
    },
    //是否静音
    muted: {
      type: Boolean,
      default: true,
    },
    //是否开启按键
    useDtmf: {
      type: Boolean,
      default: false,
    },
    //是否使用摄像头
    useCamera: {
      type: Boolean,
      default: false,
    },
    //是否仅cv模式
    recvOnly: {
      type: Boolean,
      default: true,
    },
  });

  const use = reactive({
    debug:isDevMode(),
    audioEnable: props.audioEnable,
    videoEnable: props.videoEnable,
    useDtmf: props.useDtmf,
    useCamera:props.useCamera,
    recvOnly: props.recvOnly,
  });

  const funApi = (sdp) => {
    return new Promise((resolve,reject) => {
      if(!isFunction(props.sendSdpApi)){
        reject('sendSdpApi is not a function')
      }
      props.sendSdpApi(sdp).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  };

  const call = () =>{
    destroy();
    play();
  }

  const { success,sendDtmf ,play, destroy } = useFsRtc({funApi:funApi,...use}, containerRef);

  onUnmounted(() => {
    destroy();
  });

  defineExpose({ success,sendDtmf ,call, destroy });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-video-rtp-play';
  .@{prefix-cls} {
  }
</style>
