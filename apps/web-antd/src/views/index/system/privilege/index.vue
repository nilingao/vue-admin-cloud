<script lang="ts" setup>
import { ref, unref, watch } from 'vue';

import { useAccess } from '@vben/access';
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

const { hasAccessByCodes } = useAccess();

const type = ref(1);
const vbenTreeData = ref<any[]>([]);
const selectTreeId = ref<number | string | undefined>();
const treeData = ref<any[]>([]);
const tenant = ref([]);
const checkedList = ref([]);
const selectId = ref<number | string>();

function formatTreeNode(
  item: any,
  keyField: string,
  titleField: string,
  tenantIdField: string,
) {
  item.key = item[keyField];
  item.id = item[keyField];
  item.name = item[titleField];
  item.tenantId = item[tenantIdField];
  if (item.children?.length > 0) {
    item.children = item.children.map((child: any) =>
      formatTreeNode(child, keyField, titleField, tenantIdField),
    );
  }
  return item;
}

async function getMenu(tenantId?: number) {
  const data = await (tenantId
    ? doTenantMenuPrivilegeTree({ tenantId })
    : doMenuPrivilegeTree());
  treeData.value = data;
}

async function handleSelect({ bind = {} as any }) {
  const current = bind.value;
  const currentId = current?.id;

  if (!currentId) {
    selectId.value = undefined;
    treeData.value = [];
    checkedList.value = [];
    return;
  }

  if (selectId.value === currentId) {
    return;
  }

  selectId.value = currentId;
  await getMenu(current.tenantId);

  if (Math.trunc(type.value) === 1) {
    checkedList.value = await doDepartmentPrivilegeList({
      departmentId: currentId,
    });
  } else if (Math.trunc(type.value) === 2) {
    checkedList.value = await doPositionPrivilegeList({
      positionId: currentId,
    });
  } else {
    checkedList.value = await doRolePrivilegeList({ roleId: currentId });
  }
}

// 修复：将参数类型改为 string[] 以匹配组件事件定义
async function handleSave(checkIdList: string[]) {
  if (!unref(type) || !unref(selectId)) {
    message.error('请选择权限类型');
    return;
  }

  // 如果后端 API 严格要求 number 数组，则在此处进行转换
  // 假设 API 需要 number[]，将 string[] 转换为 number[]
  const privilegeList = checkIdList.map(Number);

  if (unref(type) === 1) {
    await doDepartmentPrivilegeSave({
      departmentId: unref(selectId),
      privilegeList,
    });
  } else if (unref(type) === 2) {
    await doPositionPrivilegeSave({
      positionId: unref(selectId),
      privilegeList,
    });
  } else {
    await doRolePrivilegeSave({
      privilegeList,
      roleId: unref(selectId),
    });
  }
  message.success('保存成功');
}

watch(
  () => type.value,
  async (value) => {
    if (value === 1) {
      const departmentTree = await doDepartmentTree({ ...tenant.value });
      vbenTreeData.value = departmentTree.map((item: any) =>
        formatTreeNode(item, 'id', 'departmentName', 'tenantId'),
      );
    } else if (value === 2) {
      const positionTree = await doPositionTree({ ...tenant.value });
      vbenTreeData.value = positionTree.map((item: any) =>
        formatTreeNode(item, 'id', 'positionName', 'tenantId'),
      );
    } else {
      const roleTree = await doAll({ ...tenant.value });
      vbenTreeData.value = roleTree.map((item: any) =>
        formatTreeNode(item, 'roleId', 'roleName', 'tenantId'),
      );
    }

    selectId.value = undefined;
    if (vbenTreeData.value.length > 0) {
      selectTreeId.value = vbenTreeData.value[0].id;
      await handleSelect({ bind: { value: vbenTreeData.value[0] } });
    } else {
      selectTreeId.value = undefined;
      treeData.value = [];
      checkedList.value = [];
    }
  },
  { immediate: true },
);
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
          v-model="selectTreeId"
          :tree-data="vbenTreeData"
          bordered
          class="h-full rounded-lg border shadow-sm"
          label-field="name"
          show-icon
          value-field="id"
          @select="handleSelect"
        >
          <template #header>
            <Radio.Group
              v-model:value="type"
              button-style="solid"
              class="flex w-full"
            >
              <Radio.Button
                :value="1"
                class="flex-1 !rounded-es-none text-center"
              >
                部门
              </Radio.Button>
              <Radio.Button :value="2" class="flex-1 text-center">
                职位
              </Radio.Button>
              <Radio.Button
                :value="3"
                class="flex-1 !rounded-ee-none text-center"
              >
                角色
              </Radio.Button>
            </Radio.Group>
          </template>
        </VbenTree>
      </div>
      <div class="flex-auto overflow-hidden rounded-lg border shadow-sm">
        <PrivilegeCheckbox
          v-model:checked-list="checkedList"
          :show-save="hasAccessByCodes(['system.privilege:save'])"
          :tree-data="treeData"
          @save="handleSave"
        />
      </div>
    </div>
  </Page>
</template>
