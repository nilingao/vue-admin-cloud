import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MobileMessageEntity } from '#/api/sys/mobileMessage';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

const smsTypeOptions = [
  { color: 'blue', label: '登录验证码', value: 1 },
  { color: 'green', label: '注册验证码', value: 2 },
  { color: 'orange', label: '重置密码验证码', value: 3 },
];

const statusOptions = [
  { color: 'default', label: '未发', value: 1 },
  { color: 'green', label: '成功', value: 2 },
  { color: 'red', label: '失败', value: 3 },
];

interface OptionItem {
  color: string;
  label: string;
  value: number;
}

function getSmsTypeOption(type?: number | string): OptionItem {
  const value = Number(type ?? 0);
  return (
    smsTypeOptions.find((item) => item.value === value) ?? {
      color: 'default',
      label: `未知类型(${type ?? '-'})`,
      value,
    }
  );
}

function getStatusOption(status?: number | string): OptionItem {
  const value = Number(status ?? 0);
  return (
    statusOptions.find((item) => item.value === value) ?? {
      color: 'default',
      label: `未知状态(${status ?? '-'})`,
      value,
    }
  );
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'mobile',
      label: '手机号',
      componentProps: {
        placeholder: '请输入手机号',
      },
    },
  ];
}

export function useColumns(): VxeTableGridOptions<MobileMessageEntity>['columns'] {
  return [
    {
      field: 'id',
      fixed: 'left',
      title: '编号',
      width: 120,
    },
    {
      field: 'type',
      minWidth: 140,
      slots: {
        default: ({ row }) => {
          const option = getSmsTypeOption(row.type);
          return h(Tag, { color: option.color }, () => option.label);
        },
      },
      title: '类型',
    },
    {
      field: 'mobile',
      minWidth: 160,
      showOverflow: true,
      title: '手机号',
    },
    {
      field: 'status',
      minWidth: 120,
      slots: {
        default: ({ row }) => {
          const option = getStatusOption(row.status);
          return h(Tag, { color: option.color }, () => option.label);
        },
      },
      title: '状态',
    },
    {
      field: 'handleTime',
      minWidth: 180,
      title: '操作时间',
    },
    {
      field: 'createTime',
      minWidth: 180,
      sortable: true,
      title: '创建时间',
    },
    {
      field: 'content',
      minWidth: 420,
      showOverflow: true,
      title: '内容',
    },
  ];
}
