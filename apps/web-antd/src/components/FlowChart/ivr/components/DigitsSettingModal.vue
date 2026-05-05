<script setup lang="ts">
import { reactive, watch } from 'vue';

import { Form, Input, InputNumber, Modal } from 'ant-design-vue';

defineOptions({ name: 'IvrDigitsSettingModal' });

const props = withDefaults(
  defineProps<{
    open?: boolean;
    values?: Record<string, any>;
  }>(),
  {
    open: false,
    values: () => ({}),
  },
);

const emit = defineEmits<{
  cancel: [];
  ok: [values: Record<string, any>];
  'update:open': [open: boolean];
}>();

const formState = reactive({
  dtmfDigitTimeout: 5000,
  dtmfEnd: '#',
  dtmfMax: 1,
  dtmfMin: 1,
  dtmfTimeout: 5000,
  retry: 1,
});

watch(
  () => props.values,
  (values) => {
    Object.assign(formState, {
      dtmfDigitTimeout: values.dtmfDigitTimeout ?? 5000,
      dtmfEnd: values.dtmfEnd ?? '#',
      dtmfMax: values.dtmfMax ?? 1,
      dtmfMin: values.dtmfMin ?? 1,
      dtmfTimeout: values.dtmfTimeout ?? 5000,
      retry: values.retry ?? 1,
    });
  },
  { immediate: true },
);

function handleOk() {
  emit('ok', { ...formState });
  emit('update:open', false);
}

function handleCancel() {
  emit('cancel');
  emit('update:open', false);
}
</script>

<template>
  <Modal
    :open="open"
    title="收号设置"
    width="600px"
    @ok="handleOk"
    @cancel="handleCancel"
    @update:open="emit('update:open', $event)"
  >
    <Form :model="formState" layout="vertical">
      <Form.Item label="重复播放次数">
        <InputNumber
          v-model:value="formState.retry"
          :min="0"
          :precision="0"
          class="w-full"
        />
      </Form.Item>
      <Form.Item label="最小收键长度">
        <InputNumber
          v-model:value="formState.dtmfMin"
          :min="0"
          :precision="0"
          class="w-full"
        />
      </Form.Item>
      <Form.Item label="最大收键长度">
        <InputNumber
          v-model:value="formState.dtmfMax"
          :min="0"
          :precision="0"
          class="w-full"
        />
      </Form.Item>
      <Form.Item label="结束符">
        <Input v-model:value="formState.dtmfEnd" />
      </Form.Item>
      <Form.Item label="超时时间(毫秒)">
        <InputNumber
          v-model:value="formState.dtmfTimeout"
          :min="0"
          :precision="0"
          class="w-full"
        />
      </Form.Item>
      <Form.Item label="按键数字之间超时时间(毫秒)">
        <InputNumber
          v-model:value="formState.dtmfDigitTimeout"
          :min="0"
          :precision="0"
          class="w-full"
        />
      </Form.Item>
    </Form>
  </Modal>
</template>
