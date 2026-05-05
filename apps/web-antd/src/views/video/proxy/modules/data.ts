import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProxyEntity } from '#/api/video/proxy';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

const yesNoOptions = [
  { color: 'success', label: '是', value: 1 },
  { color: 'error', label: '否', value: 0 },
];

export const proxyTypeOptions = [
  { label: '默认', value: 1 },
  { label: 'FFmpeg', value: 2 },
];

export const proxyRtpTypeOptions = [
  { label: 'TCP', value: 1 },
  { label: 'UDP', value: 2 },
  { label: '组播', value: 3 },
];

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
      label: '查询',
      componentProps: {
        placeholder: '名称、应用名、流 ID、国标 ID',
      },
    },
    {
      component: 'Select',
      fieldName: 'online',
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

export function useColumns<T = ProxyEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { field: 'app', fixed: 'left', minWidth: 160, title: '应用名' },
    { field: 'stream', fixed: 'left', minWidth: 180, title: '流 ID' },
    { field: 'name', minWidth: 160, showOverflow: true, title: '名称' },
    {
      cellRender: { name: 'CellTag', options: proxyTypeOptions },
      field: 'type',
      minWidth: 120,
      title: '拉流类型',
    },
    {
      cellRender: { name: 'CellTag', options: proxyRtpTypeOptions },
      field: 'rtpType',
      minWidth: 120,
      title: '拉流方式',
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
    { field: 'gbId', minWidth: 160, showOverflow: true, title: '国标编号' },
    {
      field: 'mediaServerId',
      minWidth: 160,
      showOverflow: true,
      title: '流媒体编号',
    },
    {
      field: 'url',
      minWidth: 220,
      showOverflow: true,
      slots: {
        default: ({ row }) => (row.type === 1 ? row.url : row.srcUrl),
      },
      title: '拉流地址',
    },
    { field: 'dstUrl', minWidth: 220, showOverflow: true, title: '目标地址' },
    {
      cellRender: { name: 'CellTag', options: yesNoOptions },
      field: 'enable',
      minWidth: 110,
      title: '启用状态',
    },
    {
      cellRender: { name: 'CellTag', options: yesNoOptions },
      field: 'enableAudio',
      minWidth: 110,
      title: '启用音频',
    },
    {
      cellRender: { name: 'CellTag', options: yesNoOptions },
      field: 'enableMp4',
      minWidth: 110,
      title: '启用 MP4',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '拉流代理',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'enable',
            show: () => hasAccessByCodes(['video.proxy:enable']),
            text: (row: ProxyEntity) => (row.status === 1 ? '停用' : '启用'),
          },
          {
            code: 'play',
            show: (row: ProxyEntity) =>
              hasAccessByCodes(['video.proxy:play']) && row.status === 1,
            text: '播放',
          },
          {
            code: 'edit',
            show: () => hasAccessByCodes(['video.proxy:update']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['video.proxy:delete']),
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

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      label: 'ID',
      dependencies: { show: false, triggerFields: ['id'] },
    },
    {
      component: 'Input',
      fieldName: 'app',
      label: '应用名',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'stream',
      label: '流 ID',
      rules: 'required',
    },
    { component: 'Input', fieldName: 'gbId', label: '国标编号' },
    {
      component: 'Input',
      fieldName: 'name',
      label: '名称',
      rules: 'required',
    },
    { component: 'Input', fieldName: 'ffmpegCmdKey', label: 'FFmpeg 模板 Key' },
    {
      component: 'Input',
      fieldName: 'url',
      label: '拉流地址',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      controlClass: 'w-full',
      defaultValue: 10_000,
      fieldName: 'timeoutMs',
      label: '超时时间(毫秒)',
      componentProps: { max: 60_000, min: 1000, precision: 0 },
    },
    {
      component: 'Select',
      defaultValue: 1,
      fieldName: 'type',
      label: '拉流类型',
      rules: 'selectRequired',
      componentProps: { options: proxyTypeOptions },
    },
    {
      component: 'Select',
      defaultValue: 1,
      fieldName: 'rtpType',
      label: '拉流方式',
      rules: 'selectRequired',
      componentProps: { options: proxyRtpTypeOptions },
    },
    switchSchema('enable', '是否启用', 1),
    switchSchema('enableAudio', '启用音频', 0),
    switchSchema('enableMp4', '启用 MP4', 0),
    switchSchema('enableRemoveNoneReader', '无人观看删除', 0),
    switchSchema('enableDisableNoneReader', '无人观看停用', 1),
  ];
}
