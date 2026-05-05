import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DeviceEntity } from '#/api/video/device';

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

export const geoCoordSysOptions = [
  { label: 'WGS84', value: 1 },
  { label: 'GCJ02', value: 2 },
  { label: 'BD09', value: 3 },
];

export const streamModeOptions = [
  { label: 'UDP', value: 1 },
  { label: 'TCP 被动', value: 2 },
  { label: 'TCP 主动', value: 3 },
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
      min: 0,
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
    rules: 'required',
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
      label: '查询内容',
      componentProps: {
        placeholder: '请输入设备 IP 或收流 IP',
      },
    },
  ];
}

export function useColumns<T = DeviceEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'deviceId',
      fixed: 'left',
      minWidth: 180,
      showOverflow: true,
      title: '国标编号',
    },
    {
      field: 'name',
      minWidth: 130,
      showOverflow: true,
      title: '设备名称',
    },
    {
      field: 'channelCount',
      minWidth: 100,
      title: '通道数',
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'success', label: '在线', value: 1 },
          { color: 'error', label: '离线', value: 0 },
        ],
      },
      field: 'online',
      minWidth: 100,
      title: '设备状态',
    },
    {
      field: 'registerTime',
      minWidth: 160,
      showOverflow: true,
      title: '注册时间',
    },
    {
      field: 'keepaliveTime',
      minWidth: 160,
      showOverflow: true,
      title: '心跳时间',
    },
    {
      field: 'heartBeatInterval',
      minWidth: 130,
      title: '心跳间隔(秒)',
    },
    {
      field: 'treeType',
      minWidth: 120,
      slots: {
        default: ({ row }) => getOptionLabel(treeTypeOptions, row.treeType),
      },
      title: '设备分组',
    },
    {
      field: 'manufacturer',
      minWidth: 130,
      showOverflow: true,
      title: '生产厂商',
    },
    {
      field: 'firmware',
      minWidth: 130,
      showOverflow: true,
      title: '固件版本',
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
      field: 'streamMode',
      minWidth: 140,
      slots: {
        default: ({ row }) => getOptionLabel(streamModeOptions, row.streamMode),
      },
      title: '数据流传输模式',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '国标设备',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'refresh',
            show: () => hasAccessByCodes(['video.play:refresh']),
            text: '刷新',
          },
          {
            code: 'channel',
            show: () => hasAccessByCodes(['video.play:channel']),
            text: '设备通道',
          },
          {
            code: 'edit',
            show: () => hasAccessByCodes(['video.play:update']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['video.play:delete']),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 240,
    },
  ];
}

export function useFormSchema(
  mediaOptions: Array<{ label: string; value: string }>,
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
      fieldName: 'deviceId',
      label: '设备国标编号',
      rules: 'required',
      componentProps: {
        placeholder: '请输入设备国标编号',
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '设备名称',
      componentProps: {
        placeholder: '请输入设备名称',
      },
    },
    {
      component: 'Select',
      fieldName: 'mediaServerId',
      label: '流媒体',
      componentProps: {
        allowClear: true,
        options: mediaOptions,
        placeholder: '请选择流媒体',
        showSearch: true,
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
      component: 'Input',
      fieldName: 'password',
      label: '设备密码',
      componentProps: {
        placeholder: '请输入设备密码',
      },
    },
    {
      component: 'Input',
      fieldName: 'sdpIp',
      label: '收流 IP',
      componentProps: {
        placeholder: '请输入收流 IP',
      },
    },
    {
      component: 'Select',
      defaultValue: 2,
      fieldName: 'charset',
      label: '字符集',
      rules: 'selectRequired',
      componentProps: {
        options: charsetOptions,
        placeholder: '请选择字符集',
      },
    },
    {
      component: 'Select',
      defaultValue: 215,
      fieldName: 'treeType',
      label: '设备类型',
      rules: 'selectRequired',
      componentProps: {
        options: treeTypeOptions,
        placeholder: '请选择设备类型',
      },
    },
    {
      component: 'Select',
      defaultValue: 1,
      fieldName: 'geoCoordSys',
      label: '地理坐标系',
      rules: 'selectRequired',
      componentProps: {
        options: geoCoordSysOptions,
        placeholder: '请选择地理坐标系',
      },
    },
    {
      component: 'Select',
      defaultValue: 1,
      fieldName: 'streamMode',
      label: '数据流传输模式',
      rules: 'selectRequired',
      componentProps: {
        options: streamModeOptions,
        placeholder: '请选择数据流传输模式',
      },
    },
    numberSchema('mobilePositionSubmissionInterval', '位置上报周期(s)', 0),
    numberSchema('subscribeCycleForCatalog', '目录订阅周期(s)', 0),
    numberSchema('subscribeCycleForMobilePosition', '位置订阅周期(s)', 0),
    numberSchema('subscribeCycleForAlarm', '报警订阅周期(s)', 0),
    switchSchema('ssrcCheck', '开启 SSRC 校验', 0),
    switchSchema('asMessageChannel', '是否为消息通道', 0),
    switchSchema('hasAdministrator', '开启数据限制', 0),
  ];
}
