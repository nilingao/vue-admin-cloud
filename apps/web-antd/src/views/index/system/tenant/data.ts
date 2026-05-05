import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { TenantModel } from '#/api/sys/tenant';

import { h, markRaw } from 'vue';

import { useAccess } from '@vben/access';

import { Cascader, Tag } from 'ant-design-vue';

import { z } from '#/adapter/form';
import { upload_file } from '#/api/sys/upload';
import { useSystemStore } from '#/store';

const { hasAccessByCodes } = useAccess();
const systemStore = useSystemStore();

function isEnabled(status?: number | string) {
  return Number(status) === 1;
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'tenantName',
      label: '租户名称',
      componentProps: {
        placeholder: '请输入租户名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'tenantUserName',
      label: '联系人名称',
      componentProps: {
        placeholder: '请输入联系人名称',
      },
    },
  ];
}

export function useColumns<T = TenantModel>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 80,
    },
    {
      field: 'id',
      minWidth: 140,
      title: '租户编号',
    },
    {
      field: 'tenantName',
      minWidth: 200,
      showOverflow: true,
      title: '租户名称',
    },
    {
      field: 'tenantUserName',
      minWidth: 180,
      showOverflow: true,
      title: '联系人',
    },
    {
      field: 'status',
      minWidth: 120,
      slots: {
        default: ({ row }) =>
          h(Tag, { color: isEnabled(row.status) ? 'green' : 'red' }, () =>
            isEnabled(row.status) ? '启用' : '禁用',
          ),
      },
      title: '状态',
    },
    {
      field: 'accountCount',
      minWidth: 120,
      title: '账号数量',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'tenantName',
          nameTitle: '租户',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: () => hasAccessByCodes(['system.tenant:update']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['system.tenant:delete']),
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

export function useFormSchema(
  headerImageChange: ({ file }: { file: File }) => Promise<void>,
): VbenFormSchema[] {
  return [
    {
      component: 'Divider',
      fieldName: 'tenantDivider',
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
      },
    },
    {
      component: 'InputNumber',
      controlClass: 'w-full',
      defaultValue: 0,
      fieldName: 'accountCount',
      label: '账号数量',
      componentProps: {
        max: 1000,
        min: 0,
        placeholder: '请输入账号数量',
        precision: 0,
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
        optionType: 'button',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
    {
      component: 'Divider',
      fieldName: 'userDivider',
      formItemClass: 'col-span-1 lg:col-span-2 pb-0',
      hideLabel: true,
      componentProps: {
        orientation: 'left',
      },
      dependencies: {
        if: ({ id }) => !id,
        triggerFields: ['id'],
      },
      renderComponentContent() {
        return {
          default: () => '用户设置',
        };
      },
    },
    {
      component: 'Upload',
      componentProps: {
        accept: '.png,.jpg,.jpeg',
        customRequest: ({ file, onError, onProgress, onSuccess }: any) =>
          upload_file({
            file,
            onError,
            onProgress,
            onSuccess,
            type: 1,
          }),
        handleChange: headerImageChange,
        listType: 'picture-card',
        maxCount: 1,
        multiple: false,
        showUploadList: true,
      },
      dependencies: {
        if: ({ id }) => !id,
        triggerFields: ['id'],
      },
      fieldName: 'imageUrl',
      formItemClass: 'col-span-1 lg:col-span-2',
      label: '头像',
      renderComponentContent: () => ({ default: () => '点击上传图片' }),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'loginAccount',
      label: '账号',
      rules: 'required',
      dependencies: {
        if: ({ id }) => !id,
        triggerFields: ['id'],
      },
      componentProps: {
        placeholder: '请输入账号',
      },
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: '密码',
      rules: 'required',
      dependencies: {
        if: ({ id }) => !id,
        triggerFields: ['id'],
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
        if: ({ id }) => !id,
        triggerFields: ['id'],
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
        if: ({ id }) => !id,
        triggerFields: ['id'],
      },
      componentProps: {
        placeholder: '请输入昵称',
      },
    },
    {
      component: 'RadioGroup',
      defaultValue: 1,
      fieldName: 'gender',
      label: '性别',
      rules: 'required',
      dependencies: {
        if: ({ id }) => !id,
        triggerFields: ['id'],
      },
      componentProps: {
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 2 },
          { label: '保密', value: 0 },
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '手机号',
      dependencies: {
        if: ({ id }) => !id,
        triggerFields: ['id'],
      },
      componentProps: {
        placeholder: '请输入手机号',
      },
      rules: z
        .string()
        .refine((v) => v !== '', { message: '请输入手机号' })
        .refine((v) => /^1[3-9]\d{9}$/.test(v ?? ''), {
          message: '手机号格式不正确',
        }),
    },
    {
      component: 'Input',
      fieldName: 'idCard',
      label: '身份证号',
      dependencies: {
        if: ({ id }) => !id,
        triggerFields: ['id'],
      },
      componentProps: {
        placeholder: '请输入身份证号',
      },
      rules: z
        .string()
        .refine((v) => v !== '', { message: '请输入身份证号' })
        .refine(
          (v) =>
            /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/i.test(
              v ?? '',
            ),
          { message: '身份证号格式不正确' },
        ),
    },
    {
      component: markRaw(Cascader),
      fieldName: 'areaList',
      label: '地址',
      modelPropName: 'value',
      rules: 'required',
      controlClass: 'w-full',
      dependencies: {
        if: ({ id }) => !id,
        triggerFields: ['id'],
      },
      componentProps: {
        options: systemStore.getAreaList,
        placeholder: '请选择地址',
        showSearch: true,
      },
    },
    {
      component: 'Switch',
      defaultValue: 1,
      fieldName: 'isAdmin',
      label: '系统管理员',
      componentProps: {
        checkedValue: 1,
        class: 'w-auto',
        unCheckedValue: 0,
      },
      dependencies: {
        if: ({ id }) => !id,
        triggerFields: ['id'],
      },
    },
    {
      component: 'Switch',
      defaultValue: 1,
      fieldName: 'isEnabled',
      label: '启用状态',
      componentProps: {
        checkedValue: 1,
        class: 'w-auto',
        unCheckedValue: 0,
      },
      dependencies: {
        if: ({ id }) => !id,
        triggerFields: ['id'],
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
        if: ({ id }) => !id,
        triggerFields: ['id'],
      },
    },
    {
      component: 'Divider',
      fieldName: 'privilegeDivider',
      formItemClass: 'col-span-1 lg:col-span-2 pb-0',
      hideLabel: true,
      componentProps: {
        orientation: 'left',
      },
      dependencies: {
        if: ({ id }) => !!id,
        triggerFields: ['id'],
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
      hideLabel: true,
      modelPropName: 'checkedList',
      dependencies: {
        if: ({ id }) => !!id,
        triggerFields: ['id'],
      },
    },
  ];
}
