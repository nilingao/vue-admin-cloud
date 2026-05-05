<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { TenantModel } from '#/api/sys/tenant';

import { reactive } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { Download, Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  doDelete,
  doExportEntityInfo,
  doExportUrl,
  getUserPage,
} from '#/api/sys/user';

import ExportCommonModel from './component/export/ExportCommonModel.vue';
import { useColumns, useGridFormSchema } from './component/model';
import Form from './component/SettingUserModel.vue';

const router = useRouter();
const state = reactive({
  formValues: {},
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [ExportModel, exportModalApi] = useVbenModal({
  connectedComponent: ExportCommonModel,
  destroyOnClose: true,
});

function onEdit(row: TenantModel) {
  formModalApi.setData(row).open();
}

function onCreate() {
  formModalApi.setData({}).open();
}

function onExport() {
  exportModalApi
    .setData({
      exportApi: doExportUrl,
      paramApi: doExportEntityInfo,
      searchParam: state.formValues,
    })
    .open();
}

function successExport() {
  message.success('导出成功');
}

function onDelete(row: any) {
  Modal.confirm({
    title: '删除操作',
    content: `确定删除用户“${row.nickName ?? row.userName ?? row.id}”？`,
    async onOk() {
      await doDelete({ id: row.id });
      refreshGrid();
    },
  });
}

function onActionClick({ code, row }: OnActionClickParams<TenantModel>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'detail': {
      router.push(`/system/user/user_detail/${row.id}`);
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
          state.formValues = formValues;
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

function refreshGrid() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="refreshGrid" />
    <ExportModel @success="successExport" />
    <Grid table-title="用户列表">
      <template #toolbar-tools>
        <Button
          v-access:code="'system.user:add'"
          class="mr-2"
          type="primary"
          @click="onCreate"
        >
          <Plus class="size-5" />
          添加
        </Button>
        <Button
          v-access:code="'system.user:export'"
          type="primary"
          @click="onExport"
        >
          <Download class="size-5" />
          导出
        </Button>
      </template>
    </Grid>
  </Page>
</template>
