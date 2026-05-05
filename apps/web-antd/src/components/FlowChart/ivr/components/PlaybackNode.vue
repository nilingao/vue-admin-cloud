<script setup lang="ts">
import type { NodeData, NodeFields } from '../types';

import { onBeforeMount, reactive, watch } from 'vue';

import { cloneDeep } from '@vben/utils';

import { useVueFlow } from '@vue-flow/core';
import { Select, Textarea } from 'ant-design-vue';

import { playbackOptions, playTypeOptions } from '../types';
import DefaultNode from './DefaultNode.vue';
import NodeContext from './NodeContext.vue';
import NodeVariable from './NodeVariable.vue';

defineOptions({ name: 'IvrPlaybackNode' });

const props = defineProps<{
  data: NodeData;
  id: string;
}>();

const { addNodes, findNode, updateNode } = useVueFlow();

const state = reactive({
  content: '',
  fieldList: [] as NodeFields[],
  playback: undefined as number | undefined,
  playId: undefined as number | undefined,
  playType: 1,
});

watch(
  () => [state.playType, state.playback, state.content, state.fieldList],
  () => {
    const { label, config, nodeData } = props.data;
    const { fieldList, ...value } = state;
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

function initData() {
  const data = cloneDeep(props.data);
  state.playId = data.nodeData?.playId || undefined;
  state.playType = data.nodeData?.playType || 1;
  state.playback = data.nodeData?.playback || undefined;
  state.content = data.nodeData?.content || '';
  state.fieldList = data.config?.fields || [];
}

function handleCope(newNodeId: string) {
  const sourceNode = cloneDeep(findNode(props.id)) as any;
  const { fieldList: _fieldList, playId: _playId, ...value } = state;
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
    node-icon="hugeicons:audio-wave-01"
    icon-background="rgb(34, 157, 255)"
    @cope="handleCope"
  >
    <NodeContext>
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
    <NodeVariable
      v-if="state.fieldList.length > 0"
      title-name="参数输出"
      :field-list="state.fieldList"
    />
  </DefaultNode>
</template>
