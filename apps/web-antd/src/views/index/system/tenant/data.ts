import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { TenantModel } from '#/api/sys/tenant';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'tenantName',
      label: '租户名',
    },
    { component: 'Input', fieldName: 'tenantUserName', label: '联系人名称' },
  ];
}

export function useColumns<T = TenantModel>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 80,
    },
    {
      field: 'id',
      title: '租户编号',
      width: 200,
    },
    {
      field: 'tenantName',
      showOverflow: true,
      title: '租户名',
      minWidth: 200,
    },
    {
      field: 'tenantUserName',
      minWidth: 200,
      title: '联系人',
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: '状态',
      width: 200,
    },
    {
      field: 'accountCount',
      title: '账号数量',
      width: 200,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '租户',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit', // 默认的编辑按钮
          {
            code: 'delete', // 默认的删除按钮
            // disabled: (row: SystemDeptApi.SystemDept) => {
            //   return !!(row.children && row.children.length > 0);
            // },
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 130,
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'tenantName',
      label: '租户名',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'accountCount',
      label: '账号数量',
      defaultValue: 0,
      componentProps: {
        min: 0,
        max: 1000,
      },
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: '状态',
    },
  ];
}
