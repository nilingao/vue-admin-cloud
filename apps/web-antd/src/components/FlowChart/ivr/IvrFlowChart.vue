<script setup lang="ts">
import type { Edge, Node } from '@vue-flow/core';

import { nextTick, reactive, ref, watch } from 'vue';

import { Background, Panel } from '@vue-flow/additional-components';
import { PanelPosition, useVueFlow, VueFlow } from '@vue-flow/core';
import { message, Modal } from 'ant-design-vue';

import { EdgeInstanceMap } from './components/edge';
import { NodeInstanceMap } from './components/node';
import IvrFlowChartToolbar from './components/toolbar/IvrFlowChartToolbar.vue';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';

defineOptions({ name: 'IvrFlowChart' });

const props = withDefaults(
  defineProps<{
    data?: {
      edges?: Edge[];
      nodes?: Node[];
    };
    toolbar?: boolean;
    vueFlowId?: string;
  }>(),
  {
    data: () => ({
      edges: [],
      nodes: [],
    }),
    toolbar: true,
    vueFlowId: 'ivr-flow-chart',
  },
);

const graphData = reactive({
  edges: [] as Edge[],
  nodes: [] as Node[],
  viewport: {},
});

const previewOpen = ref(false);
const previewData = ref('');

const { addEdges, fitView, onConnect, onInit, setEdges, setNodes, toObject } =
  useVueFlow(props.vueFlowId);

function normalizeNodes(nodes: Node[]) {
  return nodes.map((node) => ({
    ...node,
    deletable: node.type === 'START_NODE' ? false : node.deletable,
  }));
}

function syncData() {
  graphData.nodes = normalizeNodes(props.data?.nodes || []);
  graphData.edges = props.data?.edges || [];
  setNodes(graphData.nodes);
  setEdges(graphData.edges);
}

watch(
  () => props.data,
  () => {
    syncData();
    nextTick(() => fitView({ padding: 0.2 }));
  },
  { deep: true, immediate: true },
);

onInit(() => {
  syncData();
  nextTick(() => fitView({ padding: 0.2 }));
});

onConnect((params) => {
  const targetList = params.targetHandle?.split('-') || [];
  const sourceList = params.sourceHandle?.split('-') || [];

  if (!params.source || !params.target) {
    return;
  }
  if (targetList[0] === sourceList[0]) {
    message.warning('不能连接到同一节点');
    return;
  }
  if (targetList[1] === sourceList[1]) {
    message.warning('连接方向不能一致');
    return;
  }

  const { edges } = toObject();
  const duplicatedSource = edges.some(
    (edge) => edge.sourceHandle === params.sourceHandle,
  );
  if (duplicatedSource) {
    message.warning('当前出口已经连接');
    return;
  }

  addEdges({
    ...params,
    id: `${params.sourceHandle}-${params.targetHandle}`,
    type: 'button_edge',
  });
});

function handlePreview() {
  const { edges, nodes, viewport } = toObject();
  graphData.nodes = nodes;
  graphData.edges = edges;
  graphData.viewport = viewport;
  previewData.value = JSON.stringify(graphData, null, 2);
  previewOpen.value = true;
}
</script>

<template>
  <div class="ivr-flow-chart">
    <IvrFlowChartToolbar
      v-if="toolbar"
      :vue-flow-id="vueFlowId"
      @view-data="handlePreview"
    />
    <VueFlow
      :id="vueFlowId"
      class="ivr-flow-chart__canvas"
      :nodes="graphData.nodes"
      :edges="graphData.edges"
      :min-zoom="0.5"
      :default-viewport="{ zoom: 0.5 }"
      delete-key-code="Delete"
      fit-view-on-init
    >
      <Background color="#aab0bb" :gap="16" />
      <Panel :position="PanelPosition.TopLeft">
        <div class="ivr-flow-chart__stats">
          <span>节点数: {{ graphData.nodes.length }}</span>
          <span>边数: {{ graphData.edges.length }}</span>
        </div>
      </Panel>

      <template
        v-for="item in Object.keys(NodeInstanceMap)"
        #[`node-${item}`]="slotProps"
        :key="item"
      >
        <component
          :is="NodeInstanceMap[item as keyof typeof NodeInstanceMap]"
          :id="slotProps.id"
          :data="slotProps.data"
        />
      </template>

      <template
        v-for="item in Object.keys(EdgeInstanceMap)"
        #[`edge-${item}`]="slotProps"
        :key="item"
      >
        <component
          :is="EdgeInstanceMap[item as keyof typeof EdgeInstanceMap]"
          v-bind="slotProps"
        />
      </template>
    </VueFlow>

    <Modal
      v-model:open="previewOpen"
      title="流程数据"
      width="70%"
      :footer="null"
    >
      <pre class="ivr-flow-chart__json">{{ previewData }}</pre>
    </Modal>
  </div>
</template>

<style scoped>
.ivr-flow-chart {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 720px;
  overflow: hidden;
  background: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
}

.ivr-flow-chart__canvas {
  flex: 1;
}

.ivr-flow-chart__stats {
  display: flex;
  gap: 12px;
  padding: 4px 8px;
  font-size: 12px;
  color: #667085;
  background: rgb(255 255 255 / 86%);
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.ivr-flow-chart__json {
  max-height: 640px;
  padding: 12px;
  overflow: auto;
  font-size: 12px;
  line-height: 1.6;
  color: #e5e7eb;
  background: #0f172a;
  border-radius: 6px;
}
</style>
