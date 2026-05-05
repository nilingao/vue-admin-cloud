<script lang="ts" setup>
import type { DeviceEntity } from '#/api/video/device';
import type { MediaServerEntity } from '#/api/video/mediaServer';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { doFindDeviceId, doSaveDevice } from '#/api/video/device';
import { doMediaPage } from '#/api/video/mediaServer';

import { useFormSchema } from './data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<DeviceEntity>();
const isUpdate = ref(false);
const mediaOptions = ref<Array<{ label: string; value: string }>>([]);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2 md:col-span-1',
  },
  layout: 'horizontal',
  schema: useFormSchema(mediaOptions.value),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2 gap-x-4',
});

async function loadMediaOptions() {
  const data = await doMediaPage({
    pageNumber: 1,
    pageSize: 100,
  });
  const list = (data.items ?? data.data ?? []) as MediaServerEntity[];
  mediaOptions.value = list
    .filter((item) => item.id)
    .map((item) => ({
      label: item.ip ?? item.id ?? '',
      value: item.id ?? '',
    }));
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    modalApi.lock();
    try {
      const data = (await formApi.getValues()) as DeviceEntity;
      await doSaveDevice(data);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      formApi.resetForm();
      formData.value = undefined;
      isUpdate.value = false;
      return;
    }

    await loadMediaOptions();
    const data = modalApi.getData<DeviceEntity & { isUpdate?: boolean }>();
    isUpdate.value = !!data?.isUpdate;
    if (data?.deviceId) {
      formData.value = await doFindDeviceId({ deviceId: data.deviceId });
      formApi.setValues(formData.value);
    }
  },
});

const getTitle = computed(() =>
  isUpdate.value ? `编辑设备：${formData.value?.name ?? ''}` : '新增设备',
);
</script>

<template>
  <Modal class="w-[900px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
