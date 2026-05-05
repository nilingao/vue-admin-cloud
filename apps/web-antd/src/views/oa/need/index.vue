<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ActivitiUserNeedEntity } from '#/api/oa/activiti';

import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  doAppointClaim,
  doBackProcess,
  doFindNeedList,
  doSuspendedInstance,
  OAIndex,
} from '#/api/oa/activiti';

import { useColumns, useGridFormSchema } from './modules/data';

const router = useRouter();

function refreshGrid() {
  gridApi.query();
}

function onView(row: ActivitiUserNeedEntity) {
  const key = row.processDefinitionId?.split(':')?.[0];
  if (!key) return;
  router.push(`${OAIndex[key as keyof typeof OAIndex]}${row.businessKey}:2`);
}

function onClaim(row: ActivitiUserNeedEntity) {
  Modal.confirm({
    title: '签收任务',
    content: `确定签收任务“${row.instanceName ?? row.taskName}”？`,
    async onOk() {
      await doAppointClaim({ taskId: row.taskId });
      refreshGrid();
    },
  });
}

function onSuspended(row: ActivitiUserNeedEntity) {
  Modal.confirm({
    title: '状态切换',
    content: `确定切换流程“${row.instanceName ?? row.taskName}”状态？`,
    async onOk() {
      await doSuspendedInstance({ instanceId: row.instanceId });
      refreshGrid();
    },
  });
}

function onBackProcess(row: ActivitiUserNeedEntity) {
  Modal.confirm({
    title: '驳回任务',
    content: `确定驳回任务“${row.instanceName ?? row.taskName}”到上一节点？`,
    async onOk() {
      await doBackProcess({ taskId: row.taskId });
      refreshGrid();
    },
  });
}

function onActionClick({
  code,
  row,
}: OnActionClickParams<ActivitiUserNeedEntity>) {
  switch (code) {
    case 'detail': {
      onView(row);
      break;
    }
    case 'pending': {
      onSuspended(row);
      break;
    }
    case 'reject': {
      onBackProcess(row);
      break;
    }
    case 'sign_for': {
      onClaim(row);
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
          return await doFindNeedList({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'taskId',
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
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="待办流程列表" />
  </Page>
</template>
