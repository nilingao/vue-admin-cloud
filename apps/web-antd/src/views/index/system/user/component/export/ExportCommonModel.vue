<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { isFunction } from '@vben-core/shared/utils';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadByData, findFileName } from '#/utils/file/download';

const emit = defineEmits(['success']);

const state = reactive({
  // 传过来的数据
  searchParam: null,
  paramApi: undefined as any,
  exportApi: undefined as any,
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      {
        type: 'checkbox',
        width: 50,
      },
      {
        field: 'field',
        title: '字段编号',
      },
      {
        field: 'fieldName',
        title: '字段名称',
      },
      {
        field: 'isDesensitized',
        title: '是否加敏',
        cellRender: {
          name: 'CellSwitch',
          props: (record: any) => {
            return {
              disabled: !record.isDesensitized,
              checkedChildren: '已启用',
              unCheckedChildren: '已禁用',
            };
          },
        },
      },
    ],
    height: 500,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async () => {
          const data = await state.paramApi();
          const list = data.map((item: any) => {
            return { ...item, isDesensitized: item.isDesensitized ? 1 : 0 };
          });
          return list;
        },
      },
    },
    checkboxConfig: { checkAll: true },
    rowConfig: {
      keyField: 'field',
    },
    pagerConfig: {
      enabled: false,
    },
  } as VxeTableGridOptions,
});
const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    try {
      const allData = await gridApi.grid.getData();
      const allfieldList = allData.map((o) => o.fieldName);
      const data = await gridApi.grid.getCheckboxRecords(true);
      const fieldListSet = new Set(data.map((o: any) => o.fieldName));
      const desensitizedList = data
        .filter((o: any) => o.isDesensitized === 1)
        .map((o: any) => o.fieldName);
      const fieldList = allfieldList.filter((item) => !fieldListSet.has(item));
      const param = {
        request: state.searchParam,
        fieldList,
        desensitizedList,
      };
      if (!state.exportApi || !isFunction(state.exportApi)) return;
      const res = await state.exportApi(param);
      downloadByData(res.data, findFileName(res));
      emit('success');
      modalApi.close();
    } finally {
      modalApi.lock(false);
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData();
      if (data) {
        state.paramApi = data.paramApi;
        state.exportApi = data.exportApi;
        state.searchParam = data.searchParam;
      }
    }
  },
});
</script>

<template>
  <Modal class="w-[500px] lg:w-[800px]" title="选择导出列">
    <Grid grid-class="p-0" />
  </Modal>
</template>
