<script lang="ts" setup>
import type { TenantModel } from '#/api/sys/tenant';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { doTenantInsert, doTenantUpdate } from '#/api/sys/tenant';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<TenantModel>();

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
        await (formData.value?.id
          ? doTenantUpdate({ id: formData.value.id, ...data })
          : doTenantInsert(data));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<TenantModel>();
      if (data) {
        if (data.id === 0) {
          data.id = undefined;
        }
        formData.value = data;
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
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
