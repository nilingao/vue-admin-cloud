<template>
  <DefaultNode
    :nodeId="props.id"
    :nodeLabel="data.label"
    :isSource="false"
    :isOperate="true"
    nodeIcon="icomoon-free:phone-hang-up"
    iconBackground="rgb(149, 153, 163)"
  >
    <NodeContext :isTitle="false" :isContext="false" />
  </DefaultNode>
</template>

<script setup lang="ts">
  import NodeContext from './components/NodeContext.vue';
  import DefaultNode from './components/DefaultNode.vue';

  import { type PlaybackNodeData } from '../../hooks/common';

  defineOptions({ name: 'PlaybackNode' });
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
</script>
