<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable @register="registerTable" :rowSelection="{ type: 'checkbox' }">
      <template #transportType="{ record }">
        <Tag color="green">
          {{ systemStore.getDictMap[TRANSPORT_TYPE_ENUM][record.transport] }}
        </Tag>
      </template>
      <template #streamMode="{ record }">
        <Tag color="green">
          {{ systemStore.getDictMap[STREAM_MODE_TYPE_ENUM][record.streamMode] }}
        </Tag>
      </template>
      <template #treeType="{ record }">
        <Tag color="green">
          {{ systemStore.getDictMap[TREE_TYPE_ENUM][record.treeType] }}
        </Tag>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('video.play:refresh'),
              tooltip: '刷新',
              icon: 'solar:refresh-bold',
              onClick: handleRefresh.bind(null, record),
            },
            {
              ifShow: hasPermission('video.play:channel'),
              tooltip: '设备通道',
              icon: 'carbon:devices',
              onClick: handleChannel.bind(null, record),
            },
            {
              ifShow: hasPermission('video.play:update'),
              tooltip: '编辑',
              icon: 'mdi:file-edit-outline',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('video.play:delete'),
              color: 'error',
              icon: 'mdi:delete-outline',
              tooltip: '删除',
              popConfirm: {
                title: '是否删除？',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd" v-if="hasPermission('video.play:add')"
          >添加</a-button
        >
      </template>
    </BasicTable>
    <DeviceDrawer @register="registerDrawer" @success="handleSuccess" />
    <DeviceChannelSyncModel @register="registerModel" @close="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '@/components/Table';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useMessage } from '@/hooks/web/useMessage';
  import { h } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { useDrawer } from '@/components/Drawer';
  import { useModal } from '@/components/Modal';
  import { doDevicePage, doDelDeviceId } from '@/api/video/device';
  import { doSyncDeviceChannel } from '@/api/video/deviceChannel';
  import DeviceDrawer from './DeviceDrawer.vue';
  import DeviceChannelSyncModel from './channel/DeviceChannelSyncModel.vue';
  import { useSystemStore } from '@/store/modules/system';
  import { TRANSPORT_TYPE_ENUM, STREAM_MODE_TYPE_ENUM, TREE_TYPE_ENUM } from '@/enums/commonEnum';
  import { useGo } from '@/hooks/web/usePage';

  const go = useGo();

  const systemStore = useSystemStore();
  const { hasPermission } = usePermission();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerModel, { openModal }] = useModal();
  const { createMessage } = useMessage();

  const [registerTable, { reload }] = useTable({
    title: '国标设备',
    api: doDevicePage,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    bordered: true,
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    actionColumn: {
      width: 160,
      title: 'Action',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  const handleRefresh = async (record: Recordable) => {
    if (record.online == 0) {
      createMessage.error('设备离线');
      return;
    }
    await doSyncDeviceChannel({ deviceId: record.deviceId });
    openModal(true, { deviceId: record.deviceId });
  };
  const handleChannel = (record: Recordable) => {
    go('/video/play/channel/' + record.deviceId);
  };
  const handleAdd = () => {
    openDrawer(true, { id: undefined, isUpdate: false });
  };
  const handleEdit = (record: Recordable) => {
    openDrawer(true, {
      deviceId: record.deviceId,
      isUpdate: true,
    });
  };
  const handleSuccess = () => {
    //刷新表单
    reload();
  };
  const handleDelete = async (record: Recordable) => {
    //删除
    await doDelDeviceId({ deviceId: record.deviceId });
    //刷新表单
    reload();
  };

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      autoSetPlaceHolder: true,
      schemas: [
        {
          field: `query`,
          label: `查询内容`,
          component: 'Input',
          componentProps: {
            placeholder: '请输入设备ip或收流IP',
          },
          colProps: {
            xl: 6,
            xxl: 5,
          },
        },
      ],
    };
  }

  function getBasicColumns(): BasicColumn[] {
    return [
      {
        title: '国标编号',
        dataIndex: 'deviceId',
        fixed: 'left',
        width: 180,
      },
      {
        title: '设备名',
        dataIndex: 'name',
        width: 100,
      },
      {
        title: '通道数',
        dataIndex: 'channelCount',
        width: 100,
      },
      {
        title: '设备状态',
        dataIndex: 'online',
        width: 100,
        customRender: ({ record }) => {
          const status = record.online;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '在线' : '离线';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '注册时间',
        dataIndex: 'registerTime',
        width: 150,
      },
      {
        title: '心跳时间',
        dataIndex: 'keepaliveTime',
        width: 150,
      },
      {
        title: '心跳间隔(秒)',
        dataIndex: 'heartBeatInterval',
        width: 100,
      },
      {
        title: '设备分组',
        dataIndex: 'treeType',
        width: 100,
        slots: { customRender: 'treeType' },
      },
      {
        title: '生产厂商',
        dataIndex: 'manufacturer',
        width: 100,
      },
      {
        title: '固件版本',
        dataIndex: 'firmware',
        width: 100,
      },
      {
        title: '传输协议',
        dataIndex: 'transport',
        width: 100,
        slots: { customRender: 'transportType' },
      },
      {
        title: '数据流传输模式',
        dataIndex: 'streamMode',
        width: 100,
        slots: { customRender: 'streamMode' },
      },
    ];
  }
</script>
