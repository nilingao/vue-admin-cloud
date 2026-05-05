<script lang="ts" setup>
import type { ConfigEntity } from '#/api/sys/config';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { doConfigDetail, doConfigUpdate } from '#/api/sys/config';

import { useFormSchema } from './data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<ConfigEntity>();

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    modalApi.lock();
    try {
      const data = (await formApi.getValues()) as ConfigEntity;
      await doConfigUpdate(data);
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
      return;
    }

    const data = modalApi.getData<ConfigEntity>();
    if (data?.k) {
      formData.value = await doConfigDetail({ k: data.k });
      formApi.setValues(formData.value);
    }
  },
});

const getTitle = computed(
  () =>
    `编辑配置${formData.value?.configName ? `：${formData.value.configName}` : ''}`,
);
</script>

<template>
  <Modal class="w-[560px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
