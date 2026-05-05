import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PushEntity } from '#/api/video/push';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

const yesNoOptions = [
  { color: 'success', label: '是', value: 1 },
  { color: 'error', label: '否', value: 0 },
];

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
      fieldName: 'pushing',
      label: '推流状态',
      componentProps: {
        allowClear: true,
        options: [
          { label: '是', value: '1' },
          { label: '否', value: '0' },
        ],
        placeholder: '请选择推流状态',
      },
    },
  ];
}

export function useColumns<T = PushEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { field: 'app', fixed: 'left', minWidth: 160, title: '应用名' },
    { field: 'stream', fixed: 'left', minWidth: 180, title: '流 ID' },
    { field: 'name', minWidth: 160, showOverflow: true, title: '名称' },
    { field: 'totalReaderCount', minWidth: 130, title: '观看总人数' },
    { field: 'originTypeStr', minWidth: 150, title: '源类型' },
    { field: 'aliveSecond', minWidth: 130, title: '存活时间(秒)' },
    { field: 'gbId', minWidth: 160, showOverflow: true, title: '国标编号' },
    {
      field: 'mediaServerId',
      minWidth: 160,
      showOverflow: true,
      title: '流媒体编号',
    },
    { field: 'serverId', minWidth: 160, showOverflow: true, title: '服务编号' },
    { field: 'pushTime', minWidth: 180, showOverflow: true, title: '推流时间' },
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
      title: '在线状态',
    },
    {
      cellRender: { name: 'CellTag', options: yesNoOptions },
      field: 'pushIng',
      minWidth: 110,
      title: '推流状态',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '推流',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'play',
            show: (row: PushEntity) =>
              hasAccessByCodes(['video.push:play']) && row.pushIng === 1,
            text: '播放',
          },
          {
            code: 'edit',
            show: () => hasAccessByCodes(['video.push:update']),
          },
          {
            code: 'delete',
            show: () => hasAccessByCodes(['video.push:delete']),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 180,
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
  ];
}
