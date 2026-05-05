<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { computed } from 'vue';

import { VbenTree } from '@vben-core/shadcn-ui';

import { Transfer } from 'ant-design-vue';

const emit = defineEmits(['change']);
const modelValue = defineModel<[string[], string[]]>({
  default: () => [[], []],
});

function getNodeClass(node: Recordable<any>) {
  const classes: string[] = [];
  if (node.value?.type === 'button') {
    classes.push('inline-flex');
    if (node.index % 3 >= 1) {
      classes.push('!pl-0');
    }
  }

  return classes.join(' ');
}

const treeData = computed(() => {
  return handleTreeData(modelValue.value[1], modelValue.value[0]);
});

const dataSource = computed(() => {
  return handleSourceData(modelValue.value[1]);
});

const handleTreeData = (data: any[], targetKeys: string[]) => {
  const tree = [] as any[];
  data.forEach((item) => {
    let tree1;
    if (item.children) {
      tree1 = handleTreeData(item.children, targetKeys);
    }
    tree.push({
      ...item,
      disabled: targetKeys.includes(item.key),
      children: tree1,
    });
  });
  return tree;
};

const handleSourceData = (data: any) => {
  const transferDataSource = [] as any;
  data.forEach((item: any) => {
    const { children, ...obj } = item;
    let entity = [];
    if (children) {
      entity = handleSourceData(children);
    }
    transferDataSource.push(obj, ...entity);
  });
  return transferDataSource;
};

const onChecked = (item: any, onItemSelect: (n: any, c: boolean) => void) => {
  const { bind } = item;
  onItemSelect(item.key, bind.isSelected);
};

const onChange = (keys: string[]) => {
  modelValue.value = [keys, modelValue.value[1]];
  emit('change', modelValue.value);
};
</script>

<template>
  <Transfer
    :data-source="dataSource"
    :target-keys="modelValue[0]"
    :render="(item) => item.title"
    :show-select-all="false"
    @change="onChange"
  >
    <template #children="{ direction, selectedKeys, onItemSelect }">
      <VbenTree
        v-if="direction === 'left'"
        :tree-data="treeData"
        :default-value="[...selectedKeys, ...modelValue[0]]"
        multiple
        :default-expanded-level="2"
        :get-node-class="getNodeClass"
        value-field="key"
        label-field="title"
        @select="
          (item: any) => {
            onChecked(item, onItemSelect);
          }
        "
      />
    </template>
  </Transfer>
</template>
