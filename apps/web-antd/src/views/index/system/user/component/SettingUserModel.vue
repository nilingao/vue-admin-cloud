<script lang="ts" setup>
import type { TenantModel } from '#/api/sys/tenant';

import { computed, defineAsyncComponent, reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@vben-core/shadcn-ui';

import { doInsert, doUpdate } from '#/api/sys/user';

import { settingInsertList, settingUpdateList } from './model';

const emit = defineEmits(['success']);
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
  isUpdate: false,
  formApi: undefined as any,
  userId: '' as any,
  selectTab: 'BaseSetting',
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
const headerSave = async (data: any) => {
  let api = null;
  let param = null;
  switch (modelData.selectTab) {
    case 'AccountBind': {
      break;
    }
    case 'BaseSetting': {
      const { imageUrl, areaList, ...values } = data;
      // 保留此处赋值即可
      api = modelData.isUpdate ? doUpdate : doInsert;
      param = {
        ...values,
        imageUrl: imageUrl[0].path,
        provinceId: areaList[0],
        cityId: areaList[1],
        areaId: areaList[2],
      };
      // 删除了重复的 api 赋值语句
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
  } else if (!param) {
    throw new Error('参数错误');
  }
  await api(param);
};

const settingList = computed(() =>
  modelData.isUpdate ? settingUpdateList : settingInsertList,
);

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    if (modelData.formApi) {
      const { valid } = await modelData.formApi.validate();
      if (valid) {
        modalApi.lock();
        const data = await modelData.formApi.getValues();
        try {
          await headerSave(data);
          modalApi.close();
          emit('success');
        } finally {
          modalApi.lock(false);
        }
      }
    } else {
      modalApi.close();
      modalApi.lock(false);
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<TenantModel>();
      if (data && data.id) {
        modelData.isUpdate = true;
        modelData.userId = data.id;
      }
    }
  },
});
const getTitle = computed(() => {
  return modelData.isUpdate ? '修改用户' : '新增用户';
});
const defaultValue = computed(() => {
  return 'BaseSetting';
});
</script>

<template>
  <Modal class="w-[500px] lg:w-[800px]" :title="getTitle">
    <div class="h-full w-full">
      <Tabs
        class="h-full lg:flex lg:gap-2"
        :default-value="defaultValue"
        v-model:model-value="modelData.selectTab"
      >
        <TabsList
          class="flex h-auto lg:flex-col lg:justify-start lg:gap-2 lg:py-4"
        >
          <template v-for="item in settingList" :key="item.key">
            <TabsTrigger :value="item.component"> {{ item.name }} </TabsTrigger>
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
