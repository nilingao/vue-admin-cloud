<script lang="ts" setup>
import type { CheckboxGroupEntity } from '../model';

import { computed, ref, unref, watch } from 'vue';

import { cloneDeep } from '@vben/utils';

import { Checkbox } from 'ant-design-vue';

const props = defineProps({
  treeData: {
    type: Array<CheckboxGroupEntity>,
    default: () => [],
  },
  mode: {
    type: String,
    default: 'partial', // cascade, independent, partial
  },
  level: {
    type: Number,
    default: 0,
  },
});

const checkedList = defineModel<Array<String>>('checkedList', { default: [] });
const dataTree = ref();
const tree = ref(props.treeData);
const last = ref();

const onInit = () => {
  // 给子级添加父级Key
  // 深度克隆
  const lastv = [] as string[];
  const data = cloneDeep(props.treeData) as CheckboxGroupEntity[];
  function addParentKey(
    data: CheckboxGroupEntity[],
    parentKey: string | undefined,
  ) {
    data.forEach((ele) => {
      const { children, id } = ele;
      ele.parentId = parentKey;
      ele.indeterminate = false;
      ele.checked = false;
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
};

// 切换权限监控
watch(
  () => checkedList.value,
  (list: String[]) => {
    if (!list) return;
    list.forEach((id: String) => {
      loops(dataTree.value, true, id);
      tree.value = dataTree.value;
    });
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
    onInit();
  },
  {
    deep: true,
    immediate: true,
  },
);

// 点击复选框触发
const handleSubsetChange = async ({ flag, id }: any) => {
  await loops(dataTree.value, flag, id);
  tree.value = dataTree.value;
};

// 递归循环
const loops = (data: CheckboxGroupEntity[], flag: boolean, id: String) => {
  data.forEach((item) => {
    if (item.id === id) {
      switch (props.mode) {
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

    if (item.children && item.children.length > 0) {
      loops(item.children, flag, id);
    }
  });
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
  if (flag) {
    item.checked = true;
    shuzulist(true, item.id);
    // 全选子级
    selectAllChildren(item, true);
    // 递归选中父级
    if (item.parentId) {
      const parent = getItem(item.parentId);
      if (parent) {
        handleCascade(parent, true);
      }
    }
  } else {
    item.checked = false;
    shuzulist(false, item.id);
    // 全取消子级
    selectAllChildren(item, false);
    // 递归取消父级
    if (item.parentId) {
      const parent = getItem(item.parentId);
      if (parent && !hasCheckedChildren(parent)) {
        handleCascade(parent, false);
      }
    }
  }
};

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
  let value: CheckboxGroupEntity | undefined;
  const loops = (data: CheckboxGroupEntity[], code: string) => {
    data.forEach((item) => {
      if (item.id === code) {
        value = item;
      }
      if (item.children && item.children.length > 0) {
        loops(item.children, code);
      }
    });
  };
  loops(unref(dataTree), id);
  return value;
};

// 数组新增元素删除元素去重
const shuzulist = (flag: boolean, id: string) => {
  const cheList = [...new Set(unref(checkedList))];
  if (flag) {
    if (!cheList.includes(id)) {
      cheList.push(id);
      checkedList.value = cheList;
    }
  } else {
    if (cheList.includes(id)) {
      cheList.splice(cheList.indexOf(id), 1);
      checkedList.value = cheList;
    }
  }
};

defineExpose({ onInit });

const treedata = computed(() => {
  return tree.value || props.treeData;
});

const isButtonLevel = computed(() => {
  return treedata.value.every((item) => item.type === 3);
});

const subChange = (e: any, id: any) => {
  const flag = e.target.checked;
  handleSubsetChange({ flag, id });
};

const updateCheckedList = (list: Array<String>) => {
  checkedList.value = list;
};
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex-1 overflow-auto p-4">
      <!-- 如果当前层级都是按钮，横向排列 -->
      <div v-if="isButtonLevel" class="flex flex-row gap-4 pb-2 pl-6">
        <div v-for="value in treedata" :key="value.id">
          <Checkbox
            class="select-none"
            :value="value.id"
            :indeterminate="value.indeterminate"
            v-model:checked="value.checked"
            @change="(e) => subChange(e, value.id)"
          >
            {{ value.menuName }}
          </Checkbox>
        </div>
      </div>

      <!-- 否则，纵向排列每个项 -->
      <div v-else>
        <div
          v-for="value in treedata"
          :key="value.id"
          class="flex flex-col"
          :class="{ 'pl-6': value.parentId }"
        >
          <div class="pb-2">
            <Checkbox
              class="select-none"
              :value="value.id"
              :indeterminate="value.indeterminate"
              v-model:checked="value.checked"
              @change="(e) => subChange(e, value.id)"
            >
              {{ value.menuName }}
            </Checkbox>
          </div>
          <MyCheckBox
            v-if="value.children && value.children.length > 0"
            :tree-data="value.children"
            :checked-list="checkedList"
            @update:checked-list="updateCheckedList"
            :mode="mode"
            :level="level + 1"
          />
        </div>
      </div>
    </div>
  </div>
</template>
