<script lang="ts" setup>
import type { VideoPlayResult } from '#/api/video/play';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useAccessStore } from '@vben/stores';

import { VideoJessibucaPlay } from '#/components/Video';

const accessStore = useAccessStore();
const playData = ref<VideoPlayResult>();

function withToken(url?: string) {
  if (!url) {
    return '';
  }
  const token = accessStore.accessToken;
  if (!token) {
    return url;
  }
  return `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
}

const videoUrl = computed(() => {
  const data = playData.value;
  const url =
    data?.sslStatus === 0
      ? data?.wsFlv?.url || data?.flv?.url
      : data?.wssFlv?.url || data?.httpsFlv?.url;
  return withToken(url);
});

const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen) {
    if (!isOpen) {
      playData.value = undefined;
      return;
    }
    playData.value = modalApi.getData<VideoPlayResult>();
  },
});
</script>

<template>
  <Modal class="w-[920px]" title="视频播放">
    <div class="h-[560px] bg-black">
      <VideoJessibucaPlay :has-audio="true" :video-url="videoUrl" />
    </div>
  </Modal>
</template>
