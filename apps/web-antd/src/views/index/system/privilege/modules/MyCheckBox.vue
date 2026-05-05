<script lang="ts" setup>
import type { CheckboxGroupEntity } from '../model';

import { computed } from 'vue';

import { Checkbox } from 'ant-design-vue';

const props = defineProps({
  level: {
    default: 0,
    type: Number,
  },
  treeData: {
    default: () => [],
    type: Array<CheckboxGroupEntity>,
  },
});

const emit = defineEmits<{
  subset: [payload: { flag: boolean; id: string }];
}>();

const treedata = computed(() => props.treeData);

const isButtonLevel = computed(() =>
  props.treeData.every((item) => item.type === 3),
);

function subChange(e: any, id: string) {
  const flag = e.target.checked;
  emit('subset', { flag, id });
}
</script>

<template>
  <div v-if="isButtonLevel" class="flex flex-row gap-4 pb-2 pl-6">
    <div v-for="value in treedata" :key="value.id">
      <Checkbox
        v-model:checked="value.checked"
        class="select-none"
        :indeterminate="value.indeterminate"
        :value="value.id"
        @change="(e) => subChange(e, value.id)"
      >
        {{ value.menuName }}
      </Checkbox>
    </div>
  </div>

  <div v-else>
    <div
      v-for="value in treedata"
      :key="value.id"
      class="flex flex-col"
      :class="{ 'pl-6': value.parentId }"
    >
      <div class="pb-2">
        <Checkbox
          v-model:checked="value.checked"
          class="select-none"
          :indeterminate="value.indeterminate"
          :value="value.id"
          @change="(e) => subChange(e, value.id)"
        >
          {{ value.menuName }}
        </Checkbox>
      </div>
      <MyCheckBox
        v-if="value.children?.length > 0"
        :level="level + 1"
        :tree-data="value.children"
        @subset="$emit('subset', $event)"
      />
    </div>
  </div>
</template>
