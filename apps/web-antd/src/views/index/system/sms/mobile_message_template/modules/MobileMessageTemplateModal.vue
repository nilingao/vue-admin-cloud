<script lang="ts" setup>
import type { MobileMessageTemplateEntity } from '#/api/sys/mobileMessageTemplate';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  doMobileMessageTemplateDetail,
  doMobileMessageTemplateInsert,
  doMobileMessageTemplateUpdate,
} from '#/api/sys/mobileMessageTemplate';

import { useFormSchema } from './data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<MobileMessageTemplateEntity>();

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
    if (!valid) return;

    modalApi.lock();
    try {
      const data = (await formApi.getValues()) as MobileMessageTemplateEntity;
      const params = {
        ...data,
        id: formData.value?.id,
        isEnable: Number(data.isEnable ?? 0),
        num: Number(data.num ?? 0),
      };
      await (formData.value?.id
        ? doMobileMessageTemplateUpdate(params)
        : doMobileMessageTemplateInsert(params));
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

    const data = modalApi.getData<MobileMessageTemplateEntity>();
    if (data?.id) {
      formData.value = await doMobileMessageTemplateDetail({ id: data.id });
      formApi.setValues({
        ...formData.value,
        configId: data.configId ?? formData.value.configId,
        isEnable: Number(formData.value.isEnable ?? 0),
        num: Number(formData.value.num ?? 0),
      });
      return;
    }

    formApi.setValues({
      configId: data?.configId,
      isEnable: 1,
      num: 0,
    });
  },
});

const getTitle = computed(() =>
  formData.value?.id ? '编辑短信模板' : '新增短信模板',
);
</script>

<template>
  <Modal class="w-[760px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
