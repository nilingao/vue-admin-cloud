<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  doPlatformCatalogInsert,
  doPlatformCatalogUpdate,
} from '#/api/video/platform';

const emit = defineEmits<{
  success: [];
}>();

const isUpdate = ref(false);
const nodeData = ref<Recordable<any>>({});

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: [
    {
      component: 'Input',
      fieldName: 'id',
      label: '目录编号',
      rules: 'required',
      componentProps: () => ({
        disabled: isUpdate.value,
        placeholder: '请输入目录编号',
      }),
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '目录名称',
      componentProps: {
        placeholder: '请输入目录名称',
      },
    },
  ],
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
      const values = await formApi.getValues<Recordable<any>>();
      await (isUpdate.value
        ? doPlatformCatalogUpdate(values)
        : doPlatformCatalogInsert({
            ...values,
            parentId: nodeData.value.id,
            platformId: nodeData.value.platformId,
          }));
      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  onOpenChange(isOpen) {
    if (!isOpen) {
      formApi.resetForm();
      isUpdate.value = false;
      nodeData.value = {};
      return;
    }

    const data = modalApi.getData<{
      isUpdate?: boolean;
      node?: Recordable<any>;
    }>();
    isUpdate.value = !!data?.isUpdate;
    nodeData.value = data?.node ?? {};

    if (isUpdate.value) {
      formApi.setValues({
        id: nodeData.value.id,
        name: nodeData.value.name,
      });
    }
  },
});

const getTitle = computed(() => (isUpdate.value ? '编辑目录' : '新增目录'));
</script>

<template>
  <Modal class="w-[520px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
