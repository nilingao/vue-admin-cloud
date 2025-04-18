<template>
  <DefaultNode
    :nodeId="props.id"
    :nodeLabel="data.label"
    nodeIcon="hugeicons:start-up-02"
    iconBackground="rgb(209 54 209)"
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
  </DefaultNode>
</template>

<script setup lang="ts">
  import NodeContext from './components/NodeContext.vue';
  import DefaultNode from './components/DefaultNode.vue';
  import { reactive, watch } from 'vue';
  import { playTypeOptions, type PlaybackNodeData } from '../../hooks/common';
  import { Select, Textarea } from 'ant-design-vue';
  import { useVueFlow } from '@vue-flow/core';

  defineOptions({ name: 'PlaybackNode' });
  const { updateNode } = useVueFlow();
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
    playType: 1,
    playback: '',
    content: '',
  });

  watch(
    () => [stats.playType, stats.playback, stats.content],
    () => {
      // 触发父组件的更新
      const { label, config, nodeData } = props.data;
      const data = {
        label,
        config: {
          ...config,
        },
        nodeData: {
          ...nodeData,
          playType: stats.playType,
          playback: stats.playback,
          content: stats.content,
        },
      };
      updateNode(props.id, { data });
    },
    { immediate: true, deep: true },
  );
</script>
