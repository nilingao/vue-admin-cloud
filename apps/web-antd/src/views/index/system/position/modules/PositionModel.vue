<script lang="ts" setup>
import type { DepartmentEntity } from '#/api/sys/department';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { doPositionDetail, doPositionSave } from '#/api/sys/position';

import { useFormSchema } from './data';

const emit = defineEmits(['success']);
const formData = ref<DepartmentEntity>({} as DepartmentEntity);

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = (await formApi.getValues()) as DepartmentEntity;
      try {
        await doPositionSave({ ...data, id: formData.value.id });
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<DepartmentEntity>();

      if (data && data.id) {
        formData.value = await doPositionDetail({ id: data.id });
        const parentId = formData.value?.parentId || '';
        formApi.setValues({ ...formData.value, parentId });
      } else {
        const parentId = data.parentId || '';
        formApi.setValues({ parentId });
      }
    }
  },
});
const getTitle = computed(() => {
  return formData.value?.id ? '修改职位' : '新增职位';
});
</script>

<template>
  <Modal class="w-[600px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
