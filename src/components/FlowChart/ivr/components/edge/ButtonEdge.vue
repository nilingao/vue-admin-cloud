<template>
  <BaseEdge
    v-bind="$attrs"
    :class="`${prefixCls}`"
    :id="id"
    :path="path[0]"
    :marker-end="`url(#${markerId})`"
  />

  <ButtonMarker :edgeCenterX="path[1]" :edgeCenterY="path[2]" @delete="handleDelete" />
</template>
<script setup lang="ts">
  import { useDesign } from '@/hooks/web/useDesign';
  import { computed } from 'vue';
  import ButtonMarker from './components/ButtonMarker.vue';
  import { BaseEdge, getBezierPath, useVueFlow, type Position } from '@vue-flow/core';

  defineOptions({ name: 'ButtonEdge' });
  const { prefixCls } = useDesign('button_edge');

  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    style: {
      type: Object,
      required: false,
      default: () => ({
        fill: 'none',
        stroke: '#b1b1b7',
        strokeWidth: 1,
      }),
    },
    sourceX: {
      type: Number,
      required: true,
    },
    sourceY: {
      type: Number,
      required: true,
    },
    targetX: {
      type: Number,
      required: true,
    },
    targetY: {
      type: Number,
      required: true,
    },
    sourcePosition: {
      type: String as PropType<Position>,
      required: true,
    },
    targetPosition: {
      type: String as PropType<Position>,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: false,
    },
  });
  const { removeEdges } = useVueFlow();
  const path = computed(() =>
    getBezierPath({
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      targetX: props.targetX,
      targetY: props.targetY,
      targetPosition: props.targetPosition,
      sourcePosition: props.sourcePosition,
    }),
  );
  const markerId = computed(() => `${props.id}-marker`);

  // 删除边
  const handleDelete = () => {
    removeEdges(props.id);
  };
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-button_edge';

  .@{prefix-cls} {
    z-index: 99999;
  }

  .vue-flow__minimap {
    transform: scale(75%);
    transform-origin: bottom right;
  }

  .vue-flow__edges {
    z-index: 9999 !important;
  }
</style>
