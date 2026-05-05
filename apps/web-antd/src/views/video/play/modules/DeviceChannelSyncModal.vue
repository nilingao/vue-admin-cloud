<script lang="ts" setup>
import { onBeforeUnmount, reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, Progress } from 'ant-design-vue';

import { doSyncStatusDeviceChannel } from '#/api/video/deviceChannel';

const emit = defineEmits<{
  close: [];
}>();

const state = reactive({
  current: 0,
  deviceId: '',
  errorMsg: '',
  message: '同步中',
  percent: 0,
  status: undefined as 'exception' | 'normal' | 'success' | undefined,
  timer: undefined as ReturnType<typeof setInterval> | undefined,
  total: 0,
});

function resetState() {
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = undefined;
  }
  state.current = 0;
  state.deviceId = '';
  state.errorMsg = '';
  state.message = '同步中';
  state.percent = 0;
  state.status = undefined;
  state.total = 0;
}

async function fetchStatus(circulate: boolean) {
  if (!state.deviceId) {
    return;
  }

  const {
    current = 0,
    errorMsg = '',
    syncIng,
    total = 0,
  } = await doSyncStatusDeviceChannel({
    deviceId: state.deviceId,
  });
  state.current = current;
  state.total = total;
  state.percent = total > 0 ? Math.round((current / total) * 100) : 0;

  if (syncIng) {
    if (errorMsg) {
      state.status = 'exception';
      message.error(errorMsg);
      modalApi.close();
      resetState();
      emit('close');
    } else {
      state.message = '同步完成';
      state.status = 'success';
      setTimeout(() => {
        modalApi.close();
        resetState();
        emit('close');
      }, 1500);
    }
    return;
  }

  if (circulate && !state.timer) {
    state.timer = setInterval(() => fetchStatus(false), 800);
  }
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen) {
    if (!isOpen) {
      resetState();
      return;
    }

    const data = modalApi.getData<{ deviceId?: string }>();
    state.deviceId = data?.deviceId ?? '';
    fetchStatus(true);
  },
});

onBeforeUnmount(resetState);
</script>

<template>
  <Modal class="w-[280px]" :closable="false" :footer="false" title="">
    <div class="flex justify-center py-6">
      <Progress type="circle" :percent="state.percent" :status="state.status">
        <template #format>
          <span>{{ state.message }}</span>
        </template>
      </Progress>
    </div>
  </Modal>
</template>
