import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DeviceChannelEntity } from '#/api/video/deviceChannel';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

export const channelStatusOptions = [
  { label: '在线', value: 1 },
  { label: '离线', value: 0 },
];

export const ptzTypeOptions = [
  { label: '未知', value: 0 },
  { label: '球机', value: 1 },
  { label: '半球', value: 2 },
  { label: '固定枪机', value: 3 },
  { label: '遥控枪机', value: 4 },
];

function getOptionLabel(
  options: Array<{ label: string; value: number }>,
  value?: number,
) {
  return String(
    options.find((item) => item.value === value)?.label ?? value ?? '',
  );
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
      component: 'Select',
      fieldName: 'online',
      label: '通道状态',
      componentProps: {
        allowClear: true,
        options: channelStatusOptions,
        placeholder: '请选择通道状态',
      },
    },
  ];
}

export function useColumns<T = DeviceChannelEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      fixed: 'left',
      minWidth: 100,
      title: '编号',
      treeNode: true,
      type: 'seq',
    },
    {
      field: 'channelId',
      fixed: 'left',
      minWidth: 200,
      showOverflow: true,
      title: '通道国标编号',
    },
    {
      field: 'parentId',
      minWidth: 180,
      showOverflow: true,
      title: '父级国标',
    },
    {
      field: 'name',
      minWidth: 140,
      showOverflow: true,
      title: '通道名称',
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
      minWidth: 110,
      title: '通道状态',
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'success', label: '开启', value: 1 },
          { color: 'error', label: '关闭', value: 0 },
        ],
      },
      field: 'hasRecord',
      minWidth: 110,
      title: '录像状态',
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'success', label: '开启', value: 1 },
          { color: 'error', label: '关闭', value: 0 },
        ],
      },
      field: 'hasAudio',
      minWidth: 110,
      title: '音频状态',
    },
    {
      field: 'ptzType',
      minWidth: 120,
      slots: {
        default: ({ row }) => getOptionLabel(ptzTypeOptions, row.ptzType),
      },
      title: '云台类型',
    },
    {
      field: 'longitude',
      minWidth: 150,
      slots: {
        default: ({ row }) =>
          row.latitude || row.longitude
            ? `${row.latitude},${row.longitude}`
            : '',
      },
      title: '位置',
    },
    {
      field: 'address',
      minWidth: 160,
      showOverflow: true,
      title: '安装地址',
    },
    {
      field: 'manufacture',
      minWidth: 150,
      showOverflow: true,
      title: '厂商',
    },
    {
      field: 'model',
      minWidth: 120,
      showOverflow: true,
      title: '型号',
    },
    {
      field: 'owner',
      minWidth: 150,
      showOverflow: true,
      title: '设备归属',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '设备通道',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'play',
            show: (row: DeviceChannelEntity) =>
              hasAccessByCodes(['video.play.channel:play']) &&
              row.status === 1 &&
              (row.subCount ?? 0) === 0,
            text: '播放',
          },
          {
            code: 'stop',
            show: (row: DeviceChannelEntity) =>
              hasAccessByCodes(['video.play.channel:suspend']) &&
              !!row.streamId &&
              (row.subCount ?? 0) === 0,
            text: '暂停',
          },
          {
            code: 'record',
            show: (row: DeviceChannelEntity) =>
              hasAccessByCodes(['video.play.channel:playback']) &&
              row.status === 1 &&
              (row.subCount ?? 0) === 0,
            text: '历史回放',
          },
          {
            code: 'edit',
            show: () => hasAccessByCodes(['video.play.channel:update']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['video.play.channel:delete']),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 280,
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'parentId',
      label: '父级编号',
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'deviceId',
      label: '设备编号',
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'channelId',
      label: '通道国标编号',
      rules: 'required',
      componentProps: {
        placeholder: '请输入通道国标编号',
      },
    },
    {
      component: 'Input',
      fieldName: 'civilCode',
      label: '行政区域',
      componentProps: {
        placeholder: '请输入行政区域',
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '通道名称',
      componentProps: {
        placeholder: '请输入通道名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'address',
      label: '安装地址',
      componentProps: {
        placeholder: '请输入安装地址',
      },
    },
    {
      component: 'Select',
      defaultValue: 0,
      fieldName: 'ptzType',
      label: '云台类型',
      rules: 'selectRequired',
      componentProps: {
        options: ptzTypeOptions,
        placeholder: '请选择云台类型',
      },
    },
    {
      component: 'Input',
      fieldName: 'password',
      label: '密码',
      componentProps: {
        placeholder: '请输入密码',
      },
    },
    switchSchema('hasRecord', '录像状态', 0),
    switchSchema('hasAudio', '音频状态', 0),
  ];
}
