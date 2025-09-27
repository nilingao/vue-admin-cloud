<script lang="ts" setup>
import type { CheckboxGroupEntity } from '../model';

import { ref, unref, watch } from 'vue';

import { cloneDeep } from '@vben/utils';

import { Button, Radio } from 'ant-design-vue';

import MyCheckBox from './MyCheckBox.vue';

const props = defineProps({
  treeData: {
    type: Array<CheckboxGroupEntity>,
    default: () => [],
  },
  showSave: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['save']);
const checkedList = defineModel<Array<string>>('checkedList', { default: [] });
const dataTree = ref();
const mode = ref('partial'); // cascade, independent, partial
const tree = ref(props.treeData);
const last = ref();
const isInternal = ref(false);
const selected = ref(new Set(unref(checkedList)));
const idMap = ref(new Map<string, CheckboxGroupEntity>());
const onInit = () => {
  // 给子级添加父级Key
  // 深度克隆
  const lastv = [] as string[];
  const data = cloneDeep(props.treeData) as CheckboxGroupEntity[];
  const map = new Map<string, CheckboxGroupEntity>();
  function addParentKey(
    data: CheckboxGroupEntity[],
    parentKey: string | undefined,
  ) {
    data.forEach((ele) => {
      const { children, id } = ele;
      ele.parentId = parentKey;
      ele.indeterminate = false;
      ele.checked = false;
      map.set(id, ele);
      if (children) {
        // 如果唯一标识不是code可以自行改变
        addParentKey(children, ele.id);
      } else {
        lastv.push(id);
        last.value = lastv;
      }
    });
  }
  addParentKey(data, undefined); // 一开始为undefined,根节点没有父级
  dataTree.value = data;
  tree.value = unref(dataTree);
  idMap.value = map;
};
// 切换权限监控
watch(
  () => checkedList.value,
  (list) => {
    if (isInternal.value) return;
    isInternal.value = true;
    selected.value = new Set(list);
    onInit(); // 重置tree
    list.forEach((id: string) => {
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

// 切换权限监控
watch(
  () => props.treeData,
  (data) => {
    tree.value = data;
    selected.value = new Set(unref(checkedList));
    onInit();
  },
  {
    deep: true,
    immediate: true,
  },
);

// 点击复选框触发
const handleSubsetChange = async ({ flag, id }: any) => {
  await loops(flag, id);
  tree.value = unref(dataTree);
  isInternal.value = true;
  checkedList.value = [...selected.value];
  isInternal.value = false;
};

// 递归循环
const loops = (flag: boolean, id: string) => {
  const item = unref(idMap).get(id);
  if (item) {
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
};

// 检查子级是否有选中项
const hasCheckedChildren = (item: CheckboxGroupEntity): boolean => {
  if (item.children && item.children.length > 0) {
    return item.children.some(
      (child) => child.checked || hasCheckedChildren(child),
    );
  }
  return false;
};

// 全选子级
const selectAllChildren = (item: CheckboxGroupEntity, flag: boolean) => {
  if (item.children) {
    item.children.forEach((child) => {
      child.checked = flag;
      child.indeterminate = false;
      shuzulist(flag, child.id);
      selectAllChildren(child, flag);
    });
  }
};

// 父子联动模式逻辑
const handleCascade = (item: CheckboxGroupEntity, flag: boolean) => {
  // 标记当前节点
  item.checked = flag;
  item.indeterminate = false;
  shuzulist(flag, item.id);

  if (flag) {
    // 选中时仅处理其子节点，不处理父节点
    if (item.children && item.children.length > 0) {
      // 选中所有子节点
      selectAllChildren(item, true);
    }
  } else {
    // 取消选中时，如果有子节点则取消选中所有子节点
    if (item.children && item.children.length > 0) {
      selectAllChildren(item, false);
    }
  }

  // 不论选中还是取消，都仅更新父节点状态，不改变父节点选中状态
  if (item.parentId) {
    updateCascadeParentOnly(item.parentId);
  }
};

// 仅更新父节点状态，不改变其他子节点
const updateCascadeParentOnly = (parentId: string) => {
  const parent = getItem(parentId);
  if (parent && parent.children && parent.children.length > 0) {
    // 检查所有直接子节点的状态
    const allChecked = parent.children.every((child) => child.checked);
    const someChecked = parent.children.some(
      (child) => child.checked || child.indeterminate,
    );

    if (allChecked) {
      // 所有子节点选中，父节点应该是全选中状态
      parent.checked = true;
      parent.indeterminate = false;
      shuzulist(true, parent.id);
    } else if (someChecked) {
      // 部分子节点选中，父节点半选
      parent.checked = false;
      parent.indeterminate = true;
      shuzulist(false, parent.id);
    } else {
      // 没有子节点选中，父节点取消选中
      parent.checked = false;
      parent.indeterminate = false;
      shuzulist(false, parent.id);
    }

    // 递归更新更上层的父节点
    if (parent.parentId) {
      updateCascadeParentOnly(parent.parentId);
    }
  }
};

// 此处已删除旧的updateParentCascadeState函数

// 独立模式逻辑
const handleIndependent = (item: CheckboxGroupEntity, flag: boolean) => {
  item.checked = flag;
  if (flag) {
    shuzulist(true, item.id);
  } else {
    shuzulist(false, item.id);
  }
};

// 部分联动模式逻辑（当前）
const handlePartial = (item: CheckboxGroupEntity, flag: boolean) => {
  if (flag) {
    item.checked = true;
    shuzulist(true, item.id);
    if (item.parentId) {
      updateParentState(item.parentId);
    }
  } else {
    if (item.children && hasCheckedChildren(item)) {
      item.checked = true;
      return;
    }
    item.checked = false;
    shuzulist(false, item.id);
    if (item.parentId) {
      updateParentState(item.parentId);
    }
  }
};

// 更新父级状态
const updateParentState = (parentId: string) => {
  if (parentId) {
    const parent = getItem(parentId);
    if (parent && parent.children && parent.children.length > 0) {
      const all = parent.children.every((child) => child.checked);
      const some = parent.children.some(
        (child) => child.checked || child.indeterminate,
      );

      if (all) {
        parent.checked = true;
        parent.indeterminate = false;
        shuzulist(true, parent.id);
      } else if (some) {
        parent.checked = false;
        parent.indeterminate = true;
        shuzulist(false, parent.id);
      } else {
        parent.checked = false;
        parent.indeterminate = false;
        shuzulist(false, parent.id);
      }

      if (parent.parentId) {
        updateParentState(parent.parentId);
      }
    }
  }
};

// 根据code(唯一标识)找到其值
const getItem = (id: string) => {
  return unref(idMap).get(id);
};

// 数组新增元素删除元素去重
const shuzulist = (flag: boolean, id: string) => {
  if (flag) {
    selected.value.add(id);
  } else {
    selected.value.delete(id);
  }
};

// 抛出选中数组方法
const handleSave = () => {
  // 只要最下级元素
  const resultArray = unref(checkedList).filter((item) =>
    unref(last).includes(item),
  );
  emit('save', resultArray);
};

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
