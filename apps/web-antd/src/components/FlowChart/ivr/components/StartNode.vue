<script setup lang="ts">
import type { NodeData } from '../types';

import { reactive } from 'vue';

import DefaultNode from './DefaultNode.vue';
import NodeVariable from './NodeVariable.vue';

defineOptions({ name: 'IvrStartNode' });

const props = defineProps<{
  data: NodeData;
  id: string;
}>();

const state = reactive({
  fieldList: props.data.config?.fields || [],
});
</script>

<template>
  <DefaultNode
    :node-id="props.id"
    :is-target="false"
    :node-label="data.label"
    node-icon="hugeicons:start-up-02"
    icon-background="rgb(209 54 209)"
  >
    <NodeVariable
      :is-pt="false"
      title-name="全局变量"
      :field-list="state.fieldList"
    />
  </DefaultNode>
</template>
