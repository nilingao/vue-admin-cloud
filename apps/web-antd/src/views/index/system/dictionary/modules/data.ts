import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DictionaryItemEntity } from '#/api/sys/dictionary';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '字典条目名称',
      componentProps: {
        placeholder: '请输入字典条目名称',
      },
    },
  ];
}

export function useColumns<T = DictionaryItemEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      fixed: 'left',
      title: '条目编号',
      width: 120,
    },
    {
      field: 'sort',
      title: '排序',
      width: 100,
    },
    {
      field: 'name',
      minWidth: 200,
      showOverflow: true,
      title: '字典条目名称',
    },
    {
      field: 'value',
      minWidth: 200,
      showOverflow: true,
      title: '字典条目值',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '字典条目',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: () => hasAccessByCodes(['system.dictionary:update_item']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['system.dictionary:delete_item']),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 140,
    },
  ];
}

export function useItemFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'typeId',
      label: '字典类型编号',
      dependencies: {
        show: false,
        triggerFields: ['typeId'],
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '字典条目名称',
      rules: 'required',
      componentProps: {
        placeholder: '请输入字典条目名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'value',
      label: '字典条目值',
      rules: 'required',
      componentProps: {
        placeholder: '请输入字典条目值',
      },
    },
    {
      component: 'InputNumber',
      controlClass: 'w-full',
      fieldName: 'sort',
      label: '排序',
      rules: 'required',
      componentProps: {
        min: 0,
        precision: 0,
      },
    },
  ];
}

export function useTypeFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'code',
      label: '字典类型编码',
      componentProps: {
        placeholder: '请输入字典类型编码',
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '字典类型名称',
      rules: 'required',
      componentProps: {
        placeholder: '请输入字典类型名称',
      },
    },
    {
      component: 'Switch',
      defaultValue: 1,
      fieldName: 'status',
      label: '是否开启',
      componentProps: {
        checkedValue: 1,
        class: 'w-auto',
        unCheckedValue: 0,
      },
    },
  ];
}
