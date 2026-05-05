<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { LogsEntity } from '#/api/sys/logs';

import { Page, useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doLogsPage } from '#/api/sys/logs';

import { useColumns, useGridFormSchema } from './modules/data';
import LogsDetailModal from './modules/LogsDetailModal.vue';

const [DetailModal, detailModalApi] = useVbenModal({
  connectedComponent: LogsDetailModal,
  destroyOnClose: true,
});

function onDetail(row: LogsEntity) {
  detailModalApi.setData(row).open();
}

function onActionClick({ code, row }: OnActionClickParams<LogsEntity>) {
  if (code === 'detail') {
    onDetail(row);
  }
}

const [Grid] = useVbenVxeGrid({
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
          return await doLogsPage({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            sortField: 'createTime',
            sortOrder: 'descend',
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
</script>

<template>
  <Page auto-content-height>
    <DetailModal />
    <Grid table-title="系统日志" />
  </Page>
</template>
