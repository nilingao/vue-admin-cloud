<script lang="ts" setup>
import type { CheckboxGroupEntity } from '../model';

import { ref, unref, watch } from 'vue';

import { cloneDeep } from '@vben/utils';

import { Button } from 'ant-design-vue';

import MyCheckBox from './MyCheckBox.vue';

const props = defineProps({
  treeData: {
    type: Array<CheckboxGroupEntity>,
    default: () => [],
  },
  checkedList: {
    type: Array<String>,
    default: () => [],
  },
});
const emit = defineEmits(['save']);
const checkList = ref(props.checkedList);
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
  () => props.checkedList,
  (checkedList) => {
    checkList.value = checkedList;
    // 递归循环
    checkedList.forEach((id: String) => {
      loops(dataTree.value, true, id);
      tree.value = dataTree.value;
    });
  },
);

// 切换权限监控
watch(
  () => props.treeData,
  (data) => {
    tree.value = data;
    onInit();
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
      item.checked = flag;
      item.indeterminate = false;
      // 取消选中时数组中驱除元素
      shuzulist(flag, item.id);
      if (item.parentId) {
        // 子级选中父级也选中
        const childAndParent_Select = (code: string) => {
          const parent = getItem(code) as CheckboxGroupEntity;
          if (parent.children && parent.children.length > 0) {
            const all = parent.children.every((item1) => {
              return item1.checked === true && item1.indeterminate === false;
            });
            const some = parent.children.some((item1) => {
              return item1.checked === true || item1.indeterminate === true;
            });
            if (all) {
              parent.indeterminate = false;
              parent.checked = true;
              // 取消选中时数组中驱除元素
              shuzulist(true, parent.id);
            } else if (some) {
              parent.indeterminate = true;
              parent.checked = false;
              shuzulist(false, parent.id);
            } else {
              parent.indeterminate = false;
              parent.checked = false;
              shuzulist(false, parent.id);
            }
          }
          if (parent.parentId) {
            childAndParent_Select(parent.parentId);
          }
        };
        childAndParent_Select(item.parentId);
      }
      if (item.children && item.children.length > 0) {
        // 父亲选中，子级全选中，实现全选反选
        const parentAndChild_Select = (
          data: CheckboxGroupEntity[],
          flag: boolean,
        ) => {
          data.forEach((item1) => {
            item1.checked = flag;
            item1.indeterminate = false;
            shuzulist(flag, item1.id);
            if (item1.children && item1.children.length > 0) {
              parentAndChild_Select(item1.children, flag);
            }
          });
        };
        parentAndChild_Select(item.children, flag);
      }
    }

    if (item.children && item.children.length > 0) {
      loops(item.children, flag, id);
    }
  });
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
  const cheList = [...new Set(unref(checkList))];
  if (flag) {
    if (!cheList.includes(id)) {
      cheList.push(id);
      checkList.value = cheList;
    }
  } else {
    if (cheList.includes(id)) {
      cheList.splice(cheList.indexOf(id), 1);
      checkList.value = cheList;
    }
  }
};

// 抛出选中数组方法
const handleSave = () => {
  // 只要最下级元素
  const resultArray = unref(checkList).filter((item) =>
    unref(last).includes(item),
  );
  emit('save', resultArray);
};

defineExpose({ onInit });
</script>
<template>
  <div class="flex h-full flex-col">
    <div class="flex justify-end border-b p-4">
      <Button type="primary" @click="handleSave"> 保存 </Button>
    </div>
    <div class="flex-1 overflow-auto p-4">
      <MyCheckBox :tree-data="tree" @subset="handleSubsetChange" />
    </div>
  </div>
</template>
