import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MobileMessageTemplateEntity } from '#/api/sys/mobileMessageTemplate';

import { h } from 'vue';

import { useAccess } from '@vben/access';

import { Tag } from 'ant-design-vue';

const { hasAccessByCodes } = useAccess();

export const templateTypeOptions = [
  { color: 'blue', label: '登录验证码', value: 1 },
  { color: 'green', label: '注册验证码', value: 2 },
  { color: 'orange', label: '重置密码验证码', value: 3 },
];

function getTemplateTypeOption(type?: number | string) {
  const value = Number(type ?? 0);
  return (
    templateTypeOptions.find((item) => item.value === value) ?? {
      color: 'default',
      label: `未知类型(${type ?? '-'})`,
      value,
    }
  );
}

function isEnabled(value?: number | string) {
  return Number(value) === 1;
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: '模板标题',
      componentProps: {
        placeholder: '请输入模板标题',
      },
    },
  ];
}

export function useColumns<T = MobileMessageTemplateEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { field: 'id', fixed: 'left', title: '编号', width: 120 },
    {
      field: 'title',
      minWidth: 180,
      showOverflow: true,
      title: '标题',
    },
    {
      field: 'code',
      minWidth: 160,
      showOverflow: true,
      title: '唯一编码',
    },
    {
      field: 'type',
      minWidth: 140,
      slots: {
        default: ({ row }) => {
          const option = getTemplateTypeOption(row.type);
          return h(Tag, { color: option.color }, () => option.label);
        },
      },
      title: '类型',
    },
    {
      field: 'isEnable',
      minWidth: 120,
      slots: {
        default: ({ row }) =>
          h(Tag, { color: isEnabled(row.isEnable) ? 'green' : 'red' }, () =>
            isEnabled(row.isEnable) ? '是' : '否',
          ),
      },
      title: '是否启用',
    },
    { field: 'num', minWidth: 100, title: '排序号' },
    {
      field: 'content',
      minWidth: 320,
      showOverflow: true,
      title: '内容',
    },
    {
      field: 'receiver',
      minWidth: 160,
      showOverflow: true,
      title: '接收人',
    },
    {
      field: 'variable',
      minWidth: 220,
      showOverflow: true,
      title: '变量',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: '短信模板',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: () =>
              hasAccessByCodes(['system.sms.mobile_message_template:update']),
          },
          {
            code: 'delete',
            show: () =>
              hasAccessByCodes(['system.sms.mobile_message_template:delete']),
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
      component: 'Input',
      fieldName: 'configId',
      label: '短信配置编号',
      dependencies: {
        show: false,
        triggerFields: ['configId'],
      },
    },
    {
      component: 'Input',
      fieldName: 'title',
      label: '标题',
      rules: 'required',
      componentProps: { placeholder: '请输入标题' },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '唯一编码',
      rules: 'required',
      componentProps: { placeholder: '请输入唯一编码' },
    },
    {
      component: 'Select',
      fieldName: 'type',
      label: '类型',
      rules: 'required',
      componentProps: {
        options: templateTypeOptions.map(({ label, value }) => ({
          label,
          value,
        })),
        placeholder: '请选择类型',
      },
    },
    {
      component: 'Switch',
      defaultValue: 1,
      fieldName: 'isEnable',
      label: '是否启用',
      componentProps: {
        checkedValue: 1,
        class: 'w-auto',
        unCheckedValue: 0,
      },
    },
    {
      component: 'InputNumber',
      controlClass: 'w-full',
      defaultValue: 0,
      fieldName: 'num',
      label: '排序号',
      componentProps: { min: 0, precision: 0 },
    },
    {
      component: 'Input',
      fieldName: 'receiver',
      label: '接收人',
      componentProps: { placeholder: '请输入接收人' },
    },
    {
      component: 'Textarea',
      fieldName: 'content',
      formItemClass: 'col-span-1 lg:col-span-2',
      label: '内容',
      rules: 'required',
      componentProps: {
        autoSize: { minRows: 4, maxRows: 10 },
        placeholder: '请输入内容',
      },
    },
    {
      component: 'Textarea',
      fieldName: 'variable',
      formItemClass: 'col-span-1 lg:col-span-2',
      label: '变量',
      rules: 'required',
      componentProps: {
        autoSize: { minRows: 3, maxRows: 8 },
        placeholder: '请输入变量',
      },
    },
  ];
}
