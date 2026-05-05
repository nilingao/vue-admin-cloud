import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { TenantModel } from '#/api/sys/tenant';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'userName',
      label: '人员名称',
      componentProps: {
        placeholder: '请输入人员名称',
      },
    },
  ];
}

export function useColumns<T = TenantModel>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 80 },
    {
      field: 'id',
      minWidth: 140,
      sortable: true,
      title: '用户编号',
    },
    {
      field: 'userName',
      minWidth: 160,
      showOverflow: true,
      title: '人员名称',
    },
    {
      field: 'loginAccount',
      minWidth: 180,
      showOverflow: true,
      title: '账号',
    },
    {
      field: 'nickName',
      minWidth: 160,
      showOverflow: true,
      title: '昵称',
    },
    {
      field: 'idCard',
      minWidth: 200,
      showOverflow: true,
      title: '身份证号',
    },
    {
      field: 'phone',
      minWidth: 160,
      showOverflow: true,
      title: '电话',
    },
    {
      field: 'address',
      minWidth: 220,
      showOverflow: true,
      title: '居住地址',
    },
    {
      field: 'loginLastTime',
      minWidth: 180,
      sortable: true,
      title: '登录时间',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'userName',
          nameTitle: '用户',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'detail',
            text: '详情',
            show: () => hasAccessByCodes(['system.user:detail']),
          },
          {
            code: 'edit',
            show: () => hasAccessByCodes(['system.user:update']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['system.user:delete']),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 160,
    },
  ];
}

export const settingUpdateList = [
  { component: 'BaseSetting', key: '1', name: '基本设置' },
  { component: 'SecureSetting', key: '2', name: '身份设置' },
  { component: 'AccountBind', key: '3', name: '账号绑定' },
];

export const settingInsertList = [
  { component: 'BaseSetting', key: '1', name: '基本设置' },
];
