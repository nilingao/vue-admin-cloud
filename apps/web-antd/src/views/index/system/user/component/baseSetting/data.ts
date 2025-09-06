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
        return {
          default: () => '基本信息',
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
      fieldName: 'gender',
      label: '性别',
      rules: 'required',
      defaultValue: 1,
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
