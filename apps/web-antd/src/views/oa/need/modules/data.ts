import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ActivitiUserNeedEntity } from '#/api/oa/activiti';

import { h } from 'vue';

import { useAccess } from '@vben/access';

import { Tag } from 'ant-design-vue';

const { hasAccessByCodes } = useAccess();

function getComment(row: ActivitiUserNeedEntity, key: string) {
  return row.tackComment?.[key] ?? '-';
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '任务名称',
      componentProps: {
        placeholder: '请输入任务名称',
      },
    },
  ];
}

export function useColumns<T = ActivitiUserNeedEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'processDefinitionName',
      fixed: 'left',
      minWidth: 160,
      showOverflow: true,
      title: '定义名称',
    },
    {
      field: 'instanceName',
      minWidth: 180,
      showOverflow: true,
      title: '实例名称',
    },
    {
      field: 'departmentName',
      minWidth: 140,
      slots: {
        default: ({ row }) => getComment(row, 'departmentName'),
      },
      title: '部门名称',
    },
    {
      field: 'userName',
      minWidth: 140,
      slots: {
        default: ({ row }) => getComment(row, 'userName'),
      },
      title: '审核人',
    },
    {
      field: 'taskName',
      minWidth: 160,
      showOverflow: true,
      title: '节点名称',
    },
    {
      field: 'isSuspended',
      minWidth: 120,
      slots: {
        default: ({ row }) =>
          h(Tag, { color: row.isSuspended ? 'red' : 'green' }, () =>
            row.isSuspended ? '挂起' : '启用',
          ),
      },
      title: '状态',
    },
    {
      field: 'createTime',
      minWidth: 180,
      title: '创建时间',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'instanceName',
          nameTitle: '待办流程',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'detail',
            text: '详情',
            show: () => hasAccessByCodes(['oa.need:detail']),
          },
          {
            code: 'sign_for',
            text: '签收',
            show: () => hasAccessByCodes(['oa.need:sign_for']),
          },
          {
            code: 'pending',
            text: (row: ActivitiUserNeedEntity) =>
              row.isSuspended ? '激活' : '挂起',
            show: () => hasAccessByCodes(['oa.need:pending']),
          },
          {
            code: 'reject',
            text: '驳回',
            show: () => hasAccessByCodes(['oa.need:reject']),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 220,
    },
  ];
}
