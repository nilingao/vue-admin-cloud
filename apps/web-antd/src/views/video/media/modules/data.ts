import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MediaServerEntity } from '#/api/video/mediaServer';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

function portSchema(fieldName: string, label: string): VbenFormSchema {
  return {
    component: 'InputNumber',
    controlClass: 'w-full',
    defaultValue: 0,
    fieldName,
    label,
    rules: 'required',
    componentProps: {
      max: 65_535,
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

export function useColumns<T = MediaServerEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'ip',
      fixed: 'left',
      minWidth: 160,
      showOverflow: true,
      title: 'IP',
    },
    {
      field: 'hookIp',
      minWidth: 160,
      showOverflow: true,
      title: '平台 IP',
    },
    {
      cellRender: {
        name: 'CellTag',
      },
      field: 'sslStatus',
      minWidth: 100,
      title: 'SSL',
    },
    {
      field: 'sdpIp',
      minWidth: 160,
      showOverflow: true,
      title: 'SDP IP',
    },
    {
      field: 'streamIp',
      minWidth: 160,
      showOverflow: true,
      title: '流 IP',
    },
    {
      field: 'httpPort',
      minWidth: 110,
      title: 'HTTP 端口',
    },
    {
      field: 'httpSslPort',
      minWidth: 120,
      title: 'HTTPS 端口',
    },
    {
      field: 'rtmpPort',
      minWidth: 120,
      title: 'RTMP 端口',
    },
    {
      field: 'rtmpSslPort',
      minWidth: 130,
      title: 'RTMPS 端口',
    },
    {
      field: 'rtpProxyPort',
      minWidth: 140,
      title: 'RTP 收流端口',
    },
    {
      field: 'rtspPort',
      minWidth: 120,
      title: 'RTSP 端口',
    },
    {
      field: 'rtspSslPort',
      minWidth: 130,
      title: 'RTSPS 端口',
    },
    {
      field: 'keepaliveTime',
      minWidth: 170,
      showOverflow: true,
      title: '心跳时间',
    },
    {
      cellRender: {
        name: 'CellTag',
      },
      field: 'enable',
      minWidth: 110,
      title: '是否启用',
    },
    {
      cellRender: {
        name: 'CellTag',
      },
      field: 'autoConfig',
      minWidth: 120,
      title: '自动配置',
    },
    {
      cellRender: {
        name: 'CellTag',
      },
      field: 'rtpEnable',
      minWidth: 130,
      title: '多端口模式',
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
      field: 'rtpPortRange',
      minWidth: 170,
      showOverflow: true,
      title: 'RTP 端口范围',
    },
    {
      cellRender: {
        name: 'CellTag',
      },
      field: 'defaultServer',
      minWidth: 120,
      title: '默认 ZLM',
    },
    {
      field: 'hookAliveInterval',
      minWidth: 150,
      title: '心跳间隔(秒)',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'ip',
          nameTitle: '流媒体服务',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: () => hasAccessByCodes(['video.media:update']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['video.media:delete']),
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
      fieldName: 'id',
      label: 'ID',
      dependencies: {
        show: false,
        triggerFields: ['id'],
      },
    },
    {
      component: 'Input',
      fieldName: 'ip',
      label: '流媒体 IP',
      rules: 'required',
      componentProps: {
        placeholder: '请输入流媒体 IP',
      },
    },
    {
      component: 'Input',
      fieldName: 'sdpIp',
      label: 'SDP IP',
      componentProps: {
        placeholder: '请输入 SDP IP',
      },
    },
    {
      component: 'Input',
      fieldName: 'streamIp',
      label: '流 IP',
      rules: 'required',
      componentProps: {
        placeholder: '请输入流 IP',
      },
    },
    {
      component: 'Input',
      fieldName: 'hookIp',
      label: '回调服务 IP',
      rules: 'required',
      componentProps: {
        placeholder: '请输入回调服务 IP',
      },
    },
    {
      component: 'Input',
      fieldName: 'videoPlayPrefix',
      label: '播放代理前缀',
      componentProps: {
        placeholder: '请输入播放代理前缀',
      },
    },
    {
      component: 'Input',
      fieldName: 'videoHttpPrefix',
      label: '请求代理前缀',
      componentProps: {
        placeholder: '请输入请求代理前缀',
      },
    },
    portSchema('httpPort', 'HTTP 端口'),
    portSchema('httpSslPort', 'HTTPS 端口'),
    portSchema('rtmpPort', 'RTMP 端口'),
    portSchema('rtmpSslPort', 'RTMPS 端口'),
    portSchema('rtpProxyPort', 'RTP 收流端口'),
    portSchema('rtspPort', 'RTSP 端口'),
    portSchema('rtspSslPort', 'RTSPS 端口'),
    {
      component: 'Input',
      fieldName: 'rtpPortRange',
      label: 'RTP 端口范围',
      rules: 'required',
      componentProps: {
        placeholder: '例如：30000,30500',
      },
    },
    {
      component: 'InputNumber',
      controlClass: 'w-full',
      defaultValue: 10,
      fieldName: 'hookAliveInterval',
      label: '心跳触发间隔',
      rules: 'required',
      componentProps: {
        max: 3600,
        min: 10,
        placeholder: '请输入心跳触发间隔',
        precision: 0,
      },
    },
    {
      component: 'Input',
      defaultValue: '035c73f7-bb6b-4889-a715-d9eb2d1925cc',
      fieldName: 'secret',
      label: '鉴权参数',
      rules: 'required',
      componentProps: {
        placeholder: '请输入鉴权参数',
      },
    },
    switchSchema('enable', '是否启用', 1),
    switchSchema('defaultServer', '默认 ZLM', 1),
    switchSchema('sslStatus', '是否 SSL', 0),
    switchSchema('rtpEnable', '多端口模式', 1),
    switchSchema('autoConfig', '自动配置 ZLM', 1),
  ];
}
