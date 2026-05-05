<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SmsConfigEntity } from '#/api/sys/smsConfig';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doSmsConfigRemove, getSmsConfigPage } from '#/api/sys/smsConfig';

import { useColumns, useGridFormSchema } from './modules/data';
import SmsConfigModal from './modules/SmsConfigModal.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: SmsConfigModal,
  destroyOnClose: true,
});

function onCreate() {
  formModalApi.setData({}).open();
}

function onEdit(row: SmsConfigEntity) {
  formModalApi.setData({ id: row.id }).open();
}

function onDelete(row: SmsConfigEntity) {
  Modal.confirm({
    title: '删除操作',
    content: `确定删除短信配置“${row.configName ?? row.id}”？`,
    async onOk() {
      await doSmsConfigRemove({ id: row.id });
      refreshGrid();
    },
  });
}

function onActionClick({ code, row }: OnActionClickParams<SmsConfigEntity>) {
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
          return await getSmsConfigPage({
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
    <Grid table-title="短信配置列表">
      <template #toolbar-tools>
        <Button
          v-access:code="'system.sms.sms_config:add'"
          type="primary"
          @click="onCreate"
        >
          <Plus class="size-5" />
          新增配置
        </Button>
      </template>
    </Grid>
  </Page>
</template>
