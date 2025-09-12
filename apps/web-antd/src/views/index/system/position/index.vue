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
import DepartmentModel from './modules/PositionModel.vue';

const [Modal, formModalApi] = useVbenModal({
  connectedComponent: DepartmentModel,
  destroyOnClose: true,
});

/**
 * 编辑职位
 * @param row
 */
function onEdit(row: PositionEntity) {
  formModalApi.setData(row).open();
}

/**
 * 创建职位
 */
function onCreate(parentId?: number) {
  formModalApi.setData({ parentId }).open();
}
/**
 * 删除职位
 */
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

/**
 * 表格操作按钮的回调函数
 */
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
    // fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: false,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async (formValues) => {
          const { items } = await doPositionPage({ ...formValues });
          return items;
        },
      },
    },
    pagerConfig: {
      enabled: false,
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
      parentField: 'parentId',
      rowField: 'id',
      childrenField: 'children',
      transform: false,
      expandAll: true,
    },
  } as VxeTableGridOptions,
});

/**
 * 刷新表格
 */
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
          type="primary"
          v-access:code="'system.position:add'"
          @click="() => onCreate()"
        >
          <Plus class="size-5" />
          新增职位
        </Button>
      </template>
    </Grid>
  </Page>
</template>
