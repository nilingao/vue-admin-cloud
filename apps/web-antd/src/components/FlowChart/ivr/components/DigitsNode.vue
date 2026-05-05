<script setup lang="ts">
import type { NodeData, NodeFields } from '../types';

import { onBeforeMount, reactive, watch } from 'vue';

import { cloneDeep } from '@vben/utils';

import { useVueFlow } from '@vue-flow/core';
import { Select, Textarea } from 'ant-design-vue';

import { playbackOptions, playTypeOptions } from '../types';
import DefaultNode from './DefaultNode.vue';
import DigitsSettingModal from './DigitsSettingModal.vue';
import NodeContext from './NodeContext.vue';
import NodeVariable from './NodeVariable.vue';

defineOptions({ name: 'IvrDigitsNode' });

const props = defineProps<{
  data: NodeData;
  id: string;
}>();

const { addNodes, findNode, updateNode } = useVueFlow();

const state = reactive({
  content: '',
  dtmfDigitTimeout: 5000,
  dtmfEnd: '#',
  dtmfErrorContext: '',
  dtmfErrorPlayback: undefined as number | undefined,
  dtmfErrorType: 1,
  dtmfMax: 1,
  dtmfMin: 1,
  dtmfTimeout: 5000,
  fieldList: [] as NodeFields[],
  playback: undefined as number | undefined,
  playId: undefined as number | undefined,
  playType: 1,
  retry: 1,
  settingOpen: false,
});

watch(
  () => state,
  () => {
    const { label, config, nodeData } = props.data;
    const { fieldList, settingOpen: _settingOpen, ...value } = state;
    updateNode(props.id, {
      data: {
        label,
        config: { ...config, fields: fieldList },
        nodeData: { ...nodeData, ...value },
      },
    });
  },
  { deep: true, immediate: true },
);

function openSetting() {
  state.settingOpen = true;
}

function handleSettingOk(values: Record<string, any>) {
  Object.assign(state, values);
}

function initData() {
  const data = cloneDeep(props.data);
  state.playId = data.nodeData?.playId || undefined;
  state.playType = data.nodeData?.playType || 1;
  state.playback = data.nodeData?.playback || undefined;
  state.content = data.nodeData?.content || '';
  state.retry = data.nodeData?.retry ?? 1;
  state.dtmfMax = data.nodeData?.dtmfMax ?? 1;
  state.dtmfMin = data.nodeData?.dtmfMin ?? 1;
  state.dtmfEnd = data.nodeData?.dtmfEnd || '#';
  state.dtmfTimeout = data.nodeData?.dtmfTimeout ?? 5000;
  state.dtmfDigitTimeout = data.nodeData?.dtmfDigitTimeout ?? 5000;
  state.dtmfErrorType = data.nodeData?.dtmfErrorType || 1;
  state.dtmfErrorPlayback = data.nodeData?.dtmfErrorPlayback || undefined;
  state.dtmfErrorContext = data.nodeData?.dtmfErrorContext || '';
  state.fieldList = data.config?.fields || [];
}

function handleCope(newNodeId: string) {
  const sourceNode = cloneDeep(findNode(props.id)) as any;
  const {
    fieldList: _fieldList,
    playId: _playId,
    settingOpen: _settingOpen,
    ...value
  } = state;
  addNodes({
    data: { ...sourceNode.data, nodeData: { ...value }, nodeId: '' },
    id: newNodeId,
    position: {
      x: sourceNode.position.x + 20,
      y: sourceNode.position.y + 20,
    },
    type: sourceNode.type,
  });
}

onBeforeMount(initData);
</script>

<template>
  <DefaultNode
    :node-id="props.id"
    :node-label="data.label"
    is-operate
    node-icon="fluent:number-symbol-16-filled"
    icon-background="rgb(247, 89, 171)"
    @cope="handleCope"
  >
    <NodeContext
      is-title
      is-more
      title-name="语音播放"
      more-icon="ep:setting"
      @more="openSetting"
    >
      <div class="grid gap-2">
        <span class="text-sm font-medium antialiased">
          {{ state.playType === 1 ? '选择语音文件' : '播放内容' }}
        </span>
        <Select
          v-model:value="state.playType"
          :options="playTypeOptions"
          size="small"
          class="w-full"
        />
        <Select
          v-if="state.playType === 1"
          v-model:value="state.playback"
          :options="playbackOptions"
          size="small"
          class="w-full"
        />
        <Textarea
          v-if="state.playType === 2"
          v-model:value="state.content"
          placeholder="请输入播放内容"
          :rows="3"
        />
      </div>
    </NodeContext>

    <NodeContext class="mt-2" is-title title-name="错误语音播放">
      <div class="grid gap-2">
        <span class="text-sm font-medium antialiased">
          {{ state.dtmfErrorType === 1 ? '选择语音文件' : '播放内容' }}
        </span>
        <Select
          v-model:value="state.dtmfErrorType"
          :options="playTypeOptions"
          size="small"
          class="w-full"
        />
        <Select
          v-if="state.dtmfErrorType === 1"
          v-model:value="state.dtmfErrorPlayback"
          :options="playbackOptions"
          size="small"
          class="w-full"
        />
        <Textarea
          v-if="state.dtmfErrorType === 2"
          v-model:value="state.dtmfErrorContext"
          placeholder="请输入播放内容"
          :rows="3"
        />
      </div>
    </NodeContext>

    <NodeVariable
      v-if="state.fieldList.length > 0"
      title-name="参数输出"
      :field-list="state.fieldList"
    />
    <DigitsSettingModal
      v-model:open="state.settingOpen"
      :values="state"
      @ok="handleSettingOk"
    />
  </DefaultNode>
</template>
