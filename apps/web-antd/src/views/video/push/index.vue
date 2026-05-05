<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { PushEntity } from '#/api/video/push';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doPushGetPlayUrl, doPushPage, doPushRemove } from '#/api/video/push';

import VideoPlayModal from '../modules/VideoPlayModal.vue';
import { useColumns, useGridFormSchema } from './modules/data';
import PushModal from './modules/PushModal.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: PushModal,
  destroyOnClose: true,
});

const [PlayModal, playModalApi] = useVbenModal({
  connectedComponent: VideoPlayModal,
  destroyOnClose: true,
});

function onCreate() {
  formModalApi.setData({}).open();
}

function onEdit(row: PushEntity) {
  formModalApi.setData({ id: row.id, isUpdate: true }).open();
}

async function onDelete(row: PushEntity) {
  await doPushRemove({ id: row.id });
  refreshGrid();
}

async function onPlay(row: PushEntity) {
  const data = await doPushGetPlayUrl({ id: row.id });
  playModalApi.setData(data).open();
}

function onActionClick({ code, row }: OnActionClickParams<PushEntity>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
    case 'play': {
      onPlay(row);
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
          return await doPushPage({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: { keyField: 'id' },
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
    <PlayModal />
    <Grid table-title="推流列表">
      <template #toolbar-tools>
        <Button
          v-access:code="'video.push:add'"
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
