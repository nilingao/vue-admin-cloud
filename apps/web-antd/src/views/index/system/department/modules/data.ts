import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { TenantModel } from '#/api/sys/tenant';

import { useAccess } from '@vben/access';
import { getPopupContainer } from '@vben/utils';

import { doDepartmentTree } from '#/api/sys/department';

const { hasAccessByCodes } = useAccess();
export function useGridFormSchema(): VbenFormSchema[] {
  return [{ component: 'Input', fieldName: 'roleName', label: '部门名称' }];
}

export function useColumns<T = TenantModel>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '部门编号',
      width: 200,
      treeNode: true,
    },
    {
      field: 'departmentName',
      title: '部门名称',
      minWidth: 200,
    },
    {
      field: 'isEnable',
      title: '状态',
      minWidth: 200,
      cellRender: {
        name: 'CellTag',
      },
    },
    {
      field: 'memo',
      minWidth: 200,
      showOverflow: true,
      title: '备注',
    },
    {
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 160,
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '部门',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'add',
            text: '新增',
            show: () => {
              return hasAccessByCodes(['system.department:add']);
            },
          },
          {
            code: 'edit',
            show: () => {
              return hasAccessByCodes(['system.department:update']);
            },
          },
          {
            code: 'delete',
            show: () => {
              return hasAccessByCodes(['system.department:delete']);
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
      component: 'ApiTreeSelect',
      fieldName: 'parentId',
      label: '上级部门',
      componentProps: {
        api: async () => await doDepartmentTree({ topName: '默认' }),
        class: 'w-full',
        filterTreeNode(input: string, node: Recordable<any>) {
          if (!input || input.length === 0) {
            return true;
          }
          const title: string = node.departmentName ?? '';
          if (!title) return false;
          return true;
        },
        getPopupContainer,
        labelField: 'departmentName',
        showSearch: true,
        treeDefaultExpandAll: true,
        valueField: 'id',
        childrenField: 'children',
      },
    },
    {
      component: 'Input',
      fieldName: 'departmentName',
      label: '部门名称',
      rules: 'required',
      componentProps: {
        placeholder: '请选择部门名称',
        min: 0,
        max: 1000,
      },
    },
    {
      component: 'Switch',
      fieldName: 'isEnable',
      label: '是否开启',
      rules: 'required',
      defaultValue: 1,
      componentProps: {
        class: 'w-auto',
        checkedValue: 1,
        unCheckedValue: 0,
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
