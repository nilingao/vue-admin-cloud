<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { DeviceEntity } from '#/api/video/device';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doDelDeviceId, doDevicePage } from '#/api/video/device';
import { doSyncDeviceChannel } from '#/api/video/deviceChannel';

import { useColumns, useGridFormSchema } from './modules/data';
import DeviceChannelSyncModal from './modules/DeviceChannelSyncModal.vue';
import DeviceModal from './modules/DeviceModal.vue';

const router = useRouter();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: DeviceModal,
  destroyOnClose: true,
});

const [SyncModal, syncModalApi] = useVbenModal({
  connectedComponent: DeviceChannelSyncModal,
  destroyOnClose: true,
});

function onCreate() {
  formModalApi.setData({}).open();
}

function onEdit(row: DeviceEntity) {
  formModalApi.setData({ deviceId: row.deviceId, isUpdate: true }).open();
}

function onChannel(row: DeviceEntity) {
  router.push(`/video/play/channel/${row.deviceId}`);
}

async function onRefresh(row: DeviceEntity) {
  if (row.online === 0) {
    message.error('设备离线');
    return;
  }

  await doSyncDeviceChannel({ deviceId: row.deviceId });
  syncModalApi.setData({ deviceId: row.deviceId }).open();
}

async function onDelete(row: DeviceEntity) {
  await doDelDeviceId({ deviceId: row.deviceId });
  refreshGrid();
}

function onActionClick({ code, row }: OnActionClickParams<DeviceEntity>) {
  switch (code) {
    case 'channel': {
      onChannel(row);
      break;
    }
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
    case 'refresh': {
      onRefresh(row);
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
          return await doDevicePage({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'deviceId',
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
    <SyncModal @close="refreshGrid" />
    <Grid table-title="国标设备">
      <template #toolbar-tools>
        <Button
          v-access:code="'video.play:add'"
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
