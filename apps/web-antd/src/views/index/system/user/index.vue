<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { TenantModel } from '#/api/sys/tenant';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doDelete, getUserPage } from '#/api/sys/user';

import { useColumns, useGridFormSchema } from './component/model';
import Form from './component/SettingUserModel.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/**
 * 编辑用户
 * @param row
 */
function onEdit(row: TenantModel) {
  formModalApi.setData(row).open();
}

/**
 * 创建用户
 */
function onCreate() {
  formModalApi.setData(null).open();
}
/**
 * 导出用户
 */
function onExport() {}
/**
 * 删除用户
 */
function onDelete(row: any) {
  const hideLoading = message.loading({
    content: `正在删除 昵称为：${row.nickName}`,
    duration: 0,
    key: 'action_process_msg',
  });
  doDelete({ id: row.id })
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
function onActionClick({ code, row }: OnActionClickParams<TenantModel>) {
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
          return await getUserPage({
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
    <FormModal @success="refreshGrid" />
    <Grid table-title="用户列表">
      <template #toolbar-tools>
        <Button
          type="primary"
          class="mr-2"
          v-access:code="'system.user:add'"
          @click="onCreate"
        >
          <Plus class="size-5" />
          添加
        </Button>
        <Button
          type="primary"
          v-access:code="'system.user:export'"
          @click="onExport"
        >
          <Plus class="size-5" />
          导出
        </Button>
      </template>
    </Grid>
  </Page>
</template>
