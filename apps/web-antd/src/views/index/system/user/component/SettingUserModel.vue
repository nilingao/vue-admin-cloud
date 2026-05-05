<script lang="ts" setup>
import type { TenantModel } from '#/api/sys/tenant';

import { computed, defineAsyncComponent, reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@vben-core/shadcn-ui';

import { doInsert, doUpdate } from '#/api/sys/user';

import { settingInsertList, settingUpdateList } from './model';

const emit = defineEmits<{
  success: [];
}>();

const BaseSetting = defineAsyncComponent(
  () => import('./baseSetting/index.vue'),
);
const SecureSetting = defineAsyncComponent(
  () => import('./secureSetting/index.vue'),
);
const AccountBind = defineAsyncComponent(
  () => import('./accountBind/index.vue'),
);

const modelData = reactive({
  formApi: undefined as any,
  isUpdate: false,
  selectTab: 'BaseSetting',
  userId: '' as any,
});

const componentContext = computed(() => {
  switch (modelData.selectTab) {
    case 'AccountBind': {
      return AccountBind;
    }
    case 'BaseSetting': {
      return BaseSetting;
    }
    case 'SecureSetting': {
      return SecureSetting;
    }
    default: {
      return '';
    }
  }
});

async function headerSave(data: any) {
  let api = null;
  let param = null;

  switch (modelData.selectTab) {
    case 'AccountBind': {
      break;
    }
    case 'BaseSetting': {
      const { areaList, imageUrl, ...values } = data;
      api = modelData.isUpdate ? doUpdate : doInsert;
      param = {
        ...values,
        areaId: areaList?.[2],
        cityId: areaList?.[1],
        imageUrl: imageUrl?.[0]?.path,
        provinceId: areaList?.[0],
      };
      break;
    }
    case 'SecureSetting': {
      break;
    }
    default: {
      throw new Error('类型错误');
    }
  }

  if (!api) {
    throw new Error('请求接口错误');
  }
  if (!param) {
    throw new Error('参数错误');
  }
  await api(param);
}

const settingList = computed(() =>
  modelData.isUpdate ? settingUpdateList : settingInsertList,
);

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    if (!modelData.formApi) {
      modalApi.close();
      return;
    }

    const { valid } = await modelData.formApi.validate();
    if (!valid) return;

    modalApi.lock();
    try {
      const data = await modelData.formApi.getValues();
      await headerSave(data);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      modelData.formApi = undefined;
      modelData.isUpdate = false;
      modelData.selectTab = 'BaseSetting';
      modelData.userId = '';
      return;
    }

    const data = modalApi.getData<TenantModel>();
    if (data?.id) {
      modelData.isUpdate = true;
      modelData.userId = data.id;
    }
  },
});

const getTitle = computed(() => (modelData.isUpdate ? '编辑用户' : '新增用户'));
</script>

<template>
  <Modal class="w-[500px] lg:w-[800px]" :title="getTitle">
    <div class="h-full w-full">
      <Tabs
        v-model:model-value="modelData.selectTab"
        class="h-full lg:flex lg:gap-2"
        default-value="BaseSetting"
      >
        <TabsList
          class="flex h-auto lg:flex-col lg:justify-start lg:gap-2 lg:py-4"
        >
          <template v-for="item in settingList" :key="item.key">
            <TabsTrigger :value="item.component">{{ item.name }}</TabsTrigger>
          </template>
        </TabsList>
        <TabsContent class="mt-0 w-full" :value="modelData.selectTab">
          <component
            :is="componentContext"
            v-model:form-api="modelData.formApi"
            :user-id="modelData.userId"
            @close-modal="modalApi.close()"
          />
        </TabsContent>
      </Tabs>
    </div>
  </Modal>
</template>
