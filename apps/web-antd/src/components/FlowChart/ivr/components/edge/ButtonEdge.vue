<script setup lang="ts">
import type { Position } from '@vue-flow/core';

import { computed } from 'vue';

import {
  BaseEdge,
  getBezierPath,
  MarkerType,
  useVueFlow,
} from '@vue-flow/core';

import ButtonMarker from './components/ButtonMarker.vue';

defineOptions({ name: 'IvrButtonEdge' });

const props = defineProps<{
  id: string;
  sourcePosition: Position;
  sourceX: number;
  sourceY: number;
  targetPosition: Position;
  targetX: number;
  targetY: number;
}>();

const { removeEdges } = useVueFlow();

const path = computed(() =>
  getBezierPath({
    sourcePosition: props.sourcePosition,
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetPosition: props.targetPosition,
    targetX: props.targetX,
    targetY: props.targetY,
  }),
);

function handleDelete() {
  removeEdges(props.id);
}
</script>

<template>
  <BaseEdge
    class="ivr-button-edge"
    :id="id"
    :path="path[0]"
    :marker-end="MarkerType.ArrowClosed"
  />
  <ButtonMarker
    :edge-center-x="path[1]"
    :edge-center-y="path[2]"
    @delete="handleDelete"
  />
</template>

<style>
.ivr-button-edge {
  stroke: #8b95a5;
  stroke-width: 1.5;
}

.vue-flow__edges {
  z-index: 10 !important;
}
</style>
