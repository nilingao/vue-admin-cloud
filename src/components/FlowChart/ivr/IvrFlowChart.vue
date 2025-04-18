<template>
  <div class="h-full" :class="prefixCls">
    <IvrFlowChartToolbar
      :vueFlowId="props.vueFlowId"
      :prefixCls="prefixCls"
      v-if="toolbar"
      @view-data="handlePreview"
    />
    <VueFlow
      :id="props.vueFlowId"
      :class="`dark:${appStore.getDarkMode === 'light'}`"
      :nodes="graphData.nodes"
      :edges="graphData.edges"
      :minZoom="0.5"
      :default-viewport="{ zoom: 0.5 }"
      fit-view-on-init
    >
      <Background color="#aaa" :gap="16" />
      <Panel :position="stats.position">
        <div class="flex items-center">
          <span class="text-sm text-gray-500">节点数: {{ graphData.nodes.length }}</span>
          <span class="text-sm text-gray-500 ml-2">边数: {{ graphData.edges.length }}</span>
        </div>
      </Panel>
      <template #[`node-${item}`]="props" :key="item" v-for="item in Object.keys(NodeInstanceMap)">
        <component :is="NodeInstanceMap[item]" :id="props.id" :data="props.data" />
      </template>
    </VueFlow>
    <BasicModal @register="register" title="流程数据" width="50%">
      <JsonPreview :data="graphData" />
    </BasicModal>
  </div>
</template>
<script setup lang="ts">
  import { reactive } from 'vue';
  import { Background, Panel } from '@vue-flow/additional-components';
  import { type Node, type Edge, VueFlow, useVueFlow, PanelPosition } from '@vue-flow/core';
  import '@vue-flow/core/dist/style.css';
  import '@vue-flow/core/dist/theme-default.css';
  import './style/controls.css';
  import './style/minimap.css';
  //编写业务
  import { useAppStore } from '@/store/modules/app';
  import IvrFlowChartToolbar from './components/toolbar/IvrFlowChartToolbar.vue';
  import { JsonPreview } from '@/components/CodeEditor';
  import { useModal, BasicModal } from '@/components/Modal';
  import { useDesign } from '@/hooks/web/useDesign';
  import { NodeInstanceMap } from './components/node/NodeList';

  const appStore = useAppStore();
  const { prefixCls } = useDesign('ivr-chart');
  const props = defineProps({
    vueFlowId: {
      type: String,
      default: 'ivr-flow-chart',
    },
    data: {
      type: Object as PropType<any>,
      default: () => ({
        nodes: [] as Node[],
        edges: [] as Edge[],
      }),
    },
    toolbar: {
      type: Boolean,
      default: true,
    },
  });
  const stats = reactive({
    position: PanelPosition.TopLeft,
  });
  const graphData = reactive({
    nodes: props.data.nodes,
    edges: props.data.edges,
    viewport: {},
  });
  const { onInit, onNodeDragStop, onConnect, addEdges, toObject } = useVueFlow(props.vueFlowId);

  const [register, { openModal }] = useModal();

  const handlePreview = () => {
    const { nodes, edges, viewport } = toObject();
    graphData.nodes = nodes;
    graphData.edges = edges;
    graphData.viewport = viewport;
    openModal();
  };
  /**
   * 当创建新连接时，会调用onConnect。
   * 您可以向新边添加其他属性（如类型或标签），也可以通过不调用`addEdges来完全阻止创建`
   */
  onConnect((connection) => {
    addEdges(connection);
  });
  /**
   * 当节点拖动完毕时，会调用onNodeDragStop
   * 节点拖动事件为您提供：
   * 1. 事件对象
   * 2. 节点数组（如果拖动了多个节点）
   * 3. 启动拖动的节点
   * 4. 与其他节点的任何交叉点
   */
  onNodeDragStop(({ event, nodes, node }) => {
    console.log('Node Drag Stop', { event, nodes, node });
  });
  //初始化视图
  onInit((vueFlowInstance) => {
    vueFlowInstance.fitView();
  });
  // 计算节点的坐标
  // const calculateNodePositions = (edges, nodes) => {
  //   const positionMap = {}; // 用于存储每个节点的位置
  //   const processedNodes = new Set(); // 用于标记已经计算过位置的节点
  //   let yPosition = 100; // 初始的 Y 坐标设置
  //   // 遍历 edges 数组中的每个边来设置起始节点的位置
  //   edges.forEach((edge) => {
  //     // 1. 给源节点分配位置
  //     if (!processedNodes.has(edge.source)) {
  //       positionMap[edge.source] = { x: 100, y: yPosition }; // 初始位置
  //       yPosition += 100; // 增加 y 值，避免节点重叠
  //       processedNodes.add(edge.source);
  //     }
  //     // 2. 根据源节点的位置来计算目标节点的位置
  //     const sourcePosition = positionMap[edge.source];
  //     if (sourcePosition && !processedNodes.has(edge.target)) {
  //       // 给目标节点分配位置
  //       positionMap[edge.target] = {
  //         x: sourcePosition.x + 200, // 横向偏移
  //         y: sourcePosition.y + 50, // 纵向偏移
  //       };
  //       processedNodes.add(edge.target);
  //     }
  //   });
  //   // 更新节点位置
  //   nodes.forEach((node) => {
  //     if (positionMap[node.id]) {
  //       node.position = positionMap[node.id];
  //     }
  //   });
  // };
</script>
