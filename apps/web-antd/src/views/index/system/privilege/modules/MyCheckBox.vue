<script lang="ts" setup>
import type { CheckboxGroupEntity } from '../model';

import { computed } from 'vue';

import { Checkbox } from 'ant-design-vue';

const props = defineProps({
  treeData: {
    type: Array<CheckboxGroupEntity>,
    default: [],
  },
});

const emit = defineEmits(['subset']);

const treedata = computed(() => {
  return props.treeData;
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
  <template v-for="value in treedata">
    <div
      class="ml-10 flex flex-col content-around pt-4"
      v-if="value.type !== 3"
      :key="value.id"
    >
      <div class="pr-6">
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
      <MyCheckBox :tree-data="value.children" @subset="subChan" />
    </div>
    <template v-else>
      <div class="pr-6" :key="value.id">
        <Checkbox
          class="select-none"
          :value="value.id"
          v-model:checked="value.checked"
          :indeterminate="value.indeterminate"
          @change="(e) => subChange(e, value.id)"
        >
          {{ value.menuName }}
        </Checkbox>
      </div>
    </template>
  </template>
</template>
