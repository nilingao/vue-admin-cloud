<script setup lang="ts">
import type { NodeData } from '../types';

import DefaultNode from './DefaultNode.vue';
import NodeContext from './NodeContext.vue';

defineOptions({ name: 'IvrHangupNode' });

const props = defineProps<{
  data: NodeData;
  id: string;
}>();
</script>

<template>
  <DefaultNode
    :node-id="props.id"
    :node-label="data.label"
    :is-source="false"
    is-operate
    node-icon="icomoon-free:phone-hang-up"
    icon-background="rgb(149, 153, 163)"
  >
    <NodeContext>
      <div class="ivr-hangup-node">
        <span>结束当前通话</span>
      </div>
    </NodeContext>
  </DefaultNode>
</template>

<style scoped>
.ivr-hangup-node {
  display: flex;
  align-items: center;
  min-height: 32px;
  font-size: 13px;
  color: #667085;
}
</style>
