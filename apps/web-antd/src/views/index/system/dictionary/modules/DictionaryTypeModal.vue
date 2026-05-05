<script lang="ts" setup>
import type { DictionaryTypeEntity } from '#/api/sys/dictionary';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  doDictionaryTypeDetail,
  doDictionaryTypeSave,
} from '#/api/sys/dictionary';

import { useTypeFormSchema } from './data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<DictionaryTypeEntity>();

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useTypeFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    modalApi.lock();
    try {
      const data = (await formApi.getValues()) as DictionaryTypeEntity;
      await doDictionaryTypeSave({
        ...data,
        id: formData.value?.id,
        typeId: formData.value?.typeId,
      });
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

    const data = modalApi.getData<DictionaryTypeEntity>();
    if (data?.id || data?.typeId) {
      formData.value = await doDictionaryTypeDetail({
        id: data.id ?? data.typeId,
      });
      formApi.setValues(formData.value);
    }
  },
});

const getTitle = computed(() =>
  formData.value?.id || formData.value?.typeId
    ? '编辑字典类型'
    : '新增字典类型',
);
</script>

<template>
  <Modal class="w-[560px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
