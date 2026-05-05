<script lang="ts" setup>
import type { CheckboxGroupEntity } from '../model';

import { ref, unref, watch } from 'vue';

import { cloneDeep } from '@vben/utils';

import { Button, Radio } from 'ant-design-vue';

import MyCheckBox from './MyCheckBox.vue';

const props = defineProps({
  showSave: {
    default: false,
    type: Boolean,
  },
  treeData: {
    default: () => [],
    type: Array<CheckboxGroupEntity>,
  },
});

const emit = defineEmits<{
  save: [ids: string[]];
}>();

const checkedList = defineModel<string[]>('checkedList', { default: [] });
const dataTree = ref<CheckboxGroupEntity[]>([]);
const mode = ref('partial');
const tree = ref<CheckboxGroupEntity[]>([]);
const last = ref<string[]>([]);
const isInternal = ref(false);
const selected = ref(new Set(unref(checkedList)));
const idMap = ref(new Map<string, CheckboxGroupEntity>());

function onInit() {
  const lastIds: string[] = [];
  const data = cloneDeep(props.treeData) as CheckboxGroupEntity[];
  const map = new Map<string, CheckboxGroupEntity>();

  function addParentKey(
    nodes: CheckboxGroupEntity[],
    parentKey: string | undefined,
  ) {
    nodes.forEach((node) => {
      const { children, id } = node;
      node.parentId = parentKey;
      node.indeterminate = false;
      node.checked = false;
      map.set(id, node);
      if (children?.length > 0) {
        addParentKey(children, id);
      } else {
        lastIds.push(id);
      }
    });
  }

  addParentKey(data, undefined);
  last.value = lastIds;
  dataTree.value = data;
  tree.value = unref(dataTree);
  idMap.value = map;
}

watch(
  () => checkedList.value,
  (list) => {
    if (isInternal.value) return;
    isInternal.value = true;
    selected.value = new Set(list);
    onInit();
    list.forEach((id) => {
      loops(true, id);
    });
    tree.value = unref(dataTree);
    isInternal.value = false;
  },
  {
    deep: true,
    immediate: true,
  },
);

watch(
  () => props.treeData,
  () => {
    selected.value = new Set(unref(checkedList));
    onInit();
  },
  {
    deep: true,
    immediate: true,
  },
);

async function handleSubsetChange({ flag, id }: any) {
  await loops(flag, id);
  tree.value = unref(dataTree);
  isInternal.value = true;
  checkedList.value = [...selected.value];
  isInternal.value = false;
}

function loops(flag: boolean, id: string) {
  const item = unref(idMap).get(id);
  if (!item) return;

  switch (mode.value) {
    case 'cascade': {
      handleCascade(item, flag);
      break;
    }
    case 'independent': {
      handleIndependent(item, flag);
      break;
    }
    default: {
      handlePartial(item, flag);
      break;
    }
  }
}

function hasCheckedChildren(item: CheckboxGroupEntity): boolean {
  if (item.children?.length > 0) {
    return item.children.some(
      (child) => child.checked || hasCheckedChildren(child),
    );
  }
  return false;
}

function selectAllChildren(item: CheckboxGroupEntity, flag: boolean) {
  if (!item.children) return;

  item.children.forEach((child) => {
    child.checked = flag;
    child.indeterminate = false;
    updateSelected(flag, child.id);
    selectAllChildren(child, flag);
  });
}

function handleCascade(item: CheckboxGroupEntity, flag: boolean) {
  item.checked = flag;
  item.indeterminate = false;
  updateSelected(flag, item.id);
  if (item.children?.length > 0) {
    selectAllChildren(item, flag);
  }
  if (item.parentId) {
    updateCascadeParentOnly(item.parentId);
  }
}

function updateCascadeParentOnly(parentId: string) {
  const parent = getItem(parentId);
  if (!parent?.children?.length) return;

  const allChecked = parent.children.every((child) => child.checked);
  const someChecked = parent.children.some(
    (child) => child.checked || child.indeterminate,
  );

  if (allChecked) {
    parent.checked = true;
    parent.indeterminate = false;
    updateSelected(true, parent.id);
  } else if (someChecked) {
    parent.checked = false;
    parent.indeterminate = true;
    updateSelected(false, parent.id);
  } else {
    parent.checked = false;
    parent.indeterminate = false;
    updateSelected(false, parent.id);
  }

  if (parent.parentId) {
    updateCascadeParentOnly(parent.parentId);
  }
}

function handleIndependent(item: CheckboxGroupEntity, flag: boolean) {
  item.checked = flag;
  updateSelected(flag, item.id);
}

function handlePartial(item: CheckboxGroupEntity, flag: boolean) {
  if (flag) {
    item.checked = true;
    updateSelected(true, item.id);
    if (item.parentId) {
      updateParentState(item.parentId);
    }
    return;
  }

  if (item.children?.length > 0 && hasCheckedChildren(item)) {
    item.checked = true;
    return;
  }

  item.checked = false;
  updateSelected(false, item.id);
  if (item.parentId) {
    updateParentState(item.parentId);
  }
}

function updateParentState(parentId: string) {
  const parent = getItem(parentId);
  if (!parent?.children?.length) return;

  const all = parent.children.every((child) => child.checked);
  const some = parent.children.some(
    (child) => child.checked || child.indeterminate,
  );

  if (all) {
    parent.checked = true;
    parent.indeterminate = false;
    updateSelected(true, parent.id);
  } else if (some) {
    parent.checked = false;
    parent.indeterminate = true;
    updateSelected(false, parent.id);
  } else {
    parent.checked = false;
    parent.indeterminate = false;
    updateSelected(false, parent.id);
  }

  if (parent.parentId) {
    updateParentState(parent.parentId);
  }
}

function getItem(id: string) {
  return unref(idMap).get(id);
}

function updateSelected(flag: boolean, id: string) {
  if (flag) {
    selected.value.add(id);
  } else {
    selected.value.delete(id);
  }
}

function handleSave() {
  const resultArray = unref(checkedList).filter((item) =>
    unref(last).includes(item),
  );
  emit('save', resultArray);
}

defineExpose({ onInit });
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center justify-between border-b p-4">
      <Radio.Group v-model:value="mode" button-style="solid">
        <Radio.Button value="cascade">父子联动</Radio.Button>
        <Radio.Button value="independent">父子不联动</Radio.Button>
        <Radio.Button value="partial">部分联动</Radio.Button>
      </Radio.Group>
      <Button v-if="showSave" type="primary" @click="handleSave"> 保存 </Button>
    </div>

    <div class="flex-1 overflow-auto p-4">
      <MyCheckBox :tree-data="tree" @subset="handleSubsetChange" />
    </div>
  </div>
</template>
