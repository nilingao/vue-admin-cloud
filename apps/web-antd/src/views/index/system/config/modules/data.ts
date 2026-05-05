import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ConfigEntity } from '#/api/sys/config';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'configName',
      label: '系统配置名称',
      componentProps: {
        placeholder: '请输入系统配置名称',
      },
    },
  ];
}

export function useColumns<T = ConfigEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'k',
      fixed: 'left',
      minWidth: 180,
      showOverflow: true,
      title: '配置键',
    },
    {
      field: 'v',
      minWidth: 260,
      showOverflow: true,
      title: '配置值',
    },
    {
      field: 'configName',
      minWidth: 200,
      showOverflow: true,
      title: '配置名称',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'configName',
          nameTitle: '系统配置',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: () => hasAccessByCodes(['system.config:update']),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 120,
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'k',
      label: '配置键',
      rules: 'required',
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'v',
      label: '配置值',
      rules: 'required',
      componentProps: {
        placeholder: '请输入配置值',
      },
    },
    {
      component: 'Input',
      fieldName: 'configName',
      label: '配置名称',
      rules: 'required',
      componentProps: {
        placeholder: '请输入配置名称',
      },
    },
  ];
}
