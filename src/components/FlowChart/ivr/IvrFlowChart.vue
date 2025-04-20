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
      deleteKeyCode="Delete"
      fit-view-on-init
    >
      <Background color="#aaa" :gap="16" />
      <Panel :position="stats.position">
        <div class="flex items-center">
          <span class="text-sm text-gray-500">节点数: {{ graphData.nodes.length }}</span>
          <span class="text-sm text-gray-500 ml-2">边数: {{ graphData.edges.length }}</span>
        </div>
      </Panel>
      <template #[`node-${item}`]="prop" :key="item" v-for="item in Object.keys(NodeInstanceMap)">
        <component :is="NodeInstanceMap[item]" :id="prop.id" :data="prop.data" />
      </template>
      <template #[`edge-${item}`]="prop" :key="item" v-for="item in Object.keys(EdgeInstanceMap)">
        <component :is="EdgeInstanceMap[item]" v-bind="prop" />
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
  import './style/public.less';
  //编写业务
  import { useAppStore } from '@/store/modules/app';
  import IvrFlowChartToolbar from './components/toolbar/IvrFlowChartToolbar.vue';
  import { JsonPreview } from '@/components/CodeEditor';
  import { useModal, BasicModal } from '@/components/Modal';
  import { useDesign } from '@/hooks/web/useDesign';
  import { NodeInstanceMap } from './components/node';
  import { EdgeInstanceMap } from './components/edge';

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
  const { onInit, onNodeDragStop, onConnect, findNode, addEdges, toObject } = useVueFlow(
    props.vueFlowId,
  );

  const [register, { openModal }] = useModal();

  const handlePreview = () => {
    const { nodes, edges, viewport } = toObject();
    graphData.nodes = nodes;
    graphData.edges = edges;
    graphData.viewport = viewport;
    openModal();
  };
  //初始化视图
  onInit((vueFlowInstance) => {
    vueFlowInstance.fitView();
  });
  /**
   * deleteKeyCode 删除快捷键
   * 当创建新连接时，会调用onConnect。
   * 您可以向新边添加其他属性（如类型或标签），也可以通过不调用`addEdges来完全阻止创建`
   */
  onConnect((params) => {
    const newEdge = {
      ...params,
      type: 'button_edge',
      id: `${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}`,
    };

    const targetList = params.targetHandle?.split('-') || [];
    const sourceList = params.sourceHandle?.split('-') || [];
    if (targetList[0] === sourceList[0]) {
      console.log('不能连接到同一节点');
      return;
    } else if (targetList[1] === sourceList[1]) {
      console.log('连接方向不能一致');
      return;
    }
    // 这里可以添加一些逻辑来处理连接的节点
    console.log('onConnect', newEdge);
    const { edges } = toObject();
    const sourceLength = edges.filter((edge) => edge.sourceHandle === newEdge.sourceHandle).length;
    if (sourceLength > 0) {
      console.log('源节点已经连接');
      return;
    }

    const sourceNode = findNode(newEdge.source);
    console.log('sourceNode', sourceNode);
    addEdges(newEdge);
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
</script>
