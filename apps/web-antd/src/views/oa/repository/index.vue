<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ActivitiRepositoryEntity } from '#/api/oa/activiti';

import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  doDeleteProcess,
  doFindRepositoryList,
  doSuspendedProcessDefinition,
  OAIndex,
} from '#/api/oa/activiti';

import { useColumns, useGridFormSchema } from './modules/data';

const router = useRouter();

function onCreate() {
  router.push(`${OAIndex.Deploy}undefined`);
}

function onDeploy(row: ActivitiRepositoryEntity) {
  router.push(`${OAIndex.Deploy}${row.id}`);
}

function onSuspended(row: ActivitiRepositoryEntity) {
  Modal.confirm({
    title: '状态切换',
    content: `确定切换流程“${row.deploymentName ?? row.key}”状态？`,
    async onOk() {
      await doSuspendedProcessDefinition({ processDefinitionId: row.id });
      refreshGrid();
    },
  });
}

function onDelete(row: ActivitiRepositoryEntity) {
  Modal.confirm({
    title: '删除操作',
    content: `确定删除流程“${row.deploymentName ?? row.key}”？`,
    async onOk() {
      await doDeleteProcess({ deploymentId: row.deploymentId, stats: 2 });
      refreshGrid();
    },
  });
}

function onActionClick({
  code,
  row,
}: OnActionClickParams<ActivitiRepositoryEntity>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'deploy': {
      onDeploy(row);
      break;
    }
    case 'pending': {
      onSuspended(row);
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
          return await doFindRepositoryList({
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
    <Grid table-title="流程定义">
      <template #toolbar-tools>
        <Button
          v-access:code="'oa.repository:add'"
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
