import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { TenantModel } from '#/api/sys/tenant';

import { useAccess } from '@vben/access';
import { getPopupContainer } from '@vben/utils';

import { doPositionTree } from '#/api/sys/position';

const { hasAccessByCodes } = useAccess();
export function useGridFormSchema(): VbenFormSchema[] {
  return [{ component: 'Input', fieldName: 'positionName', label: '职位名称' }];
}

export function useColumns<T = TenantModel>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '职位编号',
      width: 200,
      treeNode: true,
    },
    {
      field: 'positionName',
      title: '职位名称',
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
          nameTitle: '职位',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'add',
            text: '新增',
            show: () => {
              return hasAccessByCodes(['system.position:add']);
            },
          },
          {
            code: 'edit',
            show: () => {
              return hasAccessByCodes(['system.position:update']);
            },
          },
          {
            code: 'delete',
            show: () => {
              return hasAccessByCodes(['system.position:delete']);
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
      label: '上级职位',
      componentProps: {
        api: async () => await doPositionTree({ topName: '默认' }),
        class: 'w-full',
        filterTreeNode(input: string, node: Recordable<any>) {
          if (!input || input.length === 0) {
            return true;
          }
          const title: string = node.positionName ?? '';
          if (!title) return false;
          return true;
        },
        getPopupContainer,
        labelField: 'positionName',
        showSearch: true,
        treeDefaultExpandAll: true,
        valueField: 'id',
        childrenField: 'children',
      },
    },
    {
      component: 'Input',
      fieldName: 'positionName',
      label: '职位名称',
      rules: 'required',
      componentProps: {
        placeholder: '请选择职位名称',
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
