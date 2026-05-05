import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ActivitiRepositoryEntity } from '#/api/oa/activiti';

import { h } from 'vue';

import { useAccess } from '@vben/access';

import { Tag } from 'ant-design-vue';

const { hasAccessByCodes } = useAccess();

function isEnabled(value?: boolean | string) {
  return value === false || value === 'false';
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'deploymentName',
      label: '流程名称',
      componentProps: {
        placeholder: '请输入流程名称',
      },
    },
  ];
}

export function useColumns<T = ActivitiRepositoryEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'key',
      fixed: 'left',
      minWidth: 160,
      showOverflow: true,
      title: '实例 Key',
    },
    {
      field: 'deploymentName',
      minWidth: 220,
      showOverflow: true,
      title: '流程部署实例名称',
    },
    {
      field: 'version',
      minWidth: 120,
      title: '实例版本',
    },
    {
      field: 'isSuspended',
      minWidth: 120,
      slots: {
        default: ({ row }) =>
          h(Tag, { color: isEnabled(row.isSuspended) ? 'green' : 'red' }, () =>
            isEnabled(row.isSuspended) ? '启用' : '挂起',
          ),
      },
      title: '状态',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'deploymentName',
          nameTitle: '流程定义',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'deploy',
            text: '部署',
            show: () => hasAccessByCodes(['oa.repository:deploy']),
          },
          {
            code: 'pending',
            text: (row: ActivitiRepositoryEntity) =>
              isEnabled(row.isSuspended) ? '挂起' : '激活',
            show: () => hasAccessByCodes(['oa.repository:pending']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['oa.repository:delete']),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 190,
    },
  ];
}
