<template>
  <DefaultNode
    :nodeId="props.id"
    :isTarget="false"
    :nodeLabel="data.label"
    nodeIcon="hugeicons:start-up-02"
    iconBackground="rgb(209 54 209)"
  >
    <NodeVariable titleName="全局变量" :fieldList="stats.fieldList" />
  </DefaultNode>
</template>

<script setup lang="ts">
  // import { useVueFlow } from '@vue-flow/core';
  import { reactive } from 'vue';
  import { type StartNodeData } from '../../hooks/common';
  import NodeVariable from './components/NodeVariable.vue';
  import DefaultNode from './components/DefaultNode.vue';

  defineOptions({ name: 'StartNode' });
  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    data: {
      type: Object as PropType<StartNodeData>,
      required: true,
    },
  });

  const stats = reactive({
    fieldList: props.data.config?.fields || [],
  });

  // const { updateNodeData } = useVueFlow();

  // const updateData = (data) => {
  //   updateNodeData(props.id, data);
  // };
  // const headerMore = () => {
  //   console.log('headerMore');
  // };
</script>
