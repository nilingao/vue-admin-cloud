<script lang="ts" setup>
import type { Key } from 'ant-design-vue/es/_util/type';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ActivitiUserNeedEntity } from '#/api/oa/activiti';

import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { Avatar, Button, Card, Modal, Statistic, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  doBackProcess,
  doClaim,
  doDeleteProcessInstance,
  doFindUserAlreadyList,
  doFindUserLaunchList,
  doFindUserNeedList,
  doStatsUserOa,
  doSuspendedInstance,
  OAIndex,
} from '#/api/oa/activiti';

import { getColumns, quickNavItems, tabOptions } from './modules/data';

type GridColumn = NonNullable<VxeTableGridOptions['columns']>[number];

const router = useRouter();
const userStore = useUserStore();

const activeKey = ref('need');
const stats = ref({
  userAlreadyCount: 0,
  userLaunchCount: 0,
  userNeedCount: 0,
});

const greeting = computed(() => {
  const hour = new Date().getHours();
  const name =
    userStore.userInfo?.nickName || userStore.userInfo?.realName || '';
  if (hour < 10) return `早上好，${name}，开始您一天的工作吧！`;
  if (hour < 12) return `中午好，${name}，继续努力。`;
  if (hour < 18) return `下午好，${name}，保持工作状态。`;
  return `晚上好，${name}，记得早点休息。`;
});

function refreshGrid() {
  gridApi.query();
}

function getApi() {
  if (activeKey.value === 'need') return doFindUserNeedList;
  if (activeKey.value === 'launch') return doFindUserLaunchList;
  return doFindUserAlreadyList;
}

function viewRecord(row: ActivitiUserNeedEntity, mode = '2') {
  const key = row.processDefinitionId?.split(':')?.[0];
  const path = key ? OAIndex[key as keyof typeof OAIndex] : undefined;
  if (!path) return;
  router.push(`${path}${row.businessKey}:${mode}:${row.taskId ?? ''}`);
}

async function claim(row: ActivitiUserNeedEntity) {
  await doClaim({ taskId: row.taskId });
  refreshGrid();
}

async function suspend(row: ActivitiUserNeedEntity) {
  await doSuspendedInstance({ instanceId: row.instanceId });
  refreshGrid();
}

async function deleteProcess(row: ActivitiUserNeedEntity) {
  await doDeleteProcessInstance({
    memo: '',
    processInstanceId: row.instanceId,
  });
  refreshGrid();
}

async function backProcess(row: ActivitiUserNeedEntity) {
  await doBackProcess({ taskId: row.taskId });
  refreshGrid();
}

function onActionClick({
  code,
  row,
}: OnActionClickParams<ActivitiUserNeedEntity>) {
  switch (code) {
    case 'claim': {
      claim(row);
      break;
    }
    case 'delete': {
      Modal.confirm({
        title: '删除流程',
        content: `确定删除“${row.instanceName ?? row.taskName}”？`,
        onOk: () => deleteProcess(row),
      });
      break;
    }
    case 'reject': {
      backProcess(row);
      break;
    }
    case 'review': {
      viewRecord(row, '1');
      break;
    }
    case 'suspend': {
      suspend(row);
      break;
    }
    case 'view': {
      viewRecord(row, '2');
      break;
    }
  }
}

const operationColumn: GridColumn = {
  align: 'center',
  cellRender: {
    attrs: {
      nameField: 'instanceName',
      onClick: onActionClick,
    },
    name: 'CellOperation',
    options: [
      {
        code: 'review',
        show: () => activeKey.value === 'need',
        text: '审核',
      },
      { code: 'view', text: '查看' },
      {
        code: 'claim',
        show: (row: ActivitiUserNeedEntity) =>
          activeKey.value === 'need' && row.assignee === null,
        text: '签收',
      },
      {
        code: 'suspend',
        show: (row: ActivitiUserNeedEntity) =>
          activeKey.value === 'launch' && row.processVariables?.status === 1,
        text: (row: ActivitiUserNeedEntity) =>
          row.isSuspended ? '激活' : '挂起',
      },
      {
        code: 'reject',
        show: () => activeKey.value === 'need',
        text: '驳回',
      },
      {
        code: 'delete',
        show: (row: ActivitiUserNeedEntity) =>
          activeKey.value === 'launch' && row.processVariables?.status === 1,
        text: '删除',
      },
    ],
  },
  field: 'operation',
  fixed: 'right',
  title: '操作',
  width: 220,
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [...(getColumns(activeKey.value) ?? []), operationColumn],
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          return await getApi()({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
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
      zoom: true,
    },
  } as VxeTableGridOptions,
});

function onTabChange(key: Key) {
  const nextKey = String(key);
  activeKey.value = nextKey;
  gridApi.setGridOptions({
    columns: [...(getColumns(nextKey) ?? []), operationColumn],
    rowConfig: { keyField: nextKey === 'need' ? 'taskId' : 'instanceId' },
  } as VxeTableGridOptions);
  refreshGrid();
}

function goUrl(url: string) {
  router.push(url);
}

onMounted(async () => {
  stats.value = { ...stats.value, ...(await doStatsUserOa()) };
});
</script>

<template>
  <Page auto-content-height>
    <div class="space-y-4">
      <Card>
        <div class="flex flex-wrap items-center gap-6">
          <Avatar
            :size="72"
            :src="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
          />
          <div class="min-w-[260px] flex-1">
            <div class="text-lg font-medium">{{ greeting }}</div>
            <div class="text-muted-foreground">
              集中处理流程任务和日常申请。
            </div>
          </div>
          <Statistic title="待办" :value="stats.userNeedCount" />
          <Statistic title="发起" :value="stats.userLaunchCount" />
          <Statistic title="已办" :value="stats.userAlreadyCount" />
        </div>
      </Card>

      <div class="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <Tabs :active-key="activeKey" @change="onTabChange">
            <Tabs.TabPane
              v-for="item in tabOptions"
              :key="item.key"
              :tab="item.label"
            />
          </Tabs>
          <Grid grid-class="p-0" />
        </Card>
        <Card title="快捷导航">
          <div class="grid grid-cols-2 gap-3">
            <Button
              v-for="item in quickNavItems"
              :key="item.title"
              class="h-16"
              @click="goUrl(item.url)"
            >
              <span :style="{ color: item.color }">{{ item.title }}</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  </Page>
</template>
