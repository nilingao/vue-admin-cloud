<script lang="ts" setup>
import type { PushEntity } from '#/api/video/push';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { doPushDetail, doPushSave } from '#/api/video/push';

import { useFormSchema } from './data';

const emit = defineEmits<{ success: [] }>();

const formData = ref<PushEntity>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
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
    if (!valid) return;
    modalApi.lock();
    try {
      await doPushSave((await formApi.getValues()) as PushEntity);
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
    const data = modalApi.getData<PushEntity & { isUpdate?: boolean }>();
    if (data?.id) {
      formData.value = await doPushDetail({ id: data.id });
      formApi.setValues(formData.value);
    }
  },
});

const getTitle = computed(() =>
  formData.value?.id ? `编辑推流：${formData.value.name ?? ''}` : '新增推流',
);
</script>

<template>
  <Modal class="w-[760px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
