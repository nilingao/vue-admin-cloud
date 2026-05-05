<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { PlatformEntity } from '#/api/video/platform';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doPlatformPage, doPlatformRemove } from '#/api/video/platform';

import { useColumns, useGridFormSchema } from './modules/data';
import PlatformJoinModal from './modules/PlatformJoinModal.vue';
import PlatformModal from './modules/PlatformModal.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: PlatformModal,
  destroyOnClose: true,
});

const [JoinModal, joinModalApi] = useVbenModal({
  connectedComponent: PlatformJoinModal,
  destroyOnClose: true,
});

function onCreate() {
  formModalApi.setData({}).open();
}

function onEdit(row: PlatformEntity) {
  formModalApi.setData({ id: row.id, isUpdate: true }).open();
}

function onJoin(row: PlatformEntity) {
  joinModalApi.setData(row).open();
}

async function onDelete(row: PlatformEntity) {
  await doPlatformRemove({ id: row.id });
  refreshGrid();
}

function onActionClick({ code, row }: OnActionClickParams<PlatformEntity>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
    case 'join': {
      onJoin(row);
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
          return await doPlatformPage({
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
    <JoinModal />
    <Grid table-title="国标级联列表">
      <template #toolbar-tools>
        <Button
          v-access:code="'video.platform:add'"
          type="primary"
          @click="onCreate"
        >
          <Plus class="size-5" />
          添加
        </Button>
      </template>
    </Grid>
  </Page>
</template>
