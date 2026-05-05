import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PublicNoticeEntity } from '#/api/notice/publicNotice';

import { h } from 'vue';

import { useAccess } from '@vben/access';

import { Tag } from 'ant-design-vue';

const { hasAccessByCodes } = useAccess();

const noticeTypeOptions = [
  { color: 'blue', label: '系统公告', value: 1 },
  { color: 'default', label: '未知类型', value: 0 },
];

const noticeStatusOptions = [
  { color: 'green', label: '正常', value: 1 },
  { color: 'red', label: '已过期', value: 2 },
];

// 定义选项类型
interface OptionItem {
  color: string;
  label: string;
  value: number;
}

function getNoticeTypeOption(type?: number | string): OptionItem {
  const typeValue = Number(type ?? 0);
  // 使用非空断言操作符 ! 告诉 TS find 的结果在结合 ?? 后一定是 OptionItem
  // 或者更严谨地，直接断言整个返回值
  return (
    noticeTypeOptions.find((item) => item.value === typeValue) ??
    noticeTypeOptions[1]
  ) as OptionItem; // 添加类型断言
}

function getNoticeStatusOption(status?: number | string): OptionItem {
  const statusValue = Number(status ?? 1);
  return (
    noticeStatusOptions.find((item) => item.value === statusValue) ??
    noticeStatusOptions[1]
  ) as OptionItem; // 添加类型断言
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      fieldName: 'noticeType',
      label: '通知类型',
      componentProps: {
        allowClear: true,
        options: noticeTypeOptions
          .filter((item) => item.value !== 0)
          .map(({ label, value }) => ({ label, value })),
        placeholder: '请选择通知类型',
      },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        allowClear: true,
        options: noticeStatusOptions.map(({ label, value }) => ({
          label,
          value,
        })),
        placeholder: '请选择状态',
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'beginTime',
      label: '开始时间',
      componentProps: {
        class: 'w-full',
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'endTime',
      label: '结束时间',
      componentProps: {
        class: 'w-full',
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      component: 'Input',
      fieldName: 'title',
      label: '标题',
      componentProps: {
        placeholder: '请输入标题',
      },
    },
  ];
}

export function useColumns<T = PublicNoticeEntity>(
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
      field: 'title',
      fixed: 'left',
      minWidth: 220,
      showOverflow: true,
      title: '标题',
    },
    {
      field: 'noticeType',
      minWidth: 120,
      slots: {
        default: ({ row }) => {
          const option = getNoticeTypeOption(row.noticeType);
          // 由于函数已声明返回 OptionItem，此处 option 必然存在
          return h(Tag, { color: option.color }, () => option.label);
        },
      },
      title: '通知类型',
    },
    {
      field: 'beginTime',
      minWidth: 180,
      title: '公告开始时间',
    },
    {
      field: 'endTime',
      minWidth: 180,
      title: '公告结束时间',
    },
    {
      field: 'status',
      minWidth: 120,
      slots: {
        default: ({ row }) => {
          const option = getNoticeStatusOption(row.status);
          // 由于函数已声明返回 OptionItem，此处 option 必然存在
          return h(Tag, { color: option.color }, () => option.label);
        },
      },
      title: '状态',
    },
    {
      field: 'createTime',
      minWidth: 180,
      sortable: true,
      title: '创建时间',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: '公告',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: () => hasAccessByCodes(['system.notice:update']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['system.notice:delete']),
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

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      defaultValue: 1,
      fieldName: 'noticeType',
      label: '通知类型',
      rules: 'required',
      componentProps: {
        options: noticeTypeOptions
          .filter((item) => item.value !== 0)
          .map(({ label, value }) => ({ label, value })),
        placeholder: '请选择通知类型',
      },
    },
    {
      component: 'Input',
      fieldName: 'title',
      label: '标题',
      rules: 'required',
      componentProps: {
        maxlength: 100,
        placeholder: '请输入标题',
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'beginTime',
      label: '公告开始时间',
      rules: 'required',
      componentProps: {
        class: 'w-full',
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'endTime',
      label: '公告结束时间',
      rules: 'required',
      componentProps: {
        class: 'w-full',
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      component: 'Textarea',
      fieldName: 'content',
      formItemClass: 'col-span-1 lg:col-span-2',
      label: '内容',
      rules: 'required',
      componentProps: {
        autoSize: { minRows: 8, maxRows: 16 },
        maxlength: 4000,
        placeholder: '请输入公告内容',
        showCount: true,
      },
    },
  ];
}
