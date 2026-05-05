import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

function statusTag(isSuspended?: boolean) {
  return h(Tag, { color: isSuspended ? 'red' : 'green' }, () =>
    isSuspended ? '挂起' : '启用',
  );
}

export const tabOptions = [
  { key: 'need', label: '待办任务' },
  { key: 'launch', label: '发起任务' },
  { key: 'already', label: '参与任务' },
];

export const quickNavItems = [
  {
    color: '#1fdaca',
    title: '请假',
    url: '/work/leave/undefined',
  },
  {
    color: '#3fb27f',
    title: '待办流程',
    url: '/oa/need',
  },
  {
    color: '#1677ff',
    title: '历史流程',
    url: '/oa/historic',
  },
  {
    color: '#e18525',
    title: '流程仓库',
    url: '/oa/repository',
  },
];

export function getColumns(type: string): VxeTableGridOptions['columns'] {
  if (type === 'need') {
    return [
      { field: 'instanceName', minWidth: 180, title: '流程名称' },
      { field: 'taskName', minWidth: 160, title: '任务名称' },
      {
        field: 'departmentName',
        minWidth: 140,
        slots: {
          default: ({ row }) => row.instanceComment?.departmentName ?? '-',
        },
        title: '发起部门',
      },
      {
        field: 'userName',
        minWidth: 140,
        slots: {
          default: ({ row }) => row.instanceComment?.userName ?? '-',
        },
        title: '发起用户',
      },
      {
        field: 'isSuspended',
        minWidth: 100,
        slots: { default: ({ row }) => statusTag(row.isSuspended) },
        title: '状态',
      },
      { field: 'createTime', minWidth: 170, title: '创建时间' },
      { field: 'dueDate', minWidth: 170, title: '截至时间' },
    ];
  }

  if (type === 'launch') {
    return [
      { field: 'processDefinitionName', minWidth: 180, title: '流程定义名称' },
      { field: 'instanceName', minWidth: 180, title: '流程名称' },
      { field: 'taskName', minWidth: 160, title: '当前节点名称' },
      {
        field: 'statusName',
        minWidth: 120,
        slots: {
          default: ({ row }) => row.processVariables?.statusName ?? '-',
        },
        title: '审核状态',
      },
      {
        field: 'isSuspended',
        minWidth: 100,
        slots: { default: ({ row }) => statusTag(row.isSuspended) },
        title: '状态',
      },
      { field: 'startTime', minWidth: 170, title: '开始时间' },
      { field: 'endTime', minWidth: 170, title: '结束时间' },
    ];
  }

  return [
    { field: 'processDefinitionName', minWidth: 180, title: '流程定义名称' },
    { field: 'instanceName', minWidth: 180, title: '流程名称' },
    { field: 'taskName', minWidth: 160, title: '参与节点名称' },
    {
      field: 'statusName',
      minWidth: 120,
      slots: {
        default: ({ row }) => row.processVariables?.statusName ?? '-',
      },
      title: '流程状态',
    },
    { field: 'startTime', minWidth: 170, title: '开始时间' },
    { field: 'endTime', minWidth: 170, title: '结束时间' },
  ];
}
