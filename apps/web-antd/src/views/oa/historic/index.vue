<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ActivitiUserAlreadyEntity } from '#/api/oa/activiti';

import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doFindAlreadyList, OAIndex } from '#/api/oa/activiti';

import { useColumns, useGridFormSchema } from './modules/data';

const router = useRouter();

function onView(row: ActivitiUserAlreadyEntity) {
  const key = row.processDefinitionId?.split(':')?.[0];
  if (!key) return;
  router.push(`${OAIndex[key as keyof typeof OAIndex]}${row.businessKey}:2`);
}

function onActionClick({
  code,
  row,
}: OnActionClickParams<ActivitiUserAlreadyEntity>) {
  if (code === 'detail') {
    onView(row);
  }
}

const [Grid] = useVbenVxeGrid({
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
          return await doFindAlreadyList({
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
    <Grid table-title="历史流程列表" />
  </Page>
</template>
