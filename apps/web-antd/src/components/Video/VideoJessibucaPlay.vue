<script lang="ts" setup>
import { onUnmounted, reactive, ref, watch } from 'vue';

import { Button } from 'ant-design-vue';

import { useJessibuca } from './useJessibuca';

const props = withDefaults(
  defineProps<{
    hasAudio?: boolean;
    options?: Record<string, any>;
    videoUrl?: string;
  }>(),
  {
    hasAudio: false,
    options: () => ({}),
    videoUrl: '',
  },
);

const containerRef = ref<HTMLElement>();
const playerOptions = reactive({
  hasAudio: props.hasAudio,
  isMute: false,
  options: props.options,
  videoUrl: props.videoUrl,
});

const {
  destroy,
  fullscreenSwitch,
  onMute,
  pause,
  play,
  refresh,
  screenshot,
  stats,
} = useJessibuca(containerRef, playerOptions);

watch(
  () => props.videoUrl,
  (url) => {
    playerOptions.videoUrl = url;
  },
);

onUnmounted(() => {
  destroy();
});

defineExpose({ destroy, play });
</script>

<template>
  <div ref="containerRef" class="relative h-full w-full bg-black">
    <div
      v-if="!props.videoUrl"
      class="absolute inset-0 flex items-center justify-center text-sm text-white/60"
    >
      暂无播放地址
    </div>
    <div
      class="absolute bottom-0 left-0 right-0 z-10 flex h-9 items-center justify-between bg-black/65 px-3"
    >
      <div class="flex items-center gap-2">
        <Button
          class="video-control-button"
          size="small"
          type="text"
          @click="pause(!stats.playing)"
        >
          {{ stats.playing ? 'II' : '>' }}
        </Button>
        <Button
          class="video-control-button"
          size="small"
          type="text"
          @click="destroy"
        >
          ■
        </Button>
        <Button
          class="video-control-button"
          size="small"
          type="text"
          @click="onMute(!stats.isMute)"
        >
          {{ stats.isMute ? '音' : '静' }}
        </Button>
      </div>
      <div class="flex items-center gap-2 text-xs text-white">
        <span>{{ stats.kBps }} kb/s</span>
        <Button
          class="video-control-button"
          size="small"
          type="text"
          @click="screenshot"
        >
          截
        </Button>
        <Button
          class="video-control-button"
          size="small"
          type="text"
          @click="refresh"
        >
          ↻
        </Button>
        <Button
          class="video-control-button"
          size="small"
          type="text"
          @click="fullscreenSwitch(!stats.fullscreen)"
        >
          □
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-control-button {
  color: #fff;
}
</style>
