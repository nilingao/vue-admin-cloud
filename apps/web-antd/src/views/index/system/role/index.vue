<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { RoleModel as RoleModelVo } from '#/api/sys/role';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doRemove, getRolePage } from '#/api/sys/role';

import { useColumns, useGridFormSchema } from './modules/data';
import RoleModel from './modules/RoleModel.vue';

const [Modal, formModalApi] = useVbenModal({
  connectedComponent: RoleModel,
  destroyOnClose: true,
});

/**
 * 编辑角色
 * @param row
 */
function onEdit(row: RoleModelVo) {
  formModalApi.setData(row).open();
}

/**
 * 创建角色
 */
function onCreate() {
  formModalApi.setData(null).open();
}
/**
 * 删除角色
 */
function onDelete(row: RoleModelVo) {
  const hideLoading = message.loading({
    content: `正在删除 角色名为：${row.roleName}`,
    duration: 0,
    key: 'action_process_msg',
  });
  doRemove({ id: row.id })
    .then(() => {
      message.success({
        content: '删除成功',
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

/**
 * 表格操作按钮的回调函数
 */
function onActionClick({ code, row }: OnActionClickParams<RoleModelVo>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    // fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: false,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getRolePage({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions,
});

/**
 * 刷新表格
 */
function refreshGrid() {
  gridApi.query();
}
</script>
<template>
  <Page auto-content-height>
    <Modal @success="refreshGrid" />
    <Grid table-title="角色列表">
      <template #toolbar-tools>
        <Button
          type="primary"
          v-access:code="'system.role:add'"
          @click="onCreate"
        >
          <Plus class="size-5" />
          新增角色
        </Button>
      </template>
    </Grid>
  </Page>
</template>
