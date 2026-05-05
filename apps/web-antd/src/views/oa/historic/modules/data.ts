import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ActivitiUserAlreadyEntity } from '#/api/oa/activiti';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

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

export function useColumns<T = ActivitiUserAlreadyEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'processDefinitionName',
      fixed: 'left',
      minWidth: 180,
      showOverflow: true,
      title: '流程定义名称',
    },
    {
      field: 'instanceName',
      minWidth: 180,
      showOverflow: true,
      title: '任务名称',
    },
    {
      field: 'startTime',
      minWidth: 180,
      title: '开始时间',
    },
    {
      field: 'endTime',
      minWidth: 180,
      title: '结束时间',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'instanceName',
          nameTitle: '历史流程',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'detail',
            text: '详情',
            show: () => hasAccessByCodes(['oa.historic:detail']),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 100,
    },
  ];
}
