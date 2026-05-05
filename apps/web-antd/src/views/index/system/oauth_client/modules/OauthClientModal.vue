<script lang="ts" setup>
import type { OauthClientEntity } from '#/api/sys/oauthClient';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { doOauthClientDetail, doOauthClientSave } from '#/api/sys/oauthClient';

import { splitAuthorizedGrantTypes, useFormSchema } from './data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<OauthClientEntity>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  schema: useFormSchema(() => !!formData.value?.clientId),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    modalApi.lock();
    try {
      const data = (await formApi.getValues()) as OauthClientEntity & {
        authorizedGrantTypes?: string[];
        autoapprove?: boolean;
      };
      await doOauthClientSave({
        ...data,
        authorizedGrantTypes: splitAuthorizedGrantTypes(
          data.authorizedGrantTypes,
        ).join(','),
        autoapprove: data.autoapprove ? 'true' : 'false',
        clientId: formData.value?.clientId ?? data.clientId,
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

    const data = modalApi.getData<OauthClientEntity>();
    if (data?.clientId) {
      const entity = await doOauthClientDetail({ clientId: data.clientId });
      formData.value = entity;
      formApi.setValues({
        ...entity,
        authorizedGrantTypes: splitAuthorizedGrantTypes(
          entity.authorizedGrantTypes,
        ),
        autoapprove: entity.autoapprove === 'true',
      });
      return;
    }

    formApi.setValues({
      autoapprove: false,
      authorizedGrantTypes: [],
    });
  },
});

const getTitle = computed(() =>
  formData.value?.clientId ? '编辑客户端' : '新增客户端',
);
</script>

<template>
  <Modal class="w-[780px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
