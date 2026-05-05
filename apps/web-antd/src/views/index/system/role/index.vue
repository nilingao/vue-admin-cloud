<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { RoleModel as RoleModelVo } from '#/api/sys/role';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';
import { $t } from '@vben/locales';

import { Modal as AntModal, Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doRemove, getRolePage } from '#/api/sys/role';

import { useColumns, useGridFormSchema } from './modules/data';
import RoleModel from './modules/RoleModel.vue';

const [Modal, formModalApi] = useVbenModal({
  connectedComponent: RoleModel,
  destroyOnClose: true,
});

function onEdit(row: RoleModelVo) {
  formModalApi.setData(row).open();
}

function onCreate() {
  formModalApi.setData(null).open();
}

function onDelete(row: RoleModelVo) {
  AntModal.confirm({
    cancelText: $t('common.cancel'),
    content: $t('system.role.confirmDeleteContent', { roleName: row.roleName }),
    okText: $t('common.confirm'),
    title: $t('system.role.confirmDelete'),
    onOk: async () => {
      const hideLoading = message.loading({
        content: $t('system.role.deleting', { roleName: row.roleName }),
        duration: 0,
        key: 'action_process_msg',
      });
      try {
        await doRemove({ id: row.id });
        message.success({
          content: $t('system.role.deleteSuccess'),
          key: 'action_process_msg',
        });
        refreshGrid();
      } catch {
        message.error({
          content: $t('system.role.deleteFailed'),
          key: 'action_process_msg',
        });
      } finally {
        hideLoading();
      }
    },
  });
}

function onActionClick({ code, row }: OnActionClickParams<RoleModelVo>) {
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
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getRolePage({
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
    <Modal @success="refreshGrid" />
    <Grid :table-title="$t('system.role.list')">
      <template #toolbar-tools>
        <Button
          v-access:code="'system.role:add'"
          type="primary"
          @click="onCreate"
        >
          <Plus class="size-5" />
          {{ $t('system.role.addRole') }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
