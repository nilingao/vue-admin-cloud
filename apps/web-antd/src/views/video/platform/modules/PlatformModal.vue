<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { PlatformEntity, PlatformSipItem } from '#/api/video/platform';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  doPlatformDetail,
  doPlatformInsert,
  doPlatformSipList,
  doPlatformUpdate,
} from '#/api/video/platform';

import { useFormSchema } from './data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<PlatformEntity>();
const isUpdate = ref(false);
const sipMap = ref<Record<string, Omit<PlatformSipItem, 'gbId'>>>({});
const sipOptions = ref<Array<{ label: string; value: string }>>([]);

function isEmptyValue(value: unknown) {
  return value === undefined || value === null || value === '';
}

async function handleServerGbIdChange(serverGbId: string) {
  const values = await formApi.getValues<Recordable<any>>();
  const oldServerGbId = values.serverGbId;
  const patch: Recordable<any> = {};

  if (isEmptyValue(values.username) || values.username === oldServerGbId) {
    patch.username = serverGbId;
  }
  if (isEmptyValue(values.catalogId) || values.catalogId === oldServerGbId) {
    patch.catalogId = serverGbId;
  }
  if (
    isEmptyValue(values.administrativeDivision) ||
    values.administrativeDivision === oldServerGbId
  ) {
    patch.administrativeDivision =
      serverGbId.length >= 6 ? serverGbId.slice(0, 6) : serverGbId;
  }
  if (
    isEmptyValue(values.serverGbDomain) ||
    values.serverGbDomain === oldServerGbId
  ) {
    patch.serverGbDomain =
      serverGbId.length >= 10 ? serverGbId.slice(0, 10) : serverGbId;
  }

  formApi.setValues(patch);
}

function handleDeviceGbIdSelect(gbId: string) {
  const sipInfo = sipMap.value[gbId];
  if (!sipInfo) {
    return;
  }

  formApi.setValues({
    deviceIp: sipInfo.ip,
    devicePort: sipInfo.port,
  });
}

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2 md:col-span-1',
  },
  layout: 'horizontal',
  schema: useFormSchema(
    sipOptions.value,
    handleServerGbIdChange,
    handleDeviceGbIdSelect,
  ),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2 gap-x-4',
});

async function loadSipList() {
  const list = await doPlatformSipList();
  sipMap.value = {};
  sipOptions.value = list.map(({ gbId, ...value }) => {
    sipMap.value[gbId] = value;
    return {
      label: gbId,
      value: gbId,
    };
  });
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    modalApi.lock();
    try {
      const data = (await formApi.getValues()) as PlatformEntity;
      await (isUpdate.value ? doPlatformUpdate(data) : doPlatformInsert(data));
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
      isUpdate.value = false;
      return;
    }

    const data = modalApi.getData<PlatformEntity & { isUpdate?: boolean }>();
    isUpdate.value = !!data?.isUpdate;
    await loadSipList();
    if (data?.id) {
      formData.value = await doPlatformDetail({ id: data.id });
      formApi.setValues(formData.value);
    }
  },
});

const getTitle = computed(() =>
  isUpdate.value
    ? `编辑国标级联：${formData.value?.name ?? ''}`
    : '新增国标级联',
);
</script>

<template>
  <Modal class="w-[880px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
