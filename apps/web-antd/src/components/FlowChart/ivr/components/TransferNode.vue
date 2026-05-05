<script setup lang="ts">
import type { NodeData } from '../types';

import { onBeforeMount, reactive, watch } from 'vue';

import { cloneDeep } from '@vben/utils';

import { useVueFlow } from '@vue-flow/core';
import { Input, Select } from 'ant-design-vue';

import { agentOptions, skillOptions, transferTypeOptions } from '../types';
import DefaultNode from './DefaultNode.vue';
import NodeContext from './NodeContext.vue';

defineOptions({ name: 'IvrTransferNode' });

const props = defineProps<{
  data: NodeData;
  id: string;
}>();

const { addNodes, findNode, updateNode } = useVueFlow();

const state = reactive({
  agentId: undefined as number | undefined,
  ivrId: undefined as number | undefined,
  outPhone: '',
  routeType: 'TRANSFER_GROUP',
  sipTrunkId: undefined as number | undefined,
  skillId: undefined as number | undefined,
  vdnId: undefined as number | undefined,
});

watch(
  () => state,
  () => {
    const { label, config, nodeData } = props.data;
    updateNode(props.id, {
      data: {
        label,
        config: { ...config },
        nodeData: { ...nodeData, ...state },
      },
    });
  },
  { deep: true, immediate: true },
);

function initData() {
  const data = cloneDeep(props.data);
  state.routeType = data.nodeData?.routeType || 'TRANSFER_GROUP';
  state.skillId = data.nodeData?.skillId || undefined;
  state.agentId = data.nodeData?.agentId || undefined;
  state.outPhone = data.nodeData?.outPhone || '';
  state.sipTrunkId = data.nodeData?.sipTrunkId || undefined;
  state.vdnId = data.nodeData?.vdnId || undefined;
  state.ivrId = data.nodeData?.ivrId || undefined;
}

function handleCope(newNodeId: string) {
  const sourceNode = cloneDeep(findNode(props.id)) as any;
  addNodes({
    data: { ...sourceNode.data, nodeData: { ...state }, nodeId: '' },
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
    node-icon="ph:phone-transfer-bold"
    icon-background="rgb(13, 191, 125)"
    @cope="handleCope"
  >
    <NodeContext>
      <div class="grid gap-2">
        <span class="text-sm font-medium antialiased">路由类型</span>
        <Select
          v-model:value="state.routeType"
          :options="transferTypeOptions"
          size="small"
          class="w-full"
        />

        <template v-if="state.routeType === 'TRANSFER_GROUP'">
          <span class="text-sm font-medium antialiased">技能组</span>
          <Select
            v-model:value="state.skillId"
            :options="skillOptions"
            size="small"
            class="w-full"
          />
        </template>

        <template v-if="state.routeType === 'TRANSFER_AGENT'">
          <span class="text-sm font-medium antialiased">坐席</span>
          <Select
            v-model:value="state.agentId"
            :options="agentOptions"
            size="small"
            class="w-full"
          />
        </template>

        <template v-if="state.routeType === 'TRANSFER_EXTERNAL'">
          <span class="text-sm font-medium antialiased">手机号码</span>
          <Input
            v-model:value="state.outPhone"
            placeholder="请输入手机号"
            size="small"
          />
          <span class="text-sm font-medium antialiased">线路</span>
          <Select
            v-model:value="state.sipTrunkId"
            :options="skillOptions"
            size="small"
            class="w-full"
          />
        </template>

        <template v-if="state.routeType === 'TRANSFER_VDN'">
          <span class="text-sm font-medium antialiased">VDN</span>
          <Select
            v-model:value="state.vdnId"
            :options="skillOptions"
            size="small"
            class="w-full"
          />
        </template>

        <template v-if="state.routeType === 'TRANSFER_IVR'">
          <span class="text-sm font-medium antialiased">IVR</span>
          <Select
            v-model:value="state.ivrId"
            :options="skillOptions"
            size="small"
            class="w-full"
          />
        </template>
      </div>
    </NodeContext>
  </DefaultNode>
</template>
