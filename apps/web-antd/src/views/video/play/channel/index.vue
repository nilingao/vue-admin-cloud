<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { DeviceChannelEntity } from '#/api/video/deviceChannel';

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  doDelDeviceChannel,
  doDeviceChannelPage,
} from '#/api/video/deviceChannel';
import { doPlayStart, doPlayStop } from '#/api/video/play';

import { useColumns, useGridFormSchema } from './modules/data';
import DeviceChannelModal from './modules/DeviceChannelModal.vue';

const route = useRoute();
const router = useRouter();
const deviceId = computed(() => String(route.params.id ?? ''));

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: DeviceChannelModal,
  destroyOnClose: true,
});

function onCreate() {
  formModalApi
    .setData({
      deviceId: deviceId.value,
      isUpdate: false,
    })
    .open();
}

function onEdit(row: DeviceChannelEntity) {
  formModalApi
    .setData({
      channelId: row.channelId,
      deviceId: deviceId.value,
      isUpdate: true,
    })
    .open();
}

async function onPlay(row: DeviceChannelEntity) {
  await doPlayStart({
    channelId: row.channelId,
    deviceId: row.deviceId,
  });
  message.success(`播放通道：${row.channelId}`);
  refreshGrid();
}

async function onStop(row: DeviceChannelEntity) {
  await doPlayStop({
    channelId: row.channelId,
    deviceId: row.deviceId,
  });
  message.success(`暂停通道：${row.channelId}`);
  refreshGrid();
}

function onRecord(row: DeviceChannelEntity) {
  router.push(`/video/play/record/${row.deviceId}/${row.channelId}`);
}

async function onDelete(row: DeviceChannelEntity) {
  await doDelDeviceChannel({
    channelId: row.channelId,
    deviceId: row.deviceId,
  });
  refreshGrid();
}

function onActionClick({
  code,
  row,
}: OnActionClickParams<DeviceChannelEntity>) {
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
    case 'record': {
      onRecord(row);
      break;
    }
    case 'stop': {
      onStop(row);
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
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async (_params, formValues) => {
          return await doDeviceChannelPage({
            deviceId: deviceId.value,
            ...formValues,
          });
        },
      },
      response: {
        list: 'data',
        result: 'data',
      },
    },
    rowConfig: {
      keyField: 'channelId',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
    treeConfig: {
      childrenField: 'children',
      expandAll: true,
      parentField: 'parentId',
      rowField: 'channelId',
      transform: false,
    },
  } as VxeTableGridOptions,
});

function refreshGrid() {
  gridApi.query();
}

function goBack() {
  router.push('/video/play');
}
</script>

<template>
  <Page auto-content-height :title="`国标通道：${deviceId}`">
    <template #extra>
      <Button @click="goBack">返回</Button>
    </template>
    <FormModal @success="refreshGrid" />
    <Grid>
      <template #toolbar-tools>
        <Button
          v-access:code="'video.play.channel:add'"
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
