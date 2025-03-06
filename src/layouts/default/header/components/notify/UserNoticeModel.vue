<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerBasicModal"
    @afterClose="afterCloseModel"
    :showOkBtn="false"
    :title="stats.data?.title"
    :bodyStyle="getWrapStyle"
    width="80%"
  >
    <Spin size="large" :spinning="loading" :style="getWrapStyle">
      <iframe
        :src="stats.path + stats.data.content"
        allow="clipboard-write; clipboard-read"
        ref="frameRef"
        class="iframeClass"
        @load="hideLoading"
      ></iframe>
    </Spin>
  </BasicModal>
</template>
<script lang="ts" setup>
  import type { CSSProperties } from 'vue';
  import { ref, reactive, computed, unref } from 'vue';
  import { Spin } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { doConfigDetail } from '@/api/sys/config';
  import { MINIO_PATH } from '@/enums/commonEnum';
  import { PublicNoticeEntity } from '@/api/notice/model/publicNoticeModel';
  import { useWindowSizeFn } from '@vben/hooks';
  import { useLayoutHeight } from '@/layouts/default/content/useContentViewHeight';

  const emit = defineEmits(['afterClose', 'register']);

  const { headerHeightRef } = useLayoutHeight();
  const loading = ref(true);
  const topRef = ref(50);
  const heightRef = ref(window.innerHeight);

  const frameRef = ref<HTMLFrameElement>();
  const stats = reactive({
    //传过来的数据
    data: {} as PublicNoticeEntity,
    path: '',
  });

  useWindowSizeFn(calcHeight, { wait: 150 });
  const getWrapStyle = computed((): CSSProperties => {
    return {
      height: `${unref(heightRef) - 200}px`,
    };
  });

  function calcHeight() {
    const iframe = unref(frameRef);
    if (!iframe) {
      return;
    }
    const top = headerHeightRef.value;
    topRef.value = top;
    heightRef.value = window.innerHeight - top;
    const clientHeight = document.documentElement.clientHeight - top;
    iframe.style.height = `${clientHeight - 230}px`;
  }

  function hideLoading() {
    loading.value = false;
    calcHeight();
  }
  const afterCloseModel = () => {
    emit('afterClose');
  };

  const [registerBasicModal, { redoModalHeight }] = useModalInner(async (data) => {
    const model = await doConfigDetail({ k: MINIO_PATH });
    stats.path = model.v;
    stats.data = data;
    redoModalHeight();
    registerBasicModal;
  });
</script>
<style lang="less" scoped>
  .iframeClass {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0;
    background-color: @component-background;
  }
</style>
