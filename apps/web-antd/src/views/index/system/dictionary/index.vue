<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { DictionaryItemEntity } from '#/api/sys/dictionary';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  doDictionaryItemPage,
  doDictionaryItemRemove,
  doDictionaryTypeRemove,
} from '#/api/sys/dictionary';

import { useColumns, useGridFormSchema } from './modules/data';
import DictionaryItemModal from './modules/DictionaryItemModal.vue';
import DictionaryTypeModal from './modules/DictionaryTypeModal.vue';
import TypeTree from './modules/TypeTree.vue';

const selectedTypeId = ref<number | string>();
const typeTreeRef = ref<InstanceType<typeof TypeTree>>();

const [ItemModal, itemModalApi] = useVbenModal({
  connectedComponent: DictionaryItemModal,
  destroyOnClose: true,
});

const [TypeModal, typeModalApi] = useVbenModal({
  connectedComponent: DictionaryTypeModal,
  destroyOnClose: true,
});

function onCreateType() {
  typeModalApi.setData({}).open();
}

function onEditType(id: number | string) {
  typeModalApi.setData({ id }).open();
}

function onDeleteType(id: number | string) {
  Modal.confirm({
    title: '删除操作',
    content: '确定删除此字典类型？',
    async onOk() {
      await doDictionaryTypeRemove({ id });
      await typeTreeRef.value?.fetch();
      refreshGrid();
    },
  });
}

function onSelectType(typeId: number | string) {
  selectedTypeId.value = typeId;
  refreshGrid();
}

function onCreateItem() {
  if (!selectedTypeId.value) {
    message.warning('请先选择字典类型');
    return;
  }
  itemModalApi.setData({ typeId: selectedTypeId.value }).open();
}

function onEditItem(row: DictionaryItemEntity) {
  itemModalApi
    .setData({ ...row, typeId: selectedTypeId.value ?? row.typeId })
    .open();
}

function onDeleteItem(row: DictionaryItemEntity) {
  Modal.confirm({
    title: '删除操作',
    content: `确定删除字典条目“${row.name}”？`,
    async onOk() {
      await doDictionaryItemRemove({ id: row.id });
      refreshGrid();
    },
  });
}

function onActionClick({
  code,
  row,
}: OnActionClickParams<DictionaryItemEntity>) {
  switch (code) {
    case 'delete': {
      onDeleteItem(row);
      break;
    }
    case 'edit': {
      onEditItem(row);
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
          if (!selectedTypeId.value) {
            return { items: [], total: 0 };
          }
          return await doDictionaryItemPage({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            typeId: selectedTypeId.value,
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

async function refreshTypeTree() {
  await typeTreeRef.value?.fetch();
}
</script>

<template>
  <Page auto-content-height>
    <ItemModal @success="refreshGrid" />
    <TypeModal @success="refreshTypeTree" />
    <div class="flex h-full gap-4">
      <div class="w-[300px] shrink-0">
        <TypeTree
          ref="typeTreeRef"
          @select="onSelectType"
          @edit="onEditType"
          @remove="onDeleteType"
        />
      </div>
      <div class="min-w-0 flex-1">
        <Grid table-title="字典条目列表">
          <template #toolbar-tools>
            <Button
              type="primary"
              v-access:code="'system.dictionary:add_type'"
              @click="onCreateType"
            >
              <Plus class="size-5" />
              新增类型
            </Button>
            <Button
              type="primary"
              v-access:code="'system.dictionary:add_item'"
              @click="onCreateItem"
            >
              <Plus class="size-5" />
              新增条目
            </Button>
          </template>
        </Grid>
      </div>
    </div>
  </Page>
</template>
