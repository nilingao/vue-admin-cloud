<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { MobileMessageTemplateEntity } from '#/api/sys/mobileMessageTemplate';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  doMobileMessageTemplateRemove,
  getMobileMessageTemplatePage,
} from '#/api/sys/mobileMessageTemplate';

import { useColumns, useGridFormSchema } from './modules/data';
import MobileMessageTemplateModal from './modules/MobileMessageTemplateModal.vue';
import SmsConfigTree from './modules/SmsConfigTree.vue';

const selectedConfigId = ref<number | string>();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: MobileMessageTemplateModal,
  destroyOnClose: true,
});

function onSelectConfig(configId: number | string) {
  selectedConfigId.value = configId;
  refreshGrid();
}

function onCreate() {
  if (!selectedConfigId.value) {
    message.warning('请先选择短信配置');
    return;
  }
  formModalApi.setData({ configId: selectedConfigId.value }).open();
}

function onEdit(row: MobileMessageTemplateEntity) {
  formModalApi
    .setData({ id: row.id, configId: selectedConfigId.value ?? row.configId })
    .open();
}

function onDelete(row: MobileMessageTemplateEntity) {
  Modal.confirm({
    title: '删除操作',
    content: `确定删除短信模板“${row.title ?? row.id}”？`,
    async onOk() {
      await doMobileMessageTemplateRemove({ id: row.id });
      refreshGrid();
    },
  });
}

function onActionClick({
  code,
  row,
}: OnActionClickParams<MobileMessageTemplateEntity>) {
  switch (code) {
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
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          if (!selectedConfigId.value) {
            return { items: [], total: 0 };
          }
          return await getMobileMessageTemplatePage({
            configId: selectedConfigId.value,
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
    <FormModal @success="refreshGrid" />
    <div class="flex h-full gap-4">
      <div class="w-[300px] shrink-0">
        <SmsConfigTree @select="onSelectConfig" />
      </div>
      <div class="min-w-0 flex-1">
        <Grid table-title="短信模板列表">
          <template #toolbar-tools>
            <Button
              v-access:code="'system.sms.mobile_message_template:add'"
              type="primary"
              @click="onCreate"
            >
              <Plus class="size-5" />
              新增模板
            </Button>
          </template>
        </Grid>
      </div>
    </div>
  </Page>
</template>
