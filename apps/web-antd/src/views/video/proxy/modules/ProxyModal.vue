<script lang="ts" setup>
import type { ProxyEntity } from '#/api/video/proxy';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { doProxyDetail, doProxySave } from '#/api/video/proxy';

import { useFormSchema } from './data';

const emit = defineEmits<{ success: [] }>();

const formData = ref<ProxyEntity>();

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
      const values = (await formApi.getValues()) as ProxyEntity;
      const { type, url, ...rest } = values;
      await doProxySave({
        ...rest,
        type,
        srcUrl: type === 1 ? '' : url,
        url: type === 1 ? url : '',
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
    const data = modalApi.getData<ProxyEntity & { isUpdate?: boolean }>();
    if (data?.id) {
      const detail = await doProxyDetail({ id: data.id });
      formData.value = detail;
      formApi.setValues({
        ...detail,
        url: detail.type === 1 ? detail.url : detail.srcUrl,
      });
    }
  },
});

const getTitle = computed(() =>
  formData.value?.id ? `编辑拉流：${formData.value.name ?? ''}` : '新增拉流',
);
</script>

<template>
  <Modal class="w-[900px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
