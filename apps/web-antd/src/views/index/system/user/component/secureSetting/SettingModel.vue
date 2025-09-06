<script lang="ts" setup>
import type { TenantModel } from '#/api/sys/tenant';

import { computed, markRaw, reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { doDepartmentTree } from '#/api/sys/department';
import { doPositionTree } from '#/api/sys/position';
import { doAll } from '#/api/sys/role';
import {
  SaveUserDepartment,
  SaveUserPosition,
  SaveUserRole,
} from '#/api/sys/user';

import Transfer from './TransferTree.vue';

const emit = defineEmits(['success']);

const state = reactive({
  type: undefined as unknown as number,
  userId: undefined as unknown as number,
  idList: [],
  dataData: [] as any,
});

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: [
    {
      component: markRaw(Transfer),
      fieldName: 'idList',
      controlClass: 'w-full',
      modelPropName: 'value',
      hideLabel: true,
      componentProps: {
        placeholder: '请选择地址',
        showSearch: true,
      },
    },
  ],
  showDefaultActions: false,
});
// 对象转换
const transformation = (
  key1: string,
  title1: string,
  list: Record<string, any>[],
) => {
  const ListItem1 = [] as any[];
  list.forEach((obj: any) => {
    let ListItem2;
    if (obj.children && obj.children.length > 0) {
      ListItem2 = transformation(key1, title1, obj.children);
    }
    ListItem1.push({
      key: String(obj[key1]),
      title: obj[title1],
      children: ListItem2,
    });
  });
  return ListItem1;
};

const handleTreeSuccess = async (
  userId: number,
  type: number,
  idList: number[],
) => {
  const ids = idList.map(Number);
  if (type === 1) {
    await SaveUserRole({ userId, roleList: ids });
  } else if (type === 2) {
    await SaveUserDepartment({ userId, departmentList: ids });
  } else {
    await SaveUserPosition({ userId, positionList: ids });
  }
};
const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues();
      try {
        await handleTreeSuccess(state.userId, state.type, data.idList[0]);
        emit('success', state.type);
        modalApi.close();
      } finally {
        modalApi.lock(false);
      }
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const { userId, type, idList } = modalApi.getData<TenantModel>();
      state.userId = userId;
      state.type = type;
      state.idList = idList;
      if (state.type === 1) {
        const roleList = await doAll({});
        // 角色信息
        state.dataData = transformation('roleId', 'roleName', roleList);
      } else if (state.type === 2) {
        // 部门信息
        const departmenList = await doDepartmentTree({});
        state.dataData = transformation('id', 'departmentName', departmenList);
      } else {
        // 职位信息
        const positionList = await doPositionTree({});
        state.dataData = transformation('id', 'positionName', positionList);
      }
      formApi.setValues({ idList: [state.idList, state.dataData] });
    }
  },
});
const getTitle = computed(() => {
  let title = '';
  if (state.type === 1) {
    title = '编辑角色';
  } else if (state.type === 2) {
    title = '编辑部门';
  } else {
    title = '编辑职位';
  }
  return title;
});
</script>

<template>
  <Modal class="w-[500px] lg:w-[800px]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
