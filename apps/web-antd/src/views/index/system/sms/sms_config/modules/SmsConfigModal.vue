<script lang="ts" setup>
import type { SmsConfigEntity } from '#/api/sys/smsConfig';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  doSmsConfigDetail,
  doSmsConfigInsert,
  doSmsConfigUpdate,
} from '#/api/sys/smsConfig';

import { useFormSchema } from './data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SmsConfigEntity>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    modalApi.lock();
    try {
      const data = (await formApi.getValues()) as SmsConfigEntity;
      const params = {
        ...data,
        id: formData.value?.id,
        isActive: Number(data.isActive ?? 0),
        signPlace: Number(data.signPlace ?? 1),
      };
      await (formData.value?.id
        ? doSmsConfigUpdate(params)
        : doSmsConfigInsert(params));
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

    const data = modalApi.getData<SmsConfigEntity>();
    if (data?.id) {
      formData.value = await doSmsConfigDetail({ id: data.id });
      formApi.setValues({
        ...formData.value,
        isActive: Number(formData.value.isActive ?? 0),
        signPlace: Number(formData.value.signPlace ?? 1),
      });
      return;
    }

    formApi.setValues({
      balance: 0,
      isActive: 1,
      signPlace: 1,
    });
  },
});

const getTitle = computed(() =>
  formData.value?.id ? '编辑短信配置' : '新增短信配置',
);
</script>

<template>
  <Modal class="w-[760px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
