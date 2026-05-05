import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SmsConfigEntity } from '#/api/sys/smsConfig';

import { h } from 'vue';

import { useAccess } from '@vben/access';

import { Tag } from 'ant-design-vue';

const { hasAccessByCodes } = useAccess();

export const smsTypeOptions = [
  { color: 'blue', label: '阿里云短信', value: 1 },
  { color: 'green', label: '腾讯云短信', value: 2 },
  { color: 'orange', label: '华为云短信', value: 3 },
];

export const signPlaceOptions = [
  { label: '左边', value: 1 },
  { label: '右边', value: 2 },
];

function getSmsTypeOption(type?: number | string) {
  const value = Number(type ?? 0);
  return (
    smsTypeOptions.find((item) => item.value === value) ?? {
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
      fieldName: 'configName',
      label: '配置名称',
      componentProps: {
        placeholder: '请输入配置名称',
      },
    },
  ];
}

export function useColumns<T = SmsConfigEntity>(
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
      field: 'smsType',
      minWidth: 140,
      slots: {
        default: ({ row }) => {
          const option = getSmsTypeOption(row.smsType);
          return h(Tag, { color: option.color }, () => option.label);
        },
      },
      title: '类型',
    },
    {
      field: 'configName',
      minWidth: 180,
      showOverflow: true,
      title: '配置名称',
    },
    {
      field: 'account',
      minWidth: 180,
      showOverflow: true,
      title: '账号',
    },
    {
      field: 'isActive',
      minWidth: 120,
      slots: {
        default: ({ row }) =>
          h(Tag, { color: isEnabled(row.isActive) ? 'green' : 'red' }, () =>
            isEnabled(row.isActive) ? '是' : '否',
          ),
      },
      title: '是否启用',
    },
    {
      field: 'sign',
      minWidth: 160,
      showOverflow: true,
      title: '签名',
    },
    {
      field: 'updateTime',
      minWidth: 180,
      sortable: true,
      title: '修改时间',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'configName',
          nameTitle: '短信配置',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: () => hasAccessByCodes(['system.sms.sms_config:update']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['system.sms.sms_config:delete']),
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
      fieldName: 'configName',
      label: '配置名称',
      rules: 'required',
      componentProps: {
        placeholder: '请输入配置名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'account',
      label: '账号',
      rules: 'required',
      componentProps: {
        placeholder: '请输入账号',
      },
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: '密码',
      rules: 'required',
      componentProps: {
        placeholder: '请输入密码',
      },
    },
    {
      component: 'Select',
      fieldName: 'smsType',
      label: '类型',
      rules: 'required',
      componentProps: {
        optionFilterProp: 'label',
        options: smsTypeOptions.map(({ label, value }) => ({ label, value })),
        placeholder: '请选择类型',
      },
    },
    {
      component: 'InputNumber',
      controlClass: 'w-full',
      defaultValue: 0,
      fieldName: 'balance',
      label: '余额',
      componentProps: {
        min: 0,
        precision: 2,
      },
    },
    {
      component: 'Switch',
      defaultValue: 1,
      fieldName: 'isActive',
      label: '是否启用',
      componentProps: {
        checkedValue: 1,
        class: 'w-auto',
        unCheckedValue: 0,
      },
    },
    {
      component: 'RadioGroup',
      defaultValue: 1,
      fieldName: 'signPlace',
      label: '签名位置',
      componentProps: {
        buttonStyle: 'solid',
        optionType: 'button',
        options: signPlaceOptions,
      },
    },
    {
      component: 'Input',
      fieldName: 'sign',
      label: '签名',
      componentProps: {
        placeholder: '请输入短信签名',
      },
    },
  ];
}
