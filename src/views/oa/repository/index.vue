<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('oa.repository:deploy'),
              label: '部署',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('oa.repository:pending'),
              label: !record.isSuspended ? '挂起' : '激活',
              color: !record.isSuspended ? 'error' : 'success',
              popConfirm: {
                title: '是否挂起？',
                confirm: handleSuspended.bind(null, record),
              },
            },
            {
              ifShow: hasPermission('oa.repository:delete'),
              color: 'error',
              label: '删除',
              popConfirm: {
                title: '是否删除？',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd" v-if="hasPermission('oa.repository:add')"
          >添加</a-button
        >
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '@/components/Table';
  import { ActivitiRepositoryEntity } from '@/api/oa/model/activitiModel';
  import {
    OAIndex,
    doDeleteProcess,
    doFindRepositoryList,
    doSuspendedProcessDefinition,
  } from '@/api/oa/activiti';
  import { usePermission } from '@/hooks/web/usePermission';
  import { Tag } from 'ant-design-vue';
  import { h } from 'vue';
  import { useGo } from '@/hooks/web/usePage';

  const go = useGo();

  const { hasPermission } = usePermission();

  const [registerTable, { reload }] = useTable({
    title: '流程定义',
    api: doFindRepositoryList,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    bordered: true,
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'key',
    actionColumn: {
      width: 160,
      title: 'Action',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  const handleSuccess = () => {
    //刷新表单
    reload();
  };

  const handleAdd = () => {
    go(OAIndex['Deploy'] + 'undefined');
  };

  const handleEdit = (record: Recordable) => {
    go(OAIndex['Deploy'] + record.id);
  };

  const handleSuspended = async (record: Recordable) => {
    await doSuspendedProcessDefinition({ processDefinitionId: record.id });
    //刷新表单
    handleSuccess();
  };

  const handleDelete = async (record: Recordable) => {
    //删除
    await doDeleteProcess({ deploymentId: record.deploymentId, stats: 2 });
    //刷新表单
    handleSuccess();
  };

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `deploymentName`,
          label: `流程名称`,
          component: 'Input',
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
        title: '实例key',
        dataIndex: 'key',
        fixed: 'left',
        width: 100,
      },
      {
        title: '流程部署实例名称',
        dataIndex: 'deploymentName',
        fixed: 'left',
        width: 100,
      },
      {
        title: '实例版本',
        dataIndex: 'version',
        fixed: 'left',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'isSuspended',
        width: 200,
        customRender: ({ record }) => {
          const { isSuspended } = (record as ActivitiRepositoryEntity) || {};
          const status = !isSuspended;
          const color = status ? 'green' : 'red';
          const text = status ? '启用' : '挂起';
          return h(Tag, { color: color }, () => text);
        },
      },
    ];
  }
</script>
