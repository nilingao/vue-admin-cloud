<script lang="ts" setup>
import type { TenantModel } from '#/api/sys/tenant';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { doMenuPrivilegeTree } from '#/api/sys/menu';
import {
  doTenantDetail,
  doTenantInsert,
  doTenantPrivilegeList,
  doTenantPrivilegeSave,
  doTenantUpdate,
} from '#/api/sys/tenant';

import PrivilegeCheckbox from '../../privilege/modules/PrivilegeCheckbox.vue';
import { useFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<TenantModel>();
const privilegeTree = ref<Record<string, any>[]>([]);

const headerImageChange = async ({ file }: any) => {
  if (!file.response) return;

  formApi.setValues({
    imageUrl: [
      {
        path: file.response.path,
        status: 'done',
        url: file.response.fullPath,
      },
    ],
  });
};

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useFormSchema(headerImageChange),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 lg:grid-cols-2',
});

function filterPrivilegeCodes(privilegeList: string[] = []) {
  return privilegeList.filter((item) => item.includes(':'));
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    modalApi.lock();
    try {
      const data = await formApi.getValues();
      if (data?.id) {
        const { privilegeList, ...tenant } = data;
        await doTenantUpdate({
          ...tenant,
          id: data.id,
          status: Number(tenant.status ?? 0),
        });
        await doTenantPrivilegeSave({
          privilegeList: filterPrivilegeCodes(privilegeList),
          tenantId: data.id,
        });
      } else {
        const {
          accountCount,
          areaList,
          imageUrl,
          status,
          tenantName,
          ...user
        } = data;
        await doTenantInsert({
          tenant: {
            accountCount,
            status: Number(status ?? 0),
            tenantName,
          },
          user: {
            ...user,
            areaId: areaList?.[2],
            cityId: areaList?.[1],
            imageUrl: imageUrl?.[0]?.path,
            provinceId: areaList?.[0],
          },
        });
      }
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
      privilegeTree.value = [];
      return;
    }

    const data = modalApi.getData<TenantModel>();
    if (data?.id) {
      formApi.setValues({ id: data.id });
      privilegeTree.value = await doMenuPrivilegeTree();
      formData.value = await doTenantDetail({ id: data.id });
      const selectedKeys = await doTenantPrivilegeList({
        tenantId: data.id,
      });
      formApi.setValues({
        ...formData.value,
        privilegeList: selectedKeys ?? [],
        status: Number(formData.value.status ?? 0),
      });
      return;
    }

    formApi.setValues({
      accountCount: 0,
      gender: 1,
      isAdmin: 1,
      isEnabled: 1,
      status: 1,
    });
  },
});

const getTitle = computed(() => (formData.value?.id ? '编辑租户' : '新增租户'));
</script>

<template>
  <Modal class="w-1/2" :title="getTitle">
    <Form class="mx-4">
      <template #privilegeList="slotProps">
        <PrivilegeCheckbox :tree-data="privilegeTree" v-bind="slotProps" />
      </template>
    </Form>
  </Modal>
</template>
