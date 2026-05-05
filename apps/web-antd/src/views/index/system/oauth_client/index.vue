<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { OauthClientEntity } from '#/api/sys/oauthClient';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doOauthClientRemove, getOauthClientPage } from '#/api/sys/oauthClient';

import { useColumns, useGridFormSchema } from './modules/data';
import OauthClientModal from './modules/OauthClientModal.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: OauthClientModal,
  destroyOnClose: true,
});

function onCreate() {
  formModalApi.setData({}).open();
}

function onEdit(row: OauthClientEntity) {
  formModalApi.setData({ clientId: row.clientId }).open();
}

function onDelete(row: OauthClientEntity) {
  Modal.confirm({
    title: '删除操作',
    content: `确定删除客户端“${row.clientId}”？`,
    async onOk() {
      await doOauthClientRemove({ clientId: row.clientId });
      refreshGrid();
    },
  });
}

function onActionClick({ code, row }: OnActionClickParams<OauthClientEntity>) {
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
          return await getOauthClientPage({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'clientId',
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
    <Grid table-title="客户端列表">
      <template #toolbar-tools>
        <Button
          v-access:code="'system.oauth_client:add'"
          type="primary"
          @click="onCreate"
        >
          <Plus class="size-5" />
          新增
        </Button>
      </template>
    </Grid>
  </Page>
</template>
