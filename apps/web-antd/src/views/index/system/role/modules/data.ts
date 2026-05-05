import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { RoleModel } from '#/api/sys/role';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'roleName',
      label: '角色名称',
      componentProps: {
        placeholder: '请输入角色名称',
      },
    },
  ];
}

export function useColumns<T = RoleModel>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 80,
    },
    {
      field: 'id',
      title: '角色编号',
      width: 200,
    },
    {
      field: 'roleName',
      minWidth: 200,
      showOverflow: true,
      title: '角色名称',
    },
    {
      field: 'memo',
      minWidth: 200,
      showOverflow: true,
      title: '备注',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'roleName',
          nameTitle: '角色',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: () => hasAccessByCodes(['system.role:update']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['system.role:delete']),
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
      fieldName: 'roleName',
      label: '角色名称',
      rules: 'required',
      componentProps: {
        max: 1000,
        min: 0,
        placeholder: '请输入角色名称',
      },
    },
    {
      component: 'Textarea',
      fieldName: 'memo',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
}
