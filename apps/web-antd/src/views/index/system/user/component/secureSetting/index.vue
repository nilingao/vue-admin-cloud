<script lang="ts" setup>
import { onMounted, reactive, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, Divider, List, ListItem, ListItemMeta } from 'ant-design-vue';

import {
  GetUserDepartment,
  GetUserPosition,
  GetUserRole,
} from '#/api/sys/user';

import Form from './SettingModel.vue';

const props = defineProps({
  userId: {
    type: [Number, String],
    default: undefined,
  },
});
const emit = defineEmits(['update:form-api']);
const state = reactive({
  roleIdList: [],
  roleNameList: '',
  departmentIdList: [],
  departmentNameList: '',
  positionIdList: [],
  positionNameList: '',
});
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});
const initGetUserRole = async () => {
  const userRole = await GetUserRole({ userId: unref(props.userId) });
  const nameList = [] as any;
  const idList = [] as any;
  userRole.forEach((obj: any) => {
    const { roleName: name, roleId: id } = obj;
    nameList.push(name);
    idList.push(id);
  });
  state.roleIdList = idList;
  state.roleNameList = nameList.join('丶');
};
const initGetUserDepartment = async () => {
  const userDepartment = await GetUserDepartment({
    userId: unref(props.userId),
  });
  const nameList = [] as any;
  const idList = [] as any;
  userDepartment.forEach((obj: any) => {
    const { departmentName: name, departmentId: id } = obj;
    nameList.push(name);
    idList.push(id);
  });
  state.departmentIdList = idList;
  state.departmentNameList = nameList.join('丶');
};
const initGetUserPosition = async () => {
  const userPosition = await GetUserPosition({ userId: unref(props.userId) });
  const nameList = [] as any;
  const idList = [] as any;
  userPosition.forEach((obj: any) => {
    const { positionName: name, positionId: id } = obj;
    nameList.push(name);
    idList.push(id);
  });
  state.positionIdList = idList;
  state.positionNameList = nameList.join('丶');
};

const onTreeClick = (type: number) => {
  let idList = [] as string[];
  if (type === 1) {
    idList = state.roleIdList.map(String);
  } else if (type === 2) {
    idList = state.departmentIdList.map(String);
  } else {
    idList = state.positionIdList.map(String);
  }
  formModalApi.setData({ userId: props.userId, type, idList }).open();
};

const handleTreeSuccess = (type: number) => {
  if (type === 1) {
    initGetUserRole();
  } else if (type === 2) {
    initGetUserDepartment();
  } else {
    initGetUserPosition();
  }
};

onMounted(() => {
  emit('update:form-api', undefined);
  initGetUserRole();
  initGetUserDepartment();
  initGetUserPosition();
});
</script>
<template>
  <view class="flex w-full flex-col px-[16px]">
    <Divider class="!m-0" orientation="left">身份设置</Divider>
    <List>
      <ListItem>
        <ListItemMeta>
          <template #title>
            用户角色
            <Button
              class="float-right mt-[10px]"
              type="link"
              @click="onTreeClick(1)"
            >
              编辑
            </Button>
          </template>
          <template #description>
            <div>{{ state.roleNameList }}</div>
          </template>
        </ListItemMeta>
      </ListItem>
      <ListItem>
        <ListItemMeta>
          <template #title>
            用户部门
            <Button
              class="float-right mt-[10px]"
              type="link"
              @click="onTreeClick(2)"
            >
              编辑
            </Button>
          </template>
          <template #description>
            <div>{{ state.departmentNameList }}</div>
          </template>
        </ListItemMeta>
      </ListItem>
      <ListItem>
        <ListItemMeta>
          <template #title>
            用户职位
            <Button
              class="float-right mt-[10px]"
              type="link"
              @click="onTreeClick(3)"
            >
              编辑
            </Button>
          </template>
          <template #description>
            <div>{{ state.positionNameList }}</div>
          </template>
        </ListItemMeta>
      </ListItem>
    </List>
    <FormModal @success="handleTreeSuccess" />
  </view>
</template>
