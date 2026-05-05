<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { MediaServerEntity } from '#/api/video/mediaServer';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doMediaPage, doMediaRemove } from '#/api/video/mediaServer';

import { useColumns, useGridFormSchema } from './modules/data';
import MediaModal from './modules/MediaModal.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: MediaModal,
  destroyOnClose: true,
});

function onCreate() {
  formModalApi.setData({}).open();
}

function onEdit(row: MediaServerEntity) {
  formModalApi.setData({ id: row.id, isUpdate: true }).open();
}

async function onDelete(row: MediaServerEntity) {
  await doMediaRemove({ id: row.id });
  refreshGrid();
}

function onActionClick({ code, row }: OnActionClickParams<MediaServerEntity>) {
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
          return await doMediaPage({
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
    <Grid table-title="流媒体列表">
      <template #toolbar-tools>
        <Button
          v-access:code="'video.media:add'"
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
