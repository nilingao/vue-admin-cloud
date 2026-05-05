<script lang="ts" setup>
import type { MediaServerEntity } from '#/api/video/mediaServer';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { doMediaDetail, doMediaSave } from '#/api/video/mediaServer';

import { useFormSchema } from './data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<MediaServerEntity>();

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
    if (!valid) {
      return;
    }

    modalApi.lock();
    try {
      const data = (await formApi.getValues()) as MediaServerEntity;
      await doMediaSave(data);
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

    const data = modalApi.getData<MediaServerEntity & { isUpdate?: boolean }>();
    if (data?.id) {
      formData.value = await doMediaDetail({ id: data.id });
      formApi.setValues(formData.value);
    }
  },
});

const getTitle = computed(() =>
  formData.value?.id ? `编辑流媒体：${formData.value.ip ?? ''}` : '新增流媒体',
);
</script>

<template>
  <Modal class="w-[860px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
