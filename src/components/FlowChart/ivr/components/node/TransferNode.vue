<template>
  <DefaultNode
    :nodeId="props.id"
    :nodeLabel="data.label"
    :isOperate="true"
    nodeIcon="ph:phone-transfer-bold"
    iconBackground="rgb(13, 191, 125)"
    @cope="handleCope"
  >
    <NodeContext :isTitle="false">
      <div class="flex flex-col">
        <div class="flex pb-2 grid gap-2">
          <div class="flex-none">
            <span class="text-sm font-medium antialiased">路由类型</span>
          </div>
          <div class="flex-grow">
            <Select
              v-model:value="stats.routeType"
              :options="transferTypeOptions"
              size="small"
              class="w-full"
            />
          </div>
        </div>
        <div class="flex grid gap-2" v-if="stats.routeType === 'TRANSFER_GROUP'">
          <div class="flex-none">
            <span class="text-sm font-medium antialiased">技能组：</span>
          </div>
          <div class="flex-grow">
            <Select
              v-model:value="stats.skillId"
              :options="transferTypeOptions"
              size="small"
              class="w-full"
            />
          </div>
        </div>
        <div class="flex grid gap-2" v-if="stats.routeType === 'TRANSFER_AGENT'">
          <div class="flex-none">
            <span class="text-sm font-medium antialiased">坐席：</span>
          </div>
          <div class="flex-grow">
            <Select
              v-model:value="stats.agentId"
              :options="transferTypeOptions"
              size="small"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid gap-2" v-if="stats.routeType === 'TRANSFER_EXTERNAL'">
          <div class="flex">
            <div class="flex-none">
              <span class="text-sm font-medium antialiased">手机号：</span>
            </div>
            <div class="flex-grow">
              <Input v-model:value="stats.outPhone" :placeholder="'请输入手机号'" size="small" />
            </div>
          </div>
          <div class="flex">
            <div class="flex-none">
              <span class="text-sm font-medium antialiased">线路：</span>
            </div>
            <div class="flex-grow">
              <Select
                v-model:value="stats.sipTrunkId"
                :options="transferTypeOptions"
                size="small"
                class="w-full"
              />
            </div>
          </div>
        </div>
        <div class="flex grid gap-2" v-if="stats.routeType === 'TRANSFER_VDN'">
          <div class="flex-none">
            <span class="text-sm font-medium antialiased">VDN：</span>
          </div>
          <div class="flex-grow">
            <Select
              v-model:value="stats.vdnId"
              :options="transferTypeOptions"
              size="small"
              class="w-full"
            />
          </div>
        </div>
        <div class="flex grid gap-2" v-if="stats.routeType === 'TRANSFER_IVR'">
          <div class="flex-none">
            <span class="text-sm font-medium antialiased">IVR：</span>
          </div>
          <div class="flex-grow">
            <Select
              v-model:value="stats.ivrId"
              :options="transferTypeOptions"
              size="small"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </NodeContext>
  </DefaultNode>
</template>

<script setup lang="ts">
  import NodeContext from './components/NodeContext.vue';
  import DefaultNode from './components/DefaultNode.vue';
  import { cloneDeep } from 'lodash-es';
  import { reactive, watch, onBeforeMount } from 'vue';
  import { transferTypeOptions, type TransferNodeData } from '../../hooks/common';
  import { Select, Input } from 'ant-design-vue';
  import { useVueFlow } from '@vue-flow/core';

  defineOptions({ name: 'PlaybackNode' });
  const { findNode, addNodes, updateNode } = useVueFlow();
  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    data: {
      type: Object as PropType<TransferNodeData>,
      required: true,
    },
  });

  const stats = reactive({
    // 1.技能组 2.坐席 3.外呼
    routeType: 'TRANSFER_GROUP',
    skillId: 1,
    agentId: 1,
    outPhone: '',
    sipTrunkId: 1,
    vdnId: 1,
    ivrId: 1,
  });

  watch(
    () => [stats],
    () => {
      // 触发父组件的更新
      const { label, config, nodeData } = props.data;
      const { ...val } = stats;
      const data = {
        label,
        config: {
          ...config,
        },
        nodeData: {
          ...nodeData,
          ...val,
        },
      };
      updateNode(props.id, { data });
    },
    { immediate: true, deep: true },
  );

  const initData = () => {
    const data = cloneDeep(props.data);
    stats.routeType = data.nodeData.routeType;
    stats.skillId = data.nodeData.skillId;
    stats.agentId = data.nodeData.agentId;
    stats.outPhone = data.nodeData.outPhone;
    stats.sipTrunkId = data.nodeData.sipTrunkId;
    stats.vdnId = data.nodeData.vdnId;
    stats.ivrId = data.nodeData.ivrId;
  };

  const handleCope = (newNodeId) => {
    const { position, data, type } = cloneDeep(findNode(props.id)) as any;
    addNodes({
      id: newNodeId,
      position: { x: position.x + 20, y: position.y + 20 },
      type,
      data: { ...data, nodeId: '', nodeData: { ...stats } },
    });
  };
  onBeforeMount(() => {
    initData();
  });
</script>
