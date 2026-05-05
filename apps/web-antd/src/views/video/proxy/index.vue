<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ProxyEntity } from '#/api/video/proxy';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  doProxyGetPlayUrl,
  doProxyPage,
  doProxyRemove,
  doProxyStart,
  doProxyStop,
} from '#/api/video/proxy';

import VideoPlayModal from '../modules/VideoPlayModal.vue';
import { useColumns, useGridFormSchema } from './modules/data';
import ProxyModal from './modules/ProxyModal.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: ProxyModal,
  destroyOnClose: true,
});

const [PlayModal, playModalApi] = useVbenModal({
  connectedComponent: VideoPlayModal,
  destroyOnClose: true,
});

function onCreate() {
  formModalApi.setData({}).open();
}

function onEdit(row: ProxyEntity) {
  formModalApi.setData({ id: row.id, isUpdate: true }).open();
}

async function onDelete(row: ProxyEntity) {
  await doProxyRemove({ id: row.id });
  refreshGrid();
}

async function onEnable(row: ProxyEntity) {
  if (row.status === 1) {
    await doProxyStop({ id: row.id });
    message.success('已停用拉流代理');
  } else {
    await doProxyStart({ id: row.id });
    message.success('已启用拉流代理');
  }
  refreshGrid();
}

async function onPlay(row: ProxyEntity) {
  const data = await doProxyGetPlayUrl({ id: row.id });
  playModalApi.setData(data).open();
}

function onActionClick({ code, row }: OnActionClickParams<ProxyEntity>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
    case 'enable': {
      onEnable(row);
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
          return await doProxyPage({
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
    <Grid table-title="拉流列表">
      <template #toolbar-tools>
        <Button
          v-access:code="'video.proxy:add'"
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
