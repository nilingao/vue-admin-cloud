<script lang="ts" setup>
import type { DictionaryItemEntity } from '#/api/sys/dictionary';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  doDictionaryItemDetail,
  doDictionaryItemSave,
} from '#/api/sys/dictionary';

import { useItemFormSchema } from './data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<DictionaryItemEntity>();

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useItemFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    modalApi.lock();
    try {
      const data = (await formApi.getValues()) as DictionaryItemEntity;
      await doDictionaryItemSave({
        ...data,
        id: formData.value?.id,
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

    const data = modalApi.getData<DictionaryItemEntity>();
    if (data?.id) {
      formData.value = await doDictionaryItemDetail({ id: data.id });
      formApi.setValues({
        ...formData.value,
        typeId: data.typeId ?? formData.value.typeId,
      });
      return;
    }

    formApi.setValues({
      sort: 0,
      typeId: data?.typeId,
    });
  },
});

const getTitle = computed(() =>
  formData.value?.id ? '编辑字典条目' : '新增字典条目',
);
</script>

<template>
  <Modal class="w-[560px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
