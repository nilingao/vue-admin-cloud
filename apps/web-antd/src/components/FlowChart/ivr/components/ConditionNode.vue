<script setup lang="ts">
import type { Branch, BranchCondition, NodeData, NodeFields } from '../types';

import { onBeforeMount, reactive, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { cloneDeep } from '@vben/utils';

import { Handle, Position, useVueFlow } from '@vue-flow/core';
import { Button, Col, Input, Row, Select } from 'ant-design-vue';

import { branchConditionOptions, conditionOptions } from '../types';
import DefaultNode from './DefaultNode.vue';
import NodeContext from './NodeContext.vue';
import NodeVariable from './NodeVariable.vue';

defineOptions({ name: 'IvrConditionNode' });

const props = defineProps<{
  data: NodeData;
  id: string;
}>();

const { addNodes, findNode, updateNode } = useVueFlow();

const state = reactive({
  branchConditionList: [] as BranchCondition[],
  branchList: [] as Branch[],
  fieldList: [] as NodeFields[],
});

const variableOptions = [
  { label: '星期', value: 'GLOBAL_VARIABLE.WEEK' },
  { label: '时间', value: 'GLOBAL_VARIABLE.TIME' },
  { label: '主叫', value: 'GLOBAL_VARIABLE.CALLER' },
  { label: '被叫', value: 'GLOBAL_VARIABLE.CALLED' },
  { label: 'DTMF 按键', value: 'DTMF' },
];

function getHandleHeight(branch: Branch) {
  const conditionsCount = branch.conditions?.length || 1;
  if (branch.type === 3) {
    return 24 + 8 * 2;
  }
  return 24 * (conditionsCount + 2) + 8 * (conditionsCount + 2);
}

function getHandleStyle(index: number, branch: Branch) {
  let otherHeight = 0;
  let height = 0;
  for (const item of state.branchConditionList) {
    if (`${item.id}` !== `${branch.id}`) {
      otherHeight += item.height || 0;
      continue;
    }
    height = item.height || 0;
    break;
  }
  const titleHeight = 43;
  return height === 0 ? 0 : titleHeight + otherHeight + height / 2 + 8 * index;
}

function getTypeName(branch: Branch) {
  if (branch.type === 1) return 'IF';
  if (branch.type === 3) return 'ELSE';
  const condition = state.branchConditionList.find(
    (item) => `${item.id}` === `${branch.id}`,
  );
  return `ELSE IF ${condition?.index || 1}`;
}

function addBranch() {
  const newBranch: Branch = {
    condition: 1,
    conditions: [{ compare: 5, field: '', value: '' }],
    id: `${Date.now()}`,
    type: 2,
  };
  const elseIndex = state.branchList.findIndex((branch) => branch.type === 3);
  const insertIndex = elseIndex === -1 ? state.branchList.length : elseIndex;
  state.branchList.splice(insertIndex, 0, newBranch);
  state.branchConditionList.splice(insertIndex, 0, {
    height: getHandleHeight(newBranch),
    id: newBranch.id,
    index: insertIndex,
  });
  state.branchConditionList.forEach((item, index) => {
    item.index = index;
  });
}

function addCondition(branch: Branch) {
  branch.conditions.push({ compare: 5, field: '', value: '' });
  const condition = state.branchConditionList.find(
    (item) => `${item.id}` === `${branch.id}`,
  );
  if (condition) {
    condition.height = getHandleHeight(branch);
  }
}

function removeCondition(branch: Branch, index: number) {
  branch.conditions.splice(index, 1);
  const condition = state.branchConditionList.find(
    (item) => `${item.id}` === `${branch.id}`,
  );
  if (condition) {
    condition.height = getHandleHeight(branch);
  }
  if (branch.conditions.length > 0 || state.branchList.length <= 1) {
    return;
  }
  const branchIndex = state.branchList.findIndex(
    (item) => `${item.id}` === `${branch.id}`,
  );
  state.branchList.splice(branchIndex, 1);
  const conditionIndex = state.branchConditionList.findIndex(
    (item) => `${item.id}` === `${branch.id}`,
  );
  if (conditionIndex !== -1) {
    state.branchConditionList.splice(conditionIndex, 1);
  }
  state.branchConditionList.forEach((item, idx) => {
    item.index = idx;
  });
  if (branch.type === 1 && state.branchList.length > 0) {
    state.branchList[0].type = 1;
  }
}

watch(
  () => [state.fieldList, state.branchList, state.branchConditionList],
  () => {
    const { label, config, nodeData } = props.data;
    updateNode(props.id, {
      data: {
        label,
        config: { ...config, fields: state.fieldList },
        nodeData: {
          ...nodeData,
          branch: state.branchList,
          branchConditionList: state.branchConditionList,
        },
      },
    });
  },
  { deep: true, immediate: true },
);

function handleCope(newNodeId: string) {
  const sourceNode = cloneDeep(findNode(props.id)) as any;
  const branchList = cloneDeep(state.branchList);
  const branchConditionList = cloneDeep(state.branchConditionList);
  let branchId = Number(newNodeId) + 1;
  const branchConditionMap: Record<string, BranchCondition> = {};
  branchConditionList.forEach((item) => {
    branchConditionMap[`${item.id}`] = item;
  });
  branchList.forEach((branch) => {
    branchConditionMap[`${branch.id}`] = {
      ...branchConditionMap[`${branch.id}`],
      id: `${branchId}`,
      nextNodeId: undefined,
    };
    branch.id = `${branchId}`;
    branchId++;
    branch.conditions.forEach((condition) => {
      condition.checkId = '';
    });
  });
  addNodes({
    data: {
      ...sourceNode.data,
      nodeData: {
        branch: branchList,
        branchConditionList: Object.values(branchConditionMap),
      },
      nodeId: '',
    },
    id: newNodeId,
    position: {
      x: sourceNode.position.x + 20,
      y: sourceNode.position.y + 20,
    },
    type: sourceNode.type,
  });
}

function initData() {
  const data = cloneDeep(props.data);
  state.fieldList = data.config?.fields || [];
  const branchList = data.nodeData?.branch || [];
  const branchConditionList = data.nodeData?.branchConditionList || [];

  if (!branchList.some((branch: Branch) => branch.type === 1)) {
    branchList.unshift({
      condition: 1,
      conditions: [{ compare: 5, field: '', value: '' }],
      id: `${Date.now()}`,
      type: 1,
    });
  }
  if (!branchList.some((branch: Branch) => branch.type === 3)) {
    branchList.push({
      condition: 1,
      conditions: [],
      id: `${Date.now() + 1}`,
      type: 3,
    });
  }
  branchList.forEach((branch: Branch, index: number) => {
    const item = branchConditionList.find(
      (condition: BranchCondition) => `${condition.id}` === `${branch.id}`,
    );
    if (item) {
      item.height = getHandleHeight(branch);
      return;
    }
    branchConditionList.push({
      height: getHandleHeight(branch),
      id: branch.id,
      index,
    });
  });
  branchConditionList.sort(
    (a: BranchCondition, b: BranchCondition) => a.index - b.index,
  );
  state.branchConditionList = branchConditionList;

  const ifBranch = branchList.filter((branch: Branch) => branch.type === 1);
  const elseBranch = branchList.filter((branch: Branch) => branch.type === 3);
  const otherBranches = branchList.filter(
    (branch: Branch) => branch.type !== 1 && branch.type !== 3,
  );
  otherBranches.sort((a: Branch, b: Branch) => {
    const indexA = branchConditionList.findIndex(
      (item: BranchCondition) => `${item.id}` === `${a.id}`,
    );
    const indexB = branchConditionList.findIndex(
      (item: BranchCondition) => `${item.id}` === `${b.id}`,
    );
    return indexA - indexB;
  });
  state.branchList = [...ifBranch, ...otherBranches, ...elseBranch];
}

onBeforeMount(initData);
</script>

<template>
  <DefaultNode
    :node-id="props.id"
    :node-label="data.label"
    :node-width="500"
    is-operate
    :is-source="false"
    node-icon="gravity-ui:branches-down"
    icon-background="rgb(20, 192, 255)"
    @cope="handleCope"
  >
    <div class="grid gap-2">
      <NodeContext v-for="(branch, index) in state.branchList" :key="branch.id">
        <div class="flex flex-col justify-start">
          <div class="flex h-6 items-center justify-start">
            <div class="flex-1">{{ getTypeName(branch) }}</div>
            <div
              v-if="branch.conditions && branch.conditions.length > 1"
              class="flex items-center justify-start"
            >
              <span class="text-gray-500">符合以下</span>
              <Select
                v-model:value="branch.condition"
                :options="conditionOptions"
                size="small"
                class="mx-1 w-20"
              />
              <span class="text-gray-500">条件</span>
            </div>
          </div>
          <div v-if="branch.type !== 3" class="grid gap-2 pt-2">
            <Row
              v-for="(condition, conditionIndex) in branch.conditions"
              :key="conditionIndex"
              class="h-6"
              :gutter="8"
            >
              <Col :span="11">
                <Select
                  v-model:value="condition.field"
                  :options="variableOptions"
                  size="small"
                  class="w-full"
                />
              </Col>
              <Col :span="6">
                <Select
                  v-model:value="condition.compare"
                  :options="branchConditionOptions"
                  size="small"
                  class="w-full"
                />
              </Col>
              <Col :span="6">
                <Input
                  v-model:value="condition.value"
                  size="small"
                  class="w-full"
                />
              </Col>
              <Col :span="1">
                <Button
                  type="text"
                  size="small"
                  :disabled="
                    branch.type === 1 &&
                    state.branchList.length <= 2 &&
                    branch.conditions.length <= 1
                  "
                  @click="removeCondition(branch, conditionIndex)"
                >
                  <template #icon>
                    <IconifyIcon
                      class="text-gray-500"
                      icon="fluent:delete-16-regular"
                    />
                  </template>
                </Button>
              </Col>
            </Row>
          </div>
          <div v-if="branch.type !== 3" class="h-6">
            <Button
              type="link"
              size="small"
              class="px-0 py-1"
              @click="addCondition(branch)"
            >
              + 添加条件
            </Button>
          </div>
        </div>
        <Handle
          :id="`${id}-source-${branch.id}`"
          type="source"
          :position="Position.Right"
          :style="{ top: `${getHandleStyle(index, branch)}px` }"
        />
      </NodeContext>
    </div>
    <Button type="link" size="small" class="px-0 py-1" @click="addBranch">
      + 添加分支
    </Button>
    <NodeVariable
      v-if="state.fieldList.length > 0"
      title-name="参数输出"
      :field-list="state.fieldList"
    />
  </DefaultNode>
</template>
