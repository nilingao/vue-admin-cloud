<script lang="ts" setup>
import type { DeviceChannelEntity } from '#/api/video/deviceChannel';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  doDetailDeviceChannel,
  doSaveDeviceChannel,
} from '#/api/video/deviceChannel';

import { useFormSchema } from './data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<DeviceChannelEntity>();
const isUpdate = ref(false);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2 md:col-span-1',
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2 gap-x-4',
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    modalApi.lock();
    try {
      const data = (await formApi.getValues()) as DeviceChannelEntity;
      await doSaveDeviceChannel(data);
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

    const data = modalApi.getData<
      DeviceChannelEntity & { isUpdate?: boolean }
    >();
    isUpdate.value = !!data?.isUpdate;
    if (isUpdate.value && data?.channelId) {
      formData.value = await doDetailDeviceChannel({
        channelId: data.channelId,
      });
      formApi.setValues(formData.value);
    } else {
      formApi.setValues({
        deviceId: data?.deviceId,
        parentId: data?.deviceId,
      });
    }
  },
});

const getTitle = computed(() => (isUpdate.value ? '编辑通道' : '新增通道'));
</script>

<template>
  <Modal class="w-[820px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
