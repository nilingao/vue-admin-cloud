<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ConfigEntity } from '#/api/sys/config';

import { Page, useVbenModal } from '@vben/common-ui';

import { Alert } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doConfigPage } from '#/api/sys/config';

import ConfigModal from './modules/ConfigModal.vue';
import { useColumns, useGridFormSchema } from './modules/data';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: ConfigModal,
  destroyOnClose: true,
});

function onEdit(row: ConfigEntity) {
  formModalApi.setData(row).open();
}

function onActionClick({ code, row }: OnActionClickParams<ConfigEntity>) {
  if (code === 'edit') {
    onEdit(row);
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
          return await doConfigPage({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'k',
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
    <Grid table-title="系统设置列表">
      <template #toolbar-actions>
        <Alert
          banner
          show-icon
          type="warning"
          message="温馨提醒：无必要情况下，请勿随意更改系统配置，避免导致系统无法正常运行。"
        />
      </template>
    </Grid>
  </Page>
</template>
