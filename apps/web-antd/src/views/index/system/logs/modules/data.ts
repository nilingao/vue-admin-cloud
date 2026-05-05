import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { LogsEntity } from '#/api/sys/logs';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

const logsTypeOptions = [
  { color: 'default', label: '其他', value: 0 },
  { color: 'green', label: '登录', value: 1 },
  { color: 'blue', label: '新增', value: 2 },
  { color: 'orange', label: '修改', value: 3 },
  { color: 'red', label: '删除', value: 4 },
];

function getLogsTypeOption(type?: number | string) {
  const typeValue = Number(type ?? 0);
  return (
    logsTypeOptions.find((item) => item.value === typeValue) ??
    logsTypeOptions[0]
  );
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      fieldName: 'type',
      label: '日志类型',
      componentProps: {
        allowClear: true,
        options: logsTypeOptions.map(({ label, value }) => ({ label, value })),
        placeholder: '请选择日志类型',
      },
    },
    {
      component: 'Input',
      fieldName: 'ip',
      label: '访问者 IP',
      componentProps: {
        placeholder: '请输入访问者 IP',
      },
    },
    {
      component: 'Input',
      fieldName: 'ipAttribution',
      label: '网络地址',
      componentProps: {
        placeholder: '请输入网络地址',
      },
    },
    {
      component: 'Input',
      fieldName: 'method',
      label: '请求方式',
      componentProps: {
        placeholder: '请输入请求方式',
      },
    },
    {
      component: 'Input',
      fieldName: 'api',
      label: '访问接口',
      componentProps: {
        placeholder: '请输入访问接口',
      },
    },
    {
      component: 'InputNumber',
      controlClass: 'w-full',
      fieldName: 'durationStart',
      label: '持续时间开始',
      componentProps: {
        min: 0,
        placeholder: '毫秒',
        precision: 0,
      },
    },
    {
      component: 'InputNumber',
      controlClass: 'w-full',
      fieldName: 'durationEnd',
      label: '持续时间结束',
      componentProps: {
        min: 0,
        placeholder: '毫秒',
        precision: 0,
      },
    },
  ];
}

export function useColumns<T = LogsEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      fixed: 'left',
      title: '编号',
      width: 120,
    },
    {
      cellRender: {
        name: 'CellRender',
      },
      field: 'type',
      minWidth: 120,
      slots: {
        default: ({ row }) => {
          const option = getLogsTypeOption(row.type);
          return h(Tag, { color: option.color }, () => option.label);
        },
      },
      title: '日志类型',
    },
    {
      field: 'ip',
      minWidth: 140,
      showOverflow: true,
      title: '访问者 IP',
    },
    {
      field: 'ipAttribution',
      minWidth: 160,
      showOverflow: true,
      title: '网络地址',
    },
    {
      field: 'method',
      minWidth: 120,
      title: '请求方式',
    },
    {
      field: 'api',
      minWidth: 240,
      showOverflow: true,
      title: '访问接口',
    },
    {
      field: 'duration',
      minWidth: 140,
      title: '持续时间(ms)',
    },
    {
      field: 'createTime',
      minWidth: 180,
      sortable: true,
      title: '访问时间',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'id',
          nameTitle: '日志',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'detail',
            text: '详情',
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

export function getLogsTypeName(type?: number | string) {
  return getLogsTypeOption(type).label;
}
