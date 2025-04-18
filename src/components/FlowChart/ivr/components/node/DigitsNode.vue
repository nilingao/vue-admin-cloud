<template>
  <DefaultNode
    :nodeId="props.id"
    :nodeLabel="data.label"
    :isOperate="true"
    nodeIcon="fluent:number-symbol-16-filled"
    iconBackground="rgb(247, 89, 171)"
  >
    <NodeContext isMore isTitle titleName="语音播放" @more="headerMore" moreIcon="ep:setting">
      <div class="flex flex-col">
        <div class="flex pb-2 grid gap-2">
          <div>
            <span class="text-sm font-medium antialiased">{{
              stats.playType == 1 ? '选择语音文件' : '播放内容'
            }}</span>
          </div>
          <div>
            <Select
              v-model:value="stats.playType"
              :options="playTypeOptions"
              size="small"
              class="w-full"
            />
          </div>
        </div>
        <div v-if="stats.playType == 1">
          <Select
            v-model:value="stats.playback"
            :options="playTypeOptions"
            size="small"
            class="w-full"
          />
        </div>
        <div v-if="stats.playType == 2">
          <Textarea
            v-model:value="stats.content"
            :placeholder="'请输入播放内容'"
            :rows="3"
            class="w-full"
            :style="{ height: 'auto' }"
          />
        </div>
      </div>
    </NodeContext>
    <NodeContext class="mt-2" isTitle titleName="错误语音播放">
      <div class="flex flex-col">
        <div class="flex pb-2 grid gap-2">
          <div>
            <span class="text-sm font-medium antialiased">{{
              stats.dtmfErrorType == 1 ? '选择语音文件' : '播放内容'
            }}</span>
          </div>
          <div>
            <Select
              v-model:value="stats.dtmfErrorType"
              :options="playTypeOptions"
              size="small"
              class="w-full"
            />
          </div>
        </div>
        <div v-if="stats.dtmfErrorType == 1">
          <Select
            v-model:value="stats.dtmfErrorPlayback"
            :options="playTypeOptions"
            size="small"
            class="w-full"
          />
        </div>
        <div v-if="stats.dtmfErrorType == 2">
          <Textarea
            v-model:value="stats.dtmfErrorContext"
            :placeholder="'请输入播放内容'"
            :rows="3"
            class="w-full"
            :style="{ height: 'auto' }"
          />
        </div>
      </div>
    </NodeContext>
    <NodeVariable
      v-if="stats.fieldList && stats.fieldList.length > 0"
      titleName="参数输出"
      :fieldList="stats.fieldList"
    />
    <DigitsNodeModel @register="registerModel" @ok="handleSuccess" />
  </DefaultNode>
</template>

<script setup lang="ts">
  import NodeContext from './components/NodeContext.vue';
  import DefaultNode from './components/DefaultNode.vue';
  import NodeVariable from './components/NodeVariable.vue';
  import DigitsNodeModel from './model/DigitsNodeModel.vue';
  import { cloneDeep } from 'lodash-es';
  import { reactive, watch, onBeforeMount } from 'vue';
  import { playTypeOptions, type DigitsNodeData, type NodeFields } from '../../hooks/common';
  import { Select, Textarea } from 'ant-design-vue';
  import { useVueFlow } from '@vue-flow/core';
  import { useModal } from '@/components/Modal';

  defineOptions({ name: 'DigitsNode' });
  const { updateNode } = useVueFlow();
  const [registerModel, { openModal }] = useModal();
  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    data: {
      type: Object as PropType<DigitsNodeData>,
      required: true,
    },
  });

  const stats = reactive({
    fieldList: [] as NodeFields[],
    // 1.语音文件播放 2.tts播放
    playType: 1,
    playback: '',
    content: '',
    retry: 1,
    dtmfMax: 1,
    dtmfMin: 1,
    dtmfEnd: '*',
    dtmfTimeout: 5000,
    dtmfDigitTimeout: 5000,
    dtmfErrorType: 1,
    dtmfErrorPlayback: '',
    dtmfErrorContext: '',
  });

  const headerMore = () => {
    openModal(true, {
      retry: stats.retry,
      dtmfMax: stats.dtmfMax,
      dtmfMin: stats.dtmfMin,
      dtmfEnd: stats.dtmfEnd,
      dtmfTimeout: stats.dtmfTimeout,
      dtmfDigitTimeout: stats.dtmfDigitTimeout,
    });
  };

  const handleSuccess = (val) => {
    stats.retry = val.retry;
    stats.dtmfMax = val.dtmfMax;
    stats.dtmfMin = val.dtmfMin;
    stats.dtmfEnd = val.dtmfEnd;
    stats.dtmfTimeout = val.dtmfTimeout;
    stats.dtmfDigitTimeout = val.dtmfDigitTimeout;
  };

  watch(
    () => [stats],
    () => {
      // 触发父组件的更新
      const { label, config, nodeData } = props.data;
      const { fieldList, ...val } = stats;
      const data = {
        label,
        config: {
          ...config,
          fields: fieldList,
        },
        nodeData: {
          ...nodeData,
          ...val,
        },
      };
      updateNode(props.id, { data });
    },
    { immediate: true, deep: true },
  );

  const initData = () => {
    const data = cloneDeep(props.data);
    stats.playType = data.nodeData.playType;
    stats.playback = data.nodeData.playback;
    stats.content = data.nodeData.content;
    stats.retry = data.nodeData.retry;
    stats.dtmfMax = data.nodeData.dtmfMax;
    stats.dtmfMin = data.nodeData.dtmfMin;
    stats.dtmfEnd = data.nodeData.dtmfEnd;
    stats.dtmfTimeout = data.nodeData.dtmfTimeout;
    stats.dtmfDigitTimeout = data.nodeData.dtmfDigitTimeout;
    stats.dtmfErrorType = data.nodeData.dtmfErrorType;
    stats.dtmfErrorPlayback = data.nodeData.dtmfErrorPlayback;
    stats.dtmfErrorContext = data.nodeData.dtmfErrorContext;
    stats.fieldList = data.config?.fields || [];
  };

  onBeforeMount(() => {
    initData();
  });
</script>
