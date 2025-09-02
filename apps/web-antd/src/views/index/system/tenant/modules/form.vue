<script lang="ts" setup>
import type { TenantModel } from '#/api/sys/tenant';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  doTenantDetail,
  doTenantInsert,
  doTenantPrivilegeList,
  doTenantUpdate,
} from '#/api/sys/tenant';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const selectedKeys = ref([] as string[]);
const imageUrlData = ref({});
const formData = ref<Record<string, any>>({});
// 图片覆盖
const headerImageChange = async ({ file }: any) => {
  if (file.response) {
    imageUrlData.value = file.response;
    formApi.setValues({
      imageUrl: [
        {
          status: 'done',
          url: file.response.fullPath,
        },
      ],
    });
  }
};

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useFormSchema(headerImageChange),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 lg:grid-cols-2',
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
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<TenantModel>();
      if (data && data.id) {
        formData.value = await doTenantDetail({ id: data.id });
        selectedKeys.value = (await doTenantPrivilegeList({
          tenantId: data.id,
        })) as any;
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
  <Modal class="w-1/2" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
