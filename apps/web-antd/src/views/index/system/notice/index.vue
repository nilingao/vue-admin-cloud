<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { PublicNoticeEntity } from '#/api/notice/publicNotice';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  doPublicNoticeRemove,
  getPublicNoticePage,
} from '#/api/notice/publicNotice';

import { useColumns, useGridFormSchema } from './modules/data';
import PublicNoticeModal from './modules/PublicNoticeModal.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: PublicNoticeModal,
  destroyOnClose: true,
});

function onCreate() {
  formModalApi.setData({}).open();
}

function onEdit(row: PublicNoticeEntity) {
  formModalApi.setData({ id: row.id }).open();
}

function onDelete(row: PublicNoticeEntity) {
  Modal.confirm({
    title: '删除操作',
    content: `确定删除公告“${row.title ?? row.id}”？`,
    async onOk() {
      await doPublicNoticeRemove({ id: row.id });
      refreshGrid();
    },
  });
}

function onActionClick({ code, row }: OnActionClickParams<PublicNoticeEntity>) {
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
          return await getPublicNoticePage({
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
    sortConfig: {
      defaultSort: {
        field: 'createTime',
        order: 'desc',
      },
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
    <Grid table-title="平台公告通知列表">
      <template #toolbar-tools>
        <Button
          type="primary"
          v-access:code="'system.notice:add'"
          @click="onCreate"
        >
          <Plus class="size-5" />
          新增
        </Button>
      </template>
    </Grid>
  </Page>
</template>
