<script lang="ts" setup>
import type { PositionEntity } from '#/api/sys/position';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { doPositionDetail, doPositionSave } from '#/api/sys/position';

import { useFormSchema } from './data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<PositionEntity>();

const [Form, formApi] = useVbenForm({
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
      const data = (await formApi.getValues()) as PositionEntity;
      await doPositionSave({ ...data, id: formData.value?.id });
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

    const data = modalApi.getData<PositionEntity>();
    if (data?.id) {
      formData.value = await doPositionDetail({ id: data.id });
      formApi.setValues({
        ...formData.value,
        parentId: formData.value?.parentId || '',
      });
      return;
    }

    formApi.setValues({
      isEnable: 1,
      parentId: data?.parentId || '',
    });
  },
});

const getTitle = computed(() => (formData.value?.id ? '修改职位' : '新增职位'));
</script>

<template>
  <Modal class="w-[600px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
