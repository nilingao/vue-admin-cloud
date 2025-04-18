<template>
  <BasicModal
    v-bind="$attrs"
    title="收号设置"
    @register="registerModal"
    @ok="handelSubmit"
    @cancel="handelCancel"
    width="600px"
  >
    <div :class="`${prefixCls}`">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { useDesign } from '@/hooks/web/useDesign';

  const { prefixCls } = useDesign('digits-node-model');
  const emit = defineEmits(['ok', 'cancel', 'register']);
  const schemas: FormSchema[] = [
    {
      field: 'retry',
      component: 'InputNumber',
      label: '重复播放次数',
      colProps: {
        span: 24,
      },
      componentProps: {
        placeholder: '请输入数字',
        min: 0,
        precision: 0,
      },
    },
    {
      field: 'dtmfMin',
      component: 'InputNumber',
      label: '最小收键长度',
      colProps: {
        span: 24,
      },
      componentProps: {
        placeholder: '请输入数字',
        min: 0,
        precision: 0,
      },
    },
    {
      field: 'dtmfMax',
      component: 'InputNumber',
      label: '最大收键长度',
      colProps: {
        span: 24,
      },
      componentProps: {
        placeholder: '请输入数字',
        min: 0,
        precision: 0,
      },
      required: true,
    },
    {
      field: 'dtmfEnd',
      component: 'Input',
      label: '结束音',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'dtmfTimeout',
      component: 'InputNumber',
      label: '超时时间(毫秒)',
      colProps: {
        span: 24,
      },
      componentProps: {
        placeholder: '请输入数字',
        precision: 0,
        min: 0,
      },
    },
    {
      field: 'dtmfDigitTimeout',
      component: 'InputNumber',
      label: '按键数字之间超时时间(毫秒)',
      colProps: {
        span: 24,
      },
      componentProps: {
        placeholder: '请输入数字',
        precision: 0,
        min: 0,
      },
    },
  ];

  const [registerForm, { setFieldsValue, validateFields, resetFields }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    showActionButtonGroup: false,
  });

  const handelSubmit = async () => {
    const values = await validateFields();
    emit('ok', values);
    closeModal();
  };
  const handelCancel = () => {
    closeModal();
  };

  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    if (!data) {
      return;
    }
    resetFields();
    setFieldsValue({
      ...data,
    });
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-digits-node-model';
</style>
