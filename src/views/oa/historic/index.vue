<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('oa.historic:detail'),
              icon: 'clarity:info-standard-line',
              onClick: handleView.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '@/components/Table';
  import { doFindAlreadyList, OAIndex } from '@/api/oa/activiti';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useGo } from '@/hooks/web/usePage';

  const go = useGo();
  const { hasPermission } = usePermission();

  const [registerTable] = useTable({
    title: '历史流程列表',
    api: doFindAlreadyList,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    useSearchForm: true,
    bordered: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'k',
    actionColumn: {
      width: 50,
      title: 'Action',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  const handleView = (record: Recordable) => {
    const key = record.processDefinitionId.split(':');
    go(OAIndex[key[0]] + record.businessKey + ':2');
  };

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `name`,
          label: `任务名称`,
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
        title: '流程定义名称',
        dataIndex: 'processDefinitionName',
        fixed: 'left',
        width: 100,
      },
      {
        title: '任务名称',
        dataIndex: 'instanceName',
        fixed: 'left',
        width: 100,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        fixed: 'left',
        width: 100,
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        fixed: 'left',
        width: 100,
      },
    ];
  }
</script>
