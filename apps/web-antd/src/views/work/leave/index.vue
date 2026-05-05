<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { LeaveEntity } from '#/api/oa/leave';

import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { doDeleteLeave, doFindLeave, doInsertLeave } from '#/api/oa/leave';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const leaveData = ref<LeaveEntity>();
const routeParam = computed(() => String(route.params.id ?? 'undefined'));
const businessKey = computed(() => routeParam.value.split(':')[0]);
const taskId = computed(() => routeParam.value.split(':')[2]);
const readonly = computed(
  () =>
    !!leaveData.value?.processInstanceId ||
    routeParam.value.split(':')[1] === '2',
);

const schema: VbenFormSchema[] = [
  {
    component: 'DatePicker',
    fieldName: 'startTime',
    label: '开始时间',
    rules: 'required',
    componentProps: {
      class: 'w-full',
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    component: 'DatePicker',
    fieldName: 'endTime',
    label: '结束时间',
    rules: 'required',
    componentProps: {
      class: 'w-full',
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    component: 'InputNumber',
    controlClass: 'w-full',
    fieldName: 'day',
    label: '天数',
    rules: 'required',
    componentProps: {
      min: 0.5,
      precision: 1,
    },
  },
  {
    component: 'Textarea',
    fieldName: 'memo',
    label: '备注',
    componentProps: {
      rows: 4,
    },
  },
];

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  schema,
  showDefaultActions: false,
});

async function init() {
  if (!businessKey.value || businessKey.value === 'undefined') {
    return;
  }
  const data = await doFindLeave({ id: businessKey.value });
  if (!data) {
    message.warning('请假记录不存在或已删除');
    return;
  }
  leaveData.value = data;
  formApi.setValues(data);
  if (readonly.value) {
    formApi.updateSchema(
      schema.map((item) => ({
        fieldName: item.fieldName,
        componentProps: {
          disabled: true,
        },
      })),
    );
  }
}

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  try {
    await doInsertLeave((await formApi.getValues()) as LeaveEntity);
    message.success('请假申请已提交');
    router.back();
  } finally {
    loading.value = false;
  }
}

async function onDelete() {
  if (!businessKey.value || businessKey.value === 'undefined') {
    return;
  }
  await doDeleteLeave({ id: businessKey.value });
  message.success('请假申请已删除');
  router.back();
}

onMounted(() => {
  init();
});
</script>

<template>
  <Page auto-content-height title="请假申请">
    <Card class="mx-auto max-w-[760px]">
      <Form />
      <div class="mt-6 flex justify-center">
        <Space>
          <Button @click="router.back()">返回</Button>
          <Button
            v-if="businessKey !== 'undefined' && !readonly"
            danger
            @click="onDelete"
          >
            删除
          </Button>
          <Button
            v-if="!readonly"
            :loading="loading"
            type="primary"
            @click="onSubmit"
          >
            提交
          </Button>
        </Space>
      </div>
      <div v-if="taskId" class="mt-4 text-center text-xs text-muted-foreground">
        当前任务：{{ taskId }}
      </div>
    </Card>
  </Page>
</template>
