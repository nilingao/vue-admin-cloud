import type { VbenFormSchema } from '#/adapter/form';

import { markRaw } from 'vue';

import { Cascader } from 'ant-design-vue';

import { z } from '#/adapter/form';
import { upload_file } from '#/api/sys/upload';
import { useSystemStore } from '#/store';

const systemStore = useSystemStore();

export function useBaseSettingFormSchema(
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
        return { default: () => '基本信息' };
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
      componentProps: {
        placeholder: '请输入用户名',
      },
    },
    {
      component: 'Input',
      fieldName: 'nickName',
      label: '昵称',
      rules: 'required',
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
      componentProps: {
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 2 },
          { label: '保密', value: 0 },
        ],
        placeholder: '请选择性别',
      },
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '手机号',
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
      controlClass: 'w-full',
      fieldName: 'areaList',
      label: '地址',
      modelPropName: 'value',
      rules: 'required',
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
    },
    {
      component: 'Textarea',
      fieldName: 'memo',
      formItemClass: 'col-span-1 lg:col-span-2 items-baseline',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
}
