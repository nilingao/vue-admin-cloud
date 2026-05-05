<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { PositionEntity } from '#/api/sys/position';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doPositionPage, doPositionRemove } from '#/api/sys/position';

import { useColumns, useGridFormSchema } from './modules/data';
import PositionModel from './modules/PositionModel.vue';

const [Modal, formModalApi] = useVbenModal({
  connectedComponent: PositionModel,
  destroyOnClose: true,
});

function onEdit(row: PositionEntity) {
  formModalApi.setData(row).open();
}

function onCreate(parentId?: number) {
  formModalApi.setData({ parentId }).open();
}

function onDelete(row: PositionEntity) {
  const hideLoading = message.loading({
    content: `正在删除 职位名为：${row.positionName}`,
    duration: 0,
    key: 'action_process_msg',
  });
  doPositionRemove({ id: row.id })
    .then(() => {
      message.success({
        content: '删除成功',
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onActionClick({ code, row }: OnActionClickParams<PositionEntity>) {
  switch (code) {
    case 'add': {
      onCreate(row.id);
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
        query: async (formValues) => {
          const { items } = await doPositionPage({ ...formValues });
          return items;
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
    treeConfig: {
      childrenField: 'children',
      expandAll: true,
      parentField: 'parentId',
      rowField: 'id',
      transform: false,
    },
  } as VxeTableGridOptions,
});

function refreshGrid() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <Modal @success="refreshGrid" />
    <Grid table-title="职位列表">
      <template #toolbar-tools>
        <Button
          v-access:code="'system.position:add'"
          type="primary"
          @click="() => onCreate()"
        >
          <Plus class="size-5" />
          新增职位
        </Button>
      </template>
    </Grid>
  </Page>
</template>
