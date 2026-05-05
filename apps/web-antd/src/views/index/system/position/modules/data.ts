import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PositionEntity } from '#/api/sys/position';

import { useAccess } from '@vben/access';
import { getPopupContainer } from '@vben/utils';

import { doPositionTree } from '#/api/sys/position';

const { hasAccessByCodes } = useAccess();

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'positionName',
      label: '职位名称',
      componentProps: {
        placeholder: '请输入职位名称',
      },
    },
  ];
}

export function useColumns<T = PositionEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '职位编号',
      treeNode: true,
      width: 200,
    },
    {
      field: 'positionName',
      minWidth: 200,
      title: '职位名称',
    },
    {
      cellRender: {
        name: 'CellTag',
      },
      field: 'isEnable',
      minWidth: 200,
      title: '状态',
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
          nameField: 'positionName',
          nameTitle: '职位',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'add',
            show: () => hasAccessByCodes(['system.position:add']),
            text: '新增',
          },
          {
            code: 'edit',
            show: () => hasAccessByCodes(['system.position:update']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['system.position:delete']),
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

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'ApiTreeSelect',
      fieldName: 'parentId',
      label: '上级职位',
      componentProps: {
        api: async () => await doPositionTree({ topName: '默认' }),
        childrenField: 'children',
        class: 'w-full',
        filterTreeNode(input: string, node: Recordable<any>) {
          if (!input) {
            return true;
          }
          const title: string = node.positionName ?? '';
          return title.includes(input);
        },
        getPopupContainer,
        labelField: 'positionName',
        showSearch: true,
        treeDefaultExpandAll: true,
        valueField: 'id',
      },
    },
    {
      component: 'Input',
      fieldName: 'positionName',
      label: '职位名称',
      rules: 'required',
      componentProps: {
        max: 1000,
        min: 0,
        placeholder: '请输入职位名称',
      },
    },
    {
      component: 'Switch',
      defaultValue: 1,
      fieldName: 'isEnable',
      label: '是否开启',
      rules: 'required',
      componentProps: {
        checkedValue: 1,
        class: 'w-auto',
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
    },
  ];
}
