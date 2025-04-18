<template>
  <CollapseContainer title="身份设置" :canExpand="false">
    <List>
      <ListItem>
        <ListItemMeta>
          <template #title>
            用户角色
            <div class="extra" @click="onTreeClick(1)"> 编辑 </div>
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
            <div class="extra" @click="onTreeClick(2)"> 编辑 </div>
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
            <div class="extra" @click="onTreeClick(3)"> 编辑 </div>
          </template>
          <template #description>
            <div>{{ state.positionNameList }}</div>
          </template>
        </ListItemMeta>
      </ListItem>
    </List>
  </CollapseContainer>
  <SettingTreeMode @register="registerTreeModal" @success="handleTreeSuccess" />
</template>
<script lang="ts" setup>
  import { List, ListItem, ListItemMeta } from 'ant-design-vue';
  import { CollapseContainer } from '@/components/Container';
  import { unref, reactive, onMounted, onUpdated } from 'vue';
  import { useModal } from '@/components/Modal';
  import SettingTreeMode from './SettingTreeMode.vue';
  import {
    GetUserRole,
    SaveUserRole,
    GetUserDepartment,
    SaveUserDepartment,
    GetUserPosition,
    SaveUserPosition,
  } from '@/api/sys/user';

  defineEmits(['register', 'success']);

  const [registerTreeModal, { openModal: onTreeModel }] = useModal();

  const props = defineProps({
    userId: {
      type: Number,
    },
    closeModal: {
      type: Function,
    },
    reload: {
      type: Function,
    },
  });

  const state = reactive({
    roleIdList: [],
    roleNameList: '',
    departmentIdList: [],
    departmentNameList: '',
    positionIdList: [],
    positionNameList: '',
  });

  onMounted(async () => {
    initGetUserRole();
    initGetUserDepartment();
    initGetUserPosition();
  });
  onUpdated(() => {
    initGetUserRole();
    initGetUserDepartment();
    initGetUserPosition();
  });

  const initGetUserRole = async () => {
    const userRole = await GetUserRole({ userId: unref(props.userId) });
    const nameList = [] as any;
    const idList = [] as any;
    userRole.map((obj) => {
      const { roleName: name, roleId: id } = obj;
      nameList.push(name);
      idList.push(id);
    });
    state.roleIdList = idList;
    state.roleNameList = nameList.join('丶');
  };
  const initGetUserDepartment = async () => {
    const userDepartment = await GetUserDepartment({ userId: unref(props.userId) });
    const nameList = [] as any;
    const idList = [] as any;
    userDepartment.map((obj) => {
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
    userPosition.map((obj) => {
      const { positionName: name, positionId: id } = obj;
      nameList.push(name);
      idList.push(id);
    });
    state.positionIdList = idList;
    state.positionNameList = nameList.join('丶');
  };

  const onTreeClick = (type) => {
    let idList = [] as string[];
    if (type === 1) {
      idList = state.roleIdList.map(String);
    } else if (type === 2) {
      idList = state.departmentIdList.map(String);
    } else {
      idList = state.positionIdList.map(String);
    }
    onTreeModel(true, { type: type, idList: idList });
  };
  const handleTreeSuccess = async (type, idList) => {
    const ids = idList.map(Number);
    if (type === 1) {
      await SaveUserRole({ userId: props.userId, roleList: ids });
      initGetUserRole();
    } else if (type === 2) {
      await SaveUserDepartment({ userId: props.userId, departmentList: ids });
      initGetUserDepartment();
    } else {
      await SaveUserPosition({ userId: props.userId, positionList: ids });
      initGetUserPosition();
    }
  };
</script>

<style lang="less" scoped>
  .extra {
    margin-top: 10px;
    margin-right: 30px;
    float: right;
    color: #1890ff;
    font-weight: normal;
    cursor: pointer;
  }
</style>
