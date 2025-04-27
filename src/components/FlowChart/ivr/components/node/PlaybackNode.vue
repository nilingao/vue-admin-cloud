<template>
  <DefaultNode
    :nodeId="props.id"
    :nodeLabel="data.label"
    :isOperate="true"
    nodeIcon="hugeicons:audio-wave-01"
    iconBackground="rgb(34, 157, 255)"
    @cope="handleCope"
  >
    <NodeContext :isTitle="false">
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
    <NodeVariable
      v-if="stats.fieldList && stats.fieldList.length > 0"
      titleName="参数输出"
      :fieldList="stats.fieldList"
    />
  </DefaultNode>
</template>

<script setup lang="ts">
  import NodeContext from './components/NodeContext.vue';
  import DefaultNode from './components/DefaultNode.vue';
  import NodeVariable from './components/NodeVariable.vue';
  import { cloneDeep } from 'lodash-es';
  import { reactive, watch, onBeforeMount } from 'vue';
  import { playTypeOptions, type PlaybackNodeData, type NodeFields } from '../../hooks/common';
  import { Select, Textarea } from 'ant-design-vue';
  import { useVueFlow } from '@vue-flow/core';

  defineOptions({ name: 'PlaybackNode' });
  const { findNode, addNodes, updateNode } = useVueFlow();
  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    data: {
      type: Object as PropType<PlaybackNodeData>,
      required: true,
    },
  });

  const stats = reactive({
    // 1.语音文件播放 2.tts播放
    playId: undefined as number | undefined,
    playType: 1,
    playback: undefined as number | undefined,
    content: '',
    fieldList: [] as NodeFields[],
  });

  watch(
    () => [stats.playType, stats.playback, stats.content],
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
    stats.playId = data.nodeData.playId || undefined;
    stats.playType = data.nodeData.playType;
    stats.playback = data.nodeData.playback;
    stats.content = data.nodeData.content;
    stats.fieldList = data.config?.fields || [];
  };

  const handleCope = (newNodeId) => {
    const { position, data, type } = cloneDeep(findNode(props.id)) as any;
    const { fieldList: _fieldList, playId: _playId, ...val } = stats;
    addNodes({
      id: newNodeId,
      position: { x: position.x + 20, y: position.y + 20 },
      type,
      data: { ...data, nodeId: '', nodeData: { ...val } },
    });
  };

  onBeforeMount(() => {
    initData();
  });
</script>
