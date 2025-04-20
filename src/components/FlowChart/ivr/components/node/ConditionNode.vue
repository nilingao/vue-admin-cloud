<template>
  <DefaultNode
    :nodeId="props.id"
    :nodeLabel="data.label"
    :nodeWidth="500"
    :isOperate="true"
    :isSource="false"
    nodeIcon="gravity-ui:branches-down"
    iconBackground="rgb(20, 192, 255)"
  >
    <div class="grid gap-2">
      <NodeContext
        :class="`nodeContext_${index + 1}`"
        v-for="(item, index) in stats.branchList"
        :key="item?.id"
      >
        <div class="flex flex-col justify-start">
          <div class="flex justify-start items-center h-6">
            <div class="flex-grow"> {{ item.type }} </div>
            <div
              v-if="item.conditions && item.conditions.length > 1"
              class="flex-none flex justify-start"
            >
              <div style="color: #909399">符合以下</div>
              <div>
                <Select
                  v-model:value="item.condition"
                  :options="conditionOptions"
                  size="small"
                  class="w-18"
                />
              </div>
              <div style="color: #909399">条件</div>
            </div>
          </div>
          <div v-if="item.type !== 'ELSE'" class="pt-2 grid gap-2">
            <Row class="h-6" v-for="(item1, index) in item.conditions" :key="index" :gutter="8">
              <Col span="11">
                <Select v-model:value="item1.field" size="small" class="w-full">
                  <SelectOption value="1">包含</SelectOption>
                  <SelectOption value="2">任意</SelectOption>
                </Select>
              </Col>
              <Col span="6">
                <Select
                  v-model:value="item1.compare"
                  :options="branchConditionOptions"
                  size="small"
                  class="w-full"
                />
              </Col>
              <Col span="6">
                <Input v-model:value="item1.value" size="small" class="w-full" />
              </Col>
              <Col span="1">
                <Button
                  type="text"
                  size="small"
                  @click="removeCondition(item, index)"
                  :disabled="
                    item.type === 'IF' &&
                    stats.branchList.length <= 2 &&
                    item.conditions.length <= 1
                  "
                >
                  <template #icon>
                    <Icon style="color: #909399" icon="fluent:delete-16-regular" />
                  </template>
                </Button>
              </Col>
            </Row>
          </div>
          <div class="h-6" v-if="item.type !== 'ELSE'">
            <Button class="px-0! py-1!" type="link" size="small" @click="addCondition(item)"
              >+ 添加条件</Button
            >
          </div>
        </div>
        <Handle
          :id="`${id}-source-${item?.id}`"
          type="source"
          :position="Position.Right"
          :style="`top:${getHandleStyle(index, item)}px`"
        />
      </NodeContext>
    </div>
    <Button class="px-0! py-1!" type="link" size="small" @click="addBranch">+ 添加分支</Button>
    <NodeVariable
      v-if="stats.fieldList && stats.fieldList.length > 0"
      titleName="参数输出"
      :fieldList="stats.fieldList"
    />
  </DefaultNode>
</template>

<script setup lang="ts">
  // import { useVueFlow } from '@vue-flow/core';
  import { reactive, watch, onBeforeMount } from 'vue';
  import { Button, Row, Col, Select, SelectOption, Input } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { cloneDeep } from 'lodash-es';
  import {
    conditionOptions,
    branchConditionOptions,
    type ConditionNodeData,
    type NodeFields,
    type Branch,
    type BranchCondition,
  } from '../../hooks/common';
  import { useVueFlow, Handle, Position } from '@vue-flow/core';
  import NodeVariable from './components/NodeVariable.vue';
  import NodeContext from './components/NodeContext.vue';
  import DefaultNode from './components/DefaultNode.vue';

  defineOptions({ name: 'ConditionNode' });
  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    data: {
      type: Object as PropType<ConditionNodeData>,
      required: true,
    },
  });
  const { updateNode } = useVueFlow();
  const stats = reactive({
    fieldList: [] as NodeFields[],
    branchList: [] as Branch[],
    branchConditionList: [] as BranchCondition[],
  });
  const getHandleStyle = (index, item) => {
    let othHeight = 0;
    let height = 0;
    for (const item1 of stats.branchConditionList) {
      if (item1.id !== item.id) {
        othHeight = othHeight + item1.height;
        continue;
      }
      height = item1.height;
      break;
    }
    // Node标题的顶部位置
    const titleHeight = 1 + 12 + 30;
    height = height != 0 ? titleHeight + othHeight + height / 2 + 8 * index : 0;
    // 当前判断条件的高度
    return height;
  };
  // 获取当前判断条件的高度
  const getHandleHeight = (item) => {
    const conditionsCount = item?.conditions.length || 1;
    // 计算公式
    let height = 24 + 8 * 2; //默认为ELSE高度
    if (item.type !== 'ELSE') {
      //除Else外的高度
      //24 * 2 + 24 * conditionsCount + (conditionsCount > 1 ? (conditionsCount - 1) * 8 : 0) + 8 * 3
      height = 24 * (conditionsCount + 2) + 8 * (conditionsCount + 2);
    }
    return height;
  };
  const addBranch = () => {
    // 计算当前 ELSE IF 分支的数量
    const elseIfCount = stats.branchList.filter((branch) =>
      branch.type.startsWith('ELSE IF'),
    ).length;
    const newBranch = {
      id: Date.now().toString(), // 使用时间戳作为唯一 ID
      condition: 1,
      type: `ELSE IF ${elseIfCount + 1}`, // 确保 ELSE IF 的序号递增
      conditions: [
        {
          field: [],
          compare: 5,
          value: '',
        },
      ],
    };

    // 在 ELSE 分支前插入新分支
    const elseIndex = stats.branchList.findIndex((branch) => branch.type === 'ELSE');
    stats.branchList.splice(elseIndex, 0, newBranch);

    // 添加到 branchConditionList 并更新索引
    stats.branchConditionList.splice(elseIndex, 0, {
      id: newBranch.id,
      index: elseIndex,
      height: getHandleHeight(newBranch),
    });

    // 更新 branchConditionList 中的 index
    for (let i = elseIndex + 1; i < stats.branchConditionList.length; i++) {
      stats.branchConditionList[i].index = i;
    }
  };

  const addCondition = (branch) => {
    // 在分支中添加新条件
    branch.conditions.push({
      field: [],
      compare: 5,
      value: '',
    });
    // 计算新高度
    const branchHeight = getHandleHeight(branch);
    // 在 branchConditionList 中添加新条件
    stats.branchConditionList.map((item) => {
      if (item.id === branch.id) {
        item.height = branchHeight;
      }
    });
  };

  const removeCondition = (branch, index) => {
    branch.conditions.splice(index, 1);
    // 计算新高度
    const branchHeight = getHandleHeight(branch);
    // 在 branchConditionList 中添加新条件
    stats.branchConditionList.map((item) => {
      if (item.id === branch.id) {
        item.height = branchHeight;
      }
    });
    // 如果条件数组为空，删除整个分支
    if (branch.conditions.length === 0) {
      // 如果只剩下一个分支，则不能删除
      if (stats.branchList.length === 1) {
        return;
      }
      const branchIndex = stats.branchList.findIndex((b) => b.id === branch.id);
      stats.branchList.splice(branchIndex, 1);
      const conditionIndex = stats.branchConditionList.findIndex((c) => c.id === branch.id);
      // 检查 conditionIndex 是否有效
      if (conditionIndex !== -1) {
        stats.branchConditionList.splice(conditionIndex, 1);
        // 更新 branchConditionList 中的 index
        stats.branchConditionList.forEach((item, idx) => {
          item.index = idx; // 重新按照数组顺序更新 index
        });
      }
      // 如果删除的是 IF 类型的分支，确保下一个分支变为 IF
      if (branch.type === 'IF' && stats.branchList.length > 0) {
        stats.branchList[0].type = 'IF';
      }
      // 重新排序 ELSE IF 类型的分支
      let elseIfCounter = 1;
      stats.branchList.forEach((b) => {
        if (b.type.startsWith('ELSE IF')) {
          b.type = `ELSE IF ${elseIfCounter++}`;
        }
      });
    }
  };

  // 初始化时确保有 'IF' 和 'ELSE'
  if (!stats.branchList.some((b) => b.type === 'IF')) {
    stats.branchList.unshift({
      id: Date.now().toString(),
      condition: 1,
      type: 'IF',
      conditions: [],
    });
  }
  if (!stats.branchList.some((b) => b.type === 'ELSE')) {
    stats.branchList.push({
      id: Date.now().toString(),
      condition: 1,
      type: 'ELSE',
      conditions: [],
    });
  }

  watch(
    () => [stats.fieldList, stats.branchList, stats.branchConditionList],
    () => {
      // 触发父组件的更新
      const { label, config, nodeData } = props.data;
      const data = {
        label,
        config: {
          ...config,
          fields: stats.fieldList,
        },
        nodeData: {
          ...nodeData,
          branch: stats.branchList,
        },
        branchConditionList: stats.branchConditionList,
      };
      updateNode(props.id, { data });
    },
    { immediate: true, deep: true },
  );

  const initData = () => {
    const data = cloneDeep(props.data);
    stats.fieldList = data.config?.fields || [];
    const branchConditionList = data?.branchConditionList || [];
    branchConditionList.sort((a, b) => a.index - b.index);
    stats.branchConditionList = branchConditionList;
    const branchList = data.nodeData?.branch || [];

    const ifBranch = branchList.filter((branch) => branch.type === 'IF');
    const elseBranch = branchList.filter((branch) => branch.type === 'ELSE');
    const otherBranches = branchList.filter(
      (branch) => branch.type !== 'IF' && branch.type !== 'ELSE',
    );

    // 按 branchConditionList 的索引排序非 ELSE 分支
    otherBranches.sort((a, b) => {
      const indexA = branchConditionList.findIndex((item) => item.id === a.id);
      const indexB = branchConditionList.findIndex((item) => item.id === b.id);
      return indexA - indexB;
    });
    // 将 ELSE 分支放在最后
    stats.branchList = elseBranch
      ? [...ifBranch, ...otherBranches, ...elseBranch]
      : [...ifBranch, ...otherBranches];
  };

  onBeforeMount(() => {
    initData();
  });
</script>
