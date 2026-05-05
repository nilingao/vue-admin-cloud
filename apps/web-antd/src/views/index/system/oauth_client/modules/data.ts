import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { OauthClientEntity } from '#/api/sys/oauthClient';

import { h } from 'vue';

import { useAccess } from '@vben/access';

import { Tag } from 'ant-design-vue';

const { hasAccessByCodes } = useAccess();

export const authorizedGrantTypeOptions = [
  { color: 'blue', label: '授权码', value: 'authorization_code' },
  { color: 'green', label: '密码模式', value: 'password' },
  { color: 'cyan', label: '客户端模式', value: 'client_credentials' },
  { color: 'purple', label: '刷新令牌', value: 'refresh_token' },
  { color: 'orange', label: '短信验证码', value: 'sms' },
  { color: 'geekblue', label: '验证码', value: 'captcha' },
];

function getAuthorizedGrantTypeOption(value: string) {
  return (
    authorizedGrantTypeOptions.find((item) => item.value === value) ?? {
      color: 'default',
      label: value,
      value,
    }
  );
}

export function splitAuthorizedGrantTypes(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'clientId',
      label: '客户端 ID',
      componentProps: {
        placeholder: '请输入客户端 ID',
      },
    },
  ];
}

export function useColumns<T = OauthClientEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'clientId',
      fixed: 'left',
      minWidth: 160,
      showOverflow: true,
      title: '客户端 ID',
    },
    {
      field: 'resourceIds',
      minWidth: 160,
      showOverflow: true,
      title: '资源 ID 列表',
    },
    {
      field: 'clientSecret',
      minWidth: 180,
      showOverflow: true,
      title: '客户端密钥',
    },
    {
      field: 'scope',
      minWidth: 140,
      showOverflow: true,
      title: '授权范围',
    },
    {
      field: 'authorizedGrantTypes',
      minWidth: 280,
      slots: {
        default: ({ row }) => {
          const grantTypes = splitAuthorizedGrantTypes(
            row.authorizedGrantTypes,
          );
          if (grantTypes.length === 0) return '-';
          return grantTypes.map((item) => {
            const option = getAuthorizedGrantTypeOption(item);
            return h(
              Tag,
              {
                color: option.color,
                key: item,
              },
              () => option.label,
            );
          });
        },
      },
      title: '授权方式',
    },
    {
      field: 'webServerRedirectUri',
      minWidth: 220,
      showOverflow: true,
      title: '回调地址',
    },
    {
      field: 'authorities',
      minWidth: 180,
      showOverflow: true,
      title: '权限列表',
    },
    {
      field: 'accessTokenValidity',
      minWidth: 160,
      title: '认证令牌时效(秒)',
    },
    {
      field: 'refreshTokenValidity',
      minWidth: 160,
      title: '刷新令牌时效(秒)',
    },
    {
      field: 'additionalInformation',
      minWidth: 180,
      showOverflow: true,
      title: '扩展信息',
    },
    {
      field: 'autoapprove',
      minWidth: 140,
      slots: {
        default: ({ row }) => {
          const enabled = row.autoapprove === 'true';
          return h(Tag, { color: enabled ? 'green' : 'red' }, () =>
            enabled ? '是' : '否',
          );
        },
      },
      title: '自动放行',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'clientId',
          nameTitle: '客户端',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: () => hasAccessByCodes(['system.oauth_client:update']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['system.oauth_client:delete']),
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

export function useFormSchema(isUpdate: () => boolean): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'clientId',
      label: '客户端编号',
      rules: 'required',
      componentProps: {
        disabled: isUpdate(),
        placeholder: '请输入客户端编号',
      },
      dependencies: {
        triggerFields: ['clientId'],
        componentProps: () => ({
          disabled: isUpdate(),
        }),
      },
    },
    {
      component: 'Input',
      fieldName: 'resourceIds',
      label: '资源编号列表',
      componentProps: {
        placeholder: '多个资源编号用逗号分隔',
      },
    },
    {
      component: 'InputPassword',
      fieldName: 'clientSecret',
      label: '客户端密钥',
      rules: 'required',
      componentProps: {
        placeholder: '请输入客户端密钥',
      },
    },
    {
      component: 'Input',
      fieldName: 'scope',
      label: '授权范围',
      componentProps: {
        placeholder: '多个授权范围用逗号分隔',
      },
    },
    {
      component: 'Select',
      fieldName: 'authorizedGrantTypes',
      label: '授权方式',
      rules: 'required',
      componentProps: {
        mode: 'multiple',
        optionFilterProp: 'label',
        options: authorizedGrantTypeOptions.map(({ label, value }) => ({
          label,
          value,
        })),
        placeholder: '请选择授权方式',
      },
    },
    {
      component: 'Input',
      fieldName: 'webServerRedirectUri',
      formItemClass: 'col-span-1 lg:col-span-2',
      label: '回调地址',
      componentProps: {
        placeholder: '请输入回调地址',
      },
    },
    {
      component: 'Input',
      fieldName: 'authorities',
      label: '权限列表',
      componentProps: {
        placeholder: '多个权限用逗号分隔',
      },
    },
    {
      component: 'InputNumber',
      controlClass: 'w-full',
      fieldName: 'accessTokenValidity',
      label: '认证令牌时效(秒)',
      rules: 'required',
      componentProps: {
        min: 0,
        precision: 0,
      },
    },
    {
      component: 'InputNumber',
      controlClass: 'w-full',
      fieldName: 'refreshTokenValidity',
      label: '刷新令牌时效(秒)',
      rules: 'required',
      componentProps: {
        min: 0,
        precision: 0,
      },
    },
    {
      component: 'Textarea',
      fieldName: 'additionalInformation',
      formItemClass: 'col-span-1 lg:col-span-2',
      label: '扩展信息',
      componentProps: {
        autoSize: { minRows: 3, maxRows: 8 },
        placeholder: '请输入扩展信息',
      },
    },
    {
      component: 'Switch',
      defaultValue: false,
      fieldName: 'autoapprove',
      label: '是否自动放行',
      rules: 'required',
      componentProps: {
        checkedValue: true,
        class: 'w-auto',
        unCheckedValue: false,
      },
    },
  ];
}
