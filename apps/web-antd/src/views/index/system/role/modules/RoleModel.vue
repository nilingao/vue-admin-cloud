<script lang="ts" setup>
import type { TenantModel } from '#/api/sys/tenant';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { doDetail, doSave } from '#/api/sys/role';

import { useFormSchema } from './data';

const emit = defineEmits(['success']);
const formData = ref<Record<string, any>>({});

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
      const data = await formApi.getValues();
      try {
        await doSave({ id: formData.value.id, ...data });
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<TenantModel>();
      if (data && data.id) {
        formData.value = await doDetail({ id: data.id });
        formApi.setValues(formData.value);
      }
    }
  },
});
const getTitle = computed(() => {
  return formData.value?.id ? '修改租户' : '新增租户';
});
</script>

<template>
  <Modal class="w-[600px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
