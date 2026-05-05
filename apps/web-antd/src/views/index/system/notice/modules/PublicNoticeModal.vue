<script lang="ts" setup>
import type { PublicNoticeEntity } from '#/api/notice/publicNotice';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  doPublicNoticeDetail,
  doPublicNoticeInsert,
  doPublicNoticeUpdate,
} from '#/api/notice/publicNotice';

import { useFormSchema } from './data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<PublicNoticeEntity>();

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
      const data = (await formApi.getValues()) as PublicNoticeEntity;
      const params = {
        ...data,
        id: formData.value?.id,
      };
      await (formData.value?.id
        ? doPublicNoticeUpdate(params)
        : doPublicNoticeInsert(params));
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

    const data = modalApi.getData<PublicNoticeEntity>();
    if (data?.id) {
      formData.value = await doPublicNoticeDetail({ id: data.id });
      formApi.setValues(formData.value);
      return;
    }

    formApi.setValues({
      noticeType: 1,
    });
  },
});

const getTitle = computed(() =>
  formData.value?.id ? '编辑平台公告通知' : '新增平台公告通知',
);
</script>

<template>
  <Modal class="w-[760px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
