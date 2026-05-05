<script lang="ts" setup>
import type { RoleModel } from '#/api/sys/role';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm } from '#/adapter/form';
import { doDetail, doSave } from '#/api/sys/role';

import { useFormSchema } from './data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<RoleModel>();

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
      const data = await formApi.getValues();
      await doSave({ id: formData.value?.id, ...data });
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

    const data = modalApi.getData<RoleModel>();
    if (data?.id) {
      // 修复点：先获取详情，再判断结果是否存在，最后赋值
      const detail = await doDetail({ id: data.id });
      if (detail) {
        formData.value = detail;
        formApi.setValues(detail);
      }
    }
  },
});

const getTitle = computed(() =>
  formData.value?.id ? $t('system.role.editRole') : $t('system.role.addRole'),
);
</script>

<template>
  <Modal class="w-[600px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
