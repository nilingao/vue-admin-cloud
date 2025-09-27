<script lang="ts" setup>
import { onMounted, ref, unref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import { VbenTree } from '@vben-core/shadcn-ui';

import { message, Radio } from 'ant-design-vue';

import {
  doDepartmentPrivilegeList,
  doDepartmentPrivilegeSave,
  doDepartmentTree,
} from '#/api/sys/department';
import { doMenuPrivilegeTree, doTenantMenuPrivilegeTree } from '#/api/sys/menu';
import {
  doPositionPrivilegeList,
  doPositionPrivilegeSave,
  doPositionTree,
} from '#/api/sys/position';
import {
  doAll,
  doRolePrivilegeList,
  doRolePrivilegeSave,
} from '#/api/sys/role';

import PrivilegeCheckbox from './modules/PrivilegeCheckbox.vue';

const type = ref(1);
const vbenTreeData = ref<any[]>([]);
const selectTreeData = ref<any[]>();
const treeData = ref<any[]>([]);
const departmentData = ref<any[]>([]);
const positionData = ref<any[]>([]);
const roleData = ref<any[]>([]);
const tenant = ref([]);
const checkedList = ref([]);
const selectId = ref();
const getTitle = ref('部门信息');
// 点击字典类型事件
const handleSelect = async ({ bind = {} as any }) => {
  let checked = [];
  if (bind.value.id) {
    if (selectTreeData.value === bind.value.id) {
      return;
    }
    selectTreeData.value = bind.value.id;
    await getMenu(bind.value.tenantId);
    selectId.value = bind.value.id;
    if (Math.trunc(type.value) === 1) {
      getTitle.value = '部门信息';
      checked = await doDepartmentPrivilegeList({
        departmentId: bind.value.id,
      });
    } else if (Math.trunc(type.value) === 2) {
      getTitle.value = '职位信息';
      checked = await doPositionPrivilegeList({ positionId: bind.value.id });
    } else {
      getTitle.value = '角色信息';
      checked = await doRolePrivilegeList({ roleId: bind.value.id });
    }
  } else {
    treeData.value = [];
  }
  checkedList.value = checked;
};

watch(
  () => type.value,
  (value) => {
    if (value === 1) {
      vbenTreeData.value = departmentData.value;
    } else if (value === 2) {
      vbenTreeData.value = positionData.value;
    } else {
      vbenTreeData.value = roleData.value;
    }
    selectTreeData.value = undefined;
    if (vbenTreeData.value && vbenTreeData.value.length > 0) {
      handleSelect({ bind: { value: vbenTreeData.value[0] } });
    } else {
      treeData.value = [];
      checkedList.value = [];
    }
  },
);

const init = async () => {
  // 部门信息
  const departmentTree = await doDepartmentTree({
    ...tenant.value,
  });
  departmentData.value = departmentTree.map((item: any) => {
    return headerTree(item, 'id', 'departmentName', 'tenantId');
  });
  // 职位信息
  const positionTree = await doPositionTree({
    ...tenant.value,
  });
  positionData.value = positionTree.map((item: any) => {
    return headerTree(item, 'id', 'positionName', 'tenantId');
  });
  // 角色信息
  const roleTree = await doAll({ ...tenant.value });
  roleData.value = roleTree.map((item: any) => {
    return headerTree(item, 'roleId', 'roleName', 'tenantId');
  });
  // 初始化部门
  getTitle.value = '部门信息';
  vbenTreeData.value = departmentData.value;
  if (vbenTreeData.value && vbenTreeData.value.length > 0) {
    handleSelect({ bind: { value: vbenTreeData.value[0] } });
  } else {
    treeData.value = [];
    checkedList.value = [];
  }
};

const headerTree = (
  item: any,
  keyField: any,
  titleField: any,
  tenantIdField: any,
) => {
  item.key = item[keyField];
  item.id = item[keyField];
  item.name = item[titleField];
  item.tenantId = item[tenantIdField];
  if (item.children && item.children.length > 0) {
    item.children = item.children.map((it: any) =>
      headerTree(it, keyField, titleField, tenantIdField),
    );
  }
  return item;
};

// 获取权限组
const getMenu = async (tenantId: number) => {
  const data = await (tenantId
    ? doTenantMenuPrivilegeTree({ tenantId })
    : doMenuPrivilegeTree());
  treeData.value = data;
};

// 保存选中的元素
const handleSave = async (checkIdList: number[]) => {
  if (!unref(type)) {
    message.error('请选择权限类型');
    return;
  }
  if (unref(type) === 1) {
    await doDepartmentPrivilegeSave({
      departmentId: unref(selectId),
      privilegeList: checkIdList,
    });
  } else if (unref(type) === 2) {
    await doPositionPrivilegeSave({
      positionId: unref(selectId),
      privilegeList: checkIdList,
    });
  } else {
    await doRolePrivilegeSave({
      roleId: unref(selectId),
      privilegeList: checkIdList,
    });
  }
};
onMounted(() => {
  init();
});
</script>
<template>
  <Page
    auto-content-height
    title="权限管理"
    description="设置各个管理模块的权限"
  >
    <div
      class="bg-background dark:bg-background flex h-full flex-row gap-4 p-4"
    >
      <div class="w-80 flex-none">
        <VbenTree
          class="h-full rounded-lg border shadow-sm"
          :tree-data="vbenTreeData"
          :default-value="selectTreeData"
          bordered
          show-icon
          value-field="id"
          label-field="name"
          @select="handleSelect"
        >
          <template #header>
            <Radio.Group
              v-model:value="type"
              class="mb-4 w-full"
              button-style="solid"
            >
              <Radio.Button :value="1" class="flex-1 text-center">
                部门
              </Radio.Button>
              <Radio.Button :value="2" class="flex-1 text-center">
                职位
              </Radio.Button>
              <Radio.Button :value="3" class="flex-1 text-center">
                角色
              </Radio.Button>
            </Radio.Group>
          </template>
        </VbenTree>
      </div>
      <div class="flex-auto overflow-hidden rounded-lg border shadow-sm">
        <PrivilegeCheckbox
          :tree-data="treeData"
          :checked-list="checkedList"
          @save="handleSave"
        />
      </div>
    </div>
  </Page>
</template>
