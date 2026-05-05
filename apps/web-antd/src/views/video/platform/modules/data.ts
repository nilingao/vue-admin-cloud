import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PlatformEntity } from '#/api/video/platform';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

export const transportOptions = [
  { label: 'UDP', value: 1 },
  { label: 'TCP', value: 2 },
];

export const charsetOptions = [
  { label: 'utf8', value: 1 },
  { label: 'GB2312', value: 2 },
];

export const treeTypeOptions = [
  { label: '业务分组', value: 215 },
  { label: '行政区划', value: 216 },
];

function getOptionLabel(
  options: Array<{ label: string; value: number }>,
  value?: number,
) {
  return String(
    options.find((item) => item.value === value)?.label ?? value ?? '',
  );
}

function numberSchema(
  fieldName: string,
  label: string,
  min: number,
  max: number,
  defaultValue: number,
): VbenFormSchema {
  return {
    component: 'InputNumber',
    controlClass: 'w-full',
    defaultValue,
    fieldName,
    label,
    rules: 'required',
    componentProps: {
      max,
      min,
      placeholder: `请输入${label}`,
      precision: 0,
    },
  };
}

function switchSchema(
  fieldName: string,
  label: string,
  defaultValue: number,
): VbenFormSchema {
  return {
    component: 'Switch',
    defaultValue,
    fieldName,
    label,
    componentProps: {
      checkedValue: 1,
      class: 'w-auto',
      unCheckedValue: 0,
    },
  };
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'query',
      label: 'IP 地址',
      componentProps: {
        placeholder: '请输入 IP 地址',
      },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        allowClear: true,
        options: [
          { label: '在线', value: '1' },
          { label: '离线', value: '0' },
        ],
        placeholder: '请选择状态',
      },
    },
  ];
}

export function useColumns<T = PlatformEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'serverGbId',
      fixed: 'left',
      minWidth: 180,
      showOverflow: true,
      title: 'SIP 国标编码',
    },
    {
      field: 'name',
      minWidth: 160,
      showOverflow: true,
      title: '名称',
    },
    {
      field: 'serverIp',
      minWidth: 150,
      showOverflow: true,
      title: 'SIP 服务 IP',
    },
    {
      field: 'serverPort',
      minWidth: 130,
      title: 'SIP 服务端口',
    },
    {
      field: 'deviceGbId',
      minWidth: 180,
      showOverflow: true,
      title: '设备国标编号',
    },
    {
      field: 'deviceIp',
      minWidth: 150,
      showOverflow: true,
      title: '设备 IP',
    },
    {
      field: 'devicePort',
      minWidth: 120,
      title: '设备端口',
    },
    {
      field: 'username',
      minWidth: 170,
      showOverflow: true,
      title: 'SIP 认证账号',
    },
    {
      field: 'expires',
      minWidth: 140,
      title: '注册周期(秒)',
    },
    {
      field: 'keepTimeout',
      minWidth: 140,
      title: '心跳周期(秒)',
    },
    {
      cellRender: {
        name: 'CellTag',
      },
      field: 'enable',
      minWidth: 100,
      title: '启用',
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'success', label: '在线', value: 1 },
          { color: 'error', label: '离线', value: 0 },
        ],
      },
      field: 'status',
      minWidth: 100,
      title: '状态',
    },
    {
      field: 'transport',
      minWidth: 120,
      slots: {
        default: ({ row }) => getOptionLabel(transportOptions, row.transport),
      },
      title: '传输协议',
    },
    {
      field: 'characterSet',
      minWidth: 120,
      slots: {
        default: ({ row }) => getOptionLabel(charsetOptions, row.characterSet),
      },
      title: '字符集',
    },
    {
      field: 'treeType',
      minWidth: 120,
      slots: {
        default: ({ row }) => getOptionLabel(treeTypeOptions, row.treeType),
      },
      title: '树类型',
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'success', label: '允许', value: 1 },
          { color: 'error', label: '拒绝', value: 0 },
        ],
      },
      field: 'ptz',
      minWidth: 120,
      title: '云台控制',
    },
    {
      cellRender: {
        name: 'CellTag',
      },
      field: 'rtcp',
      minWidth: 120,
      title: 'RTCP 保活',
    },
    {
      cellRender: {
        name: 'CellTag',
      },
      field: 'startOfflinePush',
      minWidth: 120,
      title: '主动拉流',
    },
    {
      cellRender: {
        name: 'CellTag',
      },
      field: 'asMessageChannel',
      minWidth: 120,
      title: '消息通道',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '国标级联',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'join',
            show: () => hasAccessByCodes(['video.platform:join']),
            text: '关联国标',
          },
          {
            code: 'edit',
            show: () => hasAccessByCodes(['video.platform:update']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['video.platform:delete']),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 220,
    },
  ];
}

export function useFormSchema(
  sipOptions: Array<{ label: string; value: string }>,
  onServerGbIdChange: (value: string) => void,
  onDeviceGbIdSelect: (value: string) => void,
): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      label: '编号',
      dependencies: {
        show: false,
        triggerFields: ['id'],
      },
    },
    {
      component: 'Input',
      fieldName: 'serverGbId',
      label: 'SIP 国标编码',
      rules: 'required',
      componentProps: {
        onChange(event: Event) {
          onServerGbIdChange((event.target as HTMLInputElement).value);
        },
        placeholder: '请输入 SIP 国标编码',
      },
    },
    {
      component: 'Input',
      fieldName: 'serverGbDomain',
      label: 'SIP 国标域',
      rules: 'required',
      componentProps: {
        placeholder: '请输入 SIP 国标域',
      },
    },
    {
      component: 'Input',
      fieldName: 'serverIp',
      label: 'SIP 服务 IP',
      rules: 'required',
      componentProps: {
        placeholder: '请输入 SIP 服务 IP',
      },
    },
    numberSchema('serverPort', 'SIP 服务端口', 0, 65_535, 0),
    {
      component: 'Input',
      fieldName: 'username',
      label: 'SIP 认证账号',
      componentProps: {
        placeholder: '默认 SIP 国标编码',
      },
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: 'SIP 认证密码',
      rules: 'required',
      componentProps: {
        placeholder: '请输入 SIP 认证密码',
      },
    },
    {
      component: 'Input',
      fieldName: 'catalogId',
      label: '目录编号',
      componentProps: {
        placeholder: '默认 SIP 国标编码',
      },
    },
    {
      component: 'Select',
      defaultValue: 1,
      fieldName: 'catalogGroup',
      label: '目录分组',
      rules: 'selectRequired',
      componentProps: {
        options: [1, 2, 4, 8].map((value) => ({ label: String(value), value })),
        placeholder: '请选择目录分组',
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '服务名称',
      rules: 'required',
      componentProps: {
        placeholder: '请输入服务名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'administrativeDivision',
      label: '行政区划',
      componentProps: {
        placeholder: '请输入行政区划',
      },
    },
    {
      component: 'Select',
      fieldName: 'deviceGbId',
      label: '设备国标编号',
      rules: 'selectRequired',
      componentProps: {
        options: sipOptions,
        placeholder: '请选择设备国标编号',
        onSelect: onDeviceGbIdSelect,
      },
    },
    numberSchema('expires', '注册周期(秒)', 30, 68_400, 3600),
    {
      component: 'Input',
      fieldName: 'deviceIp',
      label: '设备 IP',
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'InputNumber',
      controlClass: 'w-full',
      defaultValue: 0,
      fieldName: 'devicePort',
      label: '设备端口',
      componentProps: {
        disabled: true,
      },
    },
    numberSchema('keepTimeout', '心跳周期(秒)', 30, 600, 30),
    {
      component: 'Select',
      defaultValue: 215,
      fieldName: 'treeType',
      label: '树类型',
      rules: 'selectRequired',
      componentProps: {
        options: treeTypeOptions,
        placeholder: '请选择树类型',
      },
    },
    {
      component: 'Select',
      defaultValue: 1,
      fieldName: 'transport',
      label: '传输协议',
      rules: 'selectRequired',
      componentProps: {
        options: transportOptions,
        placeholder: '请选择传输协议',
      },
    },
    {
      component: 'Select',
      defaultValue: 2,
      fieldName: 'characterSet',
      label: '字符集',
      rules: 'selectRequired',
      componentProps: {
        options: charsetOptions,
        placeholder: '请选择字符集',
      },
    },
    switchSchema('ptz', '云台控制', 1),
    switchSchema('rtcp', 'RTCP 保活', 0),
    switchSchema('startOfflinePush', '主动拉流', 1),
    switchSchema('enable', '是否启用', 1),
    switchSchema('asMessageChannel', '消息通道', 1),
  ];
}
