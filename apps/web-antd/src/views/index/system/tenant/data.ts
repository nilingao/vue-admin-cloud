import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { TenantModel } from '#/api/sys/tenant';

import { markRaw } from 'vue';

import { useAccess } from '@vben/access';

import { Cascader } from 'ant-design-vue';

import { z } from '#/adapter/form';
import { upload_file } from '#/api/sys/upload';
import { useSystemStore } from '#/store';

const { hasAccessByCodes } = useAccess();
const systemStore = useSystemStore();
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'tenantName',
      label: '租户名',
    },
    { component: 'Input', fieldName: 'tenantUserName', label: '联系人名称' },
  ];
}

export function useColumns<T = TenantModel>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 80,
    },
    {
      field: 'id',
      title: '租户编号',
      width: 200,
    },
    {
      field: 'tenantName',
      showOverflow: true,
      title: '租户名',
      minWidth: 200,
    },
    {
      field: 'tenantUserName',
      minWidth: 200,
      title: '联系人',
    },
    {
      field: 'status',
      title: '状态',
      width: 200,
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
    },
    {
      field: 'accountCount',
      title: '账号数量',
      width: 200,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '租户',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit', // 默认编辑按钮
            show: () => {
              return hasAccessByCodes(['system.tenant:update']);
            },
          },
          {
            code: 'delete', // 默认的删除按钮
            show: () => {
              return hasAccessByCodes(['system.tenant:delete']);
            },
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 130,
    },
  ];
}

export function useFormSchema(
  headerImageChange: (file: File) => Promise<void>,
): VbenFormSchema[] {
  return [
    {
      component: 'Divider',
      fieldName: 'id',
      formItemClass: 'col-span-1 lg:col-span-2 pb-0',
      hideLabel: true,
      componentProps: {
        orientation: 'left',
      },
      renderComponentContent() {
        return {
          default: () => '租户设置',
        };
      },
    },
    {
      component: 'Input',
      fieldName: 'tenantName',
      label: '租户名称',
      rules: 'required',
      componentProps: {
        placeholder: '请输入租户名称',
        min: 0,
        max: 1000,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'accountCount',
      label: '账号数量',
      defaultValue: 0,
      controlClass: 'w-full',
      componentProps: {
        placeholder: '请输入账号数量',
        min: 0,
        max: 1000,
      },
    },
    {
      component: 'RadioGroup',
      controlClass: 'w-full',
      defaultValue: 1,
      fieldName: 'status',
      label: '状态',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
        optionType: 'button',
      },
    },
    {
      component: 'Divider',
      fieldName: 'divider2',
      formItemClass: 'col-span-1 lg:col-span-2 pb-0',
      hideLabel: true,
      componentProps: {
        orientation: 'left',
      },
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !id;
        },
      },
      renderComponentContent() {
        return {
          default: () => '用户设置',
        };
      },
    },
    {
      component: 'Upload',
      formItemClass: 'col-span-1 lg:col-span-2',
      fieldName: 'imageUrl',
      label: '图像',
      renderComponentContent: () => {
        return {
          default: () => '点击上传图片',
        };
      },
      rules: 'required',
      componentProps: {
        // 更多属性见：https://ant.design/components/upload-cn
        accept: '.png,.jpg,.jpeg',
        // 自动携带认证信息
        customRequest: ({ file, onError, onProgress, onSuccess }: any) =>
          upload_file({
            type: 1,
            file,
            onError,
            onProgress,
            onSuccess,
          }),
        disabled: false,
        maxCount: 1,
        multiple: false,
        showUploadList: true,
        // 上传列表的内建样式，支持四种基本样式 text, picture, picture-card 和 picture-circle
        listType: 'picture-card',
        onChange: headerImageChange,
      },
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !id;
        },
      },
    },
    {
      component: 'Input',
      fieldName: 'loginAccount',
      label: '账户',
      rules: 'required',
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !id;
        },
      },
      componentProps: {
        placeholder: '请输入账户',
      },
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: '密码',
      rules: 'required',
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !id;
        },
      },
      componentProps: {
        placeholder: '请输入密码',
      },
    },
    {
      component: 'Input',
      fieldName: 'userName',
      label: '用户名',
      rules: 'required',
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !id;
        },
      },
      componentProps: {
        placeholder: '请输入用户名',
      },
    },
    {
      component: 'Input',
      fieldName: 'nickName',
      label: '昵称',
      rules: 'required',
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !id;
        },
      },
      componentProps: {
        placeholder: '请输入昵称',
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'gender',
      label: '性别',
      rules: 'required',
      defaultValue: 1,
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !id;
        },
      },
      componentProps: {
        placeholder: '请选择性别',
        options: [
          {
            label: '男',
            value: 1,
          },
          {
            label: '女',
            value: 2,
          },
          {
            label: '隐藏',
            value: 0,
          },
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '手机号',
      componentProps: {
        placeholder: '请输入手机号',
      },
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !id;
        },
      },
      rules: z
        .string()
        .refine((v) => v !== '', {
          message: '输入手机号码',
        })
        .refine((v) => v?.match(/^1[3-9]\d{9}$/), {
          message: '号码格式不正确',
        }),
    },
    {
      component: 'Input',
      fieldName: 'idCard',
      label: '身份证',
      componentProps: {
        placeholder: '请输入身份证号码',
      },
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !id;
        },
      },
      rules: z
        .string()
        .refine((v) => v !== '', {
          message: '输入身份证号码',
        })
        .refine(
          (v) =>
            v?.match(
              /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/i,
            ),
          {
            message: '号码格式不正确',
          },
        ),
    },
    {
      component: markRaw(Cascader),
      fieldName: 'areaList',
      label: '地址',
      rules: 'required',
      controlClass: 'w-full',
      modelPropName: 'value',
      componentProps: {
        placeholder: '请选择地址',
        options: systemStore.getAreaList,
        showSearch: true,
      },
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !id;
        },
      },
    },
    {
      component: 'Switch',
      fieldName: 'isAdmin',
      label: '系统管理员',
      defaultValue: 1,
      componentProps: {
        class: 'w-auto',
        checkedValue: 1,
        unCheckedValue: 0,
      },
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !id;
        },
      },
    },
    {
      component: 'Switch',
      fieldName: 'isEnabled',
      label: '启用状态',
      componentProps: {
        class: 'w-auto',
        checkedValue: 1,
        unCheckedValue: 0,
      },
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !id;
        },
      },
    },
    {
      component: 'Textarea',
      fieldName: 'memo',
      formItemClass: 'col-span-1 lg:col-span-2 items-baseline',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
      },
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !id;
        },
      },
    },
    {
      component: 'Divider',
      fieldName: 'divider3',
      formItemClass: 'col-span-1 lg:col-span-2 pb-0',
      hideLabel: true,
      componentProps: {
        orientation: 'left',
      },
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !!id;
        },
      },
      renderComponentContent() {
        return {
          default: () => '权限分配',
        };
      },
    },
    {
      component: 'Input',
      fieldName: 'privilegeList',
      formItemClass: 'col-span-1 lg:col-span-2',
      label: '权限',
      modelPropName: 'modelValue',
      componentProps: {
        placeholder: '请输入备注',
      },
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => {
          return !!id;
        },
      },
    },
  ];
}
