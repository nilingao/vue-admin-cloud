<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { TenantModel } from '#/api/sys/tenant';

import { computed, ref } from 'vue';

import { useVbenModal, VbenTree } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { useVbenForm } from '#/adapter/form';
import { doMenuPrivilegeTree } from '#/api/sys/menu';
import {
  doTenantDetail,
  doTenantInsert,
  doTenantPrivilegeList,
  doTenantPrivilegeSave,
  doTenantUpdate,
} from '#/api/sys/tenant';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const imageUrlData = ref({});
const formData = ref<Record<string, any>>({});
const privilegeList = ref<Record<string, any>>([]);

// 图片覆盖
const headerImageChange = async ({ file }: any) => {
  if (file.response) {
    imageUrlData.value = file.response;
    formApi.setValues({
      imageUrl: [
        {
          status: 'done',
          url: file.response.fullPath,
          path: file.response.path,
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

const getPrivilegeList = (privilegeList: string[]) => {
  return privilegeList.filter((val: String) => val.match(/:/));
};

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues();
      try {
        if (data?.id) {
          const { privilegeList, ...val } = data;
          await doTenantUpdate({ id: data?.id, ...val });
          await doTenantPrivilegeSave({
            tenantId: data?.id,
            privilegeList: getPrivilegeList(privilegeList),
          });
        } else {
          const {
            tenantName,
            accountCount,
            status,
            areaList,
            imageUrl,
            ...val
          } = data;
          await doTenantInsert({
            tenant: {
              tenantName,
              accountCount,
              status,
            },
            user: {
              provinceId: areaList[0],
              cityId: areaList[1],
              areaId: areaList[2],
              imageUrl: imageUrl[0].path,
              ...val,
            },
          });
        }
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
        formApi.setValues({ id: data.id });
        privilegeList.value = await doMenuPrivilegeTree();
        formData.value = await doTenantDetail({ id: data.id });
        const selectedKeys = ((await doTenantPrivilegeList({
          tenantId: data.id,
        })) || []) as any[];
        formApi.setValues({ privilegeList: selectedKeys, ...formData.value });
      }
    }
  },
});
const getTitle = computed(() => {
  return formData.value?.id ? '修改租户' : '新增租户';
});

function getNodeClass(node: Recordable<any>) {
  const classes: string[] = [];
  if (node.value?.type === 'button') {
    classes.push('inline-flex');
    if (node.index % 3 >= 1) {
      classes.push('!pl-0');
    }
  }

  return classes.join(' ');
}
</script>

<template>
  <Modal class="w-1/2" :title="getTitle">
    <Form class="mx-4">
      <template #privilegeList="slotProps">
        <VbenTree
          :tree-data="privilegeList"
          check-strictly
          multiple
          bordered
          :get-node-class="getNodeClass"
          v-bind="slotProps"
          value-field="id"
          label-field="menuName"
          icon-field="icon"
        >
          <template #node="{ value }">
            <IconifyIcon v-if="value.icon" :icon="value.icon" />
            {{ $t(value.menuName) }}
          </template>
        </VbenTree>
      </template>
    </Form>
  </Modal>
</template>
