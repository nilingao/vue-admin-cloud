<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { TenantModel } from '#/api/sys/tenant';

import { computed } from 'vue';

import { useAccess } from '@vben/access';
import { confirm, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doFindUserBind, doUnBindMiniWeb } from '#/api/sys/user';

import QrCodeBindModel from './QrCodeBindModel.vue';

type LoginType = 'wx_mini_user';
const { hasAccessByCodes } = useAccess();

const [QrCodeModal, formModalApi] = useVbenModal({
  connectedComponent: QrCodeBindModel,
  destroyOnClose: true,
});

const getBindIcon = computed(() => {
  return (loginType: LoginType) => {
    switch (loginType) {
      case 'wx_mini_user': {
        return 'ant-design:wechat-filled';
      }
      default: {
        return '';
      }
    }
  };
});
/**
 * 绑定，解绑
 */
const handleBind = async (res: any) => {
  switch (res.loginType) {
    case 'wx_mini_user': {
      if (res.isBind === 1) {
        await doUnBindMiniWeb();
        refreshGrid();
      } else {
        formModalApi.setData({ open: 1 }).open();
      }
      break;
    }
    default: {
      break;
    }
  }
};
/**
 * 表格操作按钮的回调函数
 */
function onActionClick({ code, row }: OnActionClickParams<TenantModel>) {
  switch (code) {
    case 'bind': {
      confirm(row.isBind === 1 ? '是否解绑账户' : '是否绑定账户')
        .then(() => {
          handleBind(row);
        })
        .catch(() => {
          message.error('用户取消操作');
        });

      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { type: 'seq', title: '序号', width: 80 },
      {
        field: 'menuName',
        title: '绑定账号信息',
        slots: { default: 'menuName' },
        width: 150,
      },
      {
        field: 'image',
        cellRender: {
          name: 'CellImage',
        },
        title: '头像',
        width: 100,
      },
      {
        field: 'isBind',
        cellRender: {
          name: 'CellTag',
          options: [
            {
              color: 'error',
              label: '否',
              value: 0,
            },
            {
              color: 'success',
              label: '是',
              value: 1,
            },
          ],
        },
        title: '是否绑定',
        width: 150,
      },
      {
        align: 'center',
        cellRender: {
          name: 'CellOperation',
          attrs: {
            nameField: 'name',
            onClick: onActionClick,
          },
          options: [
            {
              code: 'bind',
              text: (row: any) => {
                return row.isBind === 1 ? '解绑' : '绑定';
              },
              show: () => {
                return hasAccessByCodes(['work.personal:other_save']);
              },
            },
          ],
        },
        field: 'operation',
        fixed: 'right',
        title: '操作',
        width: 150,
      },
    ],
    height: 500,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async () => {
          return await doFindUserBind();
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    pagerConfig: {
      enabled: false,
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
  <div class="relative h-[500px] w-full">
    <div class="absolute bottom-0 left-0 right-0 top-0">
      <Grid grid-class="p-0">
        <template #menuName="{ row }">
          <div class="flex w-full items-center justify-center gap-1">
            <div class="size-5 flex-shrink-0">
              <IconifyIcon
                :icon="getBindIcon(row.loginType)"
                class="size-full"
              />
            </div>
          </div>
        </template>
      </Grid>
    </div>
    <QrCodeModal @success="refreshGrid" />
  </div>
</template>
