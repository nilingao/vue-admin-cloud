<script lang="ts" setup>
import type { CheckboxGroupEntity } from '../model';

import { computed } from 'vue';

import { Checkbox } from 'ant-design-vue';

const props = defineProps({
  treeData: {
    type: Array<CheckboxGroupEntity>,
    default: [],
  },
  level: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['subset']);

const treedata = computed(() => {
  return props.treeData;
});

const isButtonLevel = computed(() => {
  return props.treeData.every((item) => item.type === 3);
});

const subChange = (e: any, v: any) => {
  const flag = e.target.checked;
  emit('subset', { flag, v });
};

const subChan = (v: any) => {
  emit('subset', v);
};
</script>

<template>
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
        :level="level + 1"
        @subset="subChan"
      />
    </div>
  </div>
</template>
