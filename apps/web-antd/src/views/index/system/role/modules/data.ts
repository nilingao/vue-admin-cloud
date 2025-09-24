import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { RoleModel } from '#/api/sys/role';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();
export function useGridFormSchema(): VbenFormSchema[] {
  return [{ component: 'Input', fieldName: 'roleName', label: '角色名称' }];
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
      showOverflow: true,
      title: '角色名称',
      minWidth: 200,
    },
    {
      field: 'memo',
      minWidth: 200,
      title: '备注',
    },
    {
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 130,
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '角色',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: () => {
              return hasAccessByCodes(['system.role:update']);
            },
          },
          {
            code: 'delete',
            show: () => {
              return hasAccessByCodes(['system.role:delete']);
            },
          },
        ],
      },
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
        placeholder: '请输入角色名称',
        min: 0,
        max: 1000,
      },
    },
    {
      component: 'Textarea',
      fieldName: 'memo',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
      },
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !id;
        },
      },
    },
  ];
}
