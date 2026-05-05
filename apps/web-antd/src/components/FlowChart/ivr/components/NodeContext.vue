<script setup lang="ts">
import { IconifyIcon } from '@vben/icons';

import { Button, Tooltip } from 'ant-design-vue';

defineOptions({ name: 'IvrNodeContext' });

withDefaults(
  defineProps<{
    isContext?: boolean;
    isMore?: boolean;
    isTip?: boolean;
    isTitle?: boolean;
    moreIcon?: string;
    tipContext?: string;
    titleName?: string;
  }>(),
  {
    isContext: true,
    isMore: false,
    isTip: false,
    isTitle: false,
    moreIcon: 'ri:more-fill',
    tipContext: '',
    titleName: '',
  },
);

const emit = defineEmits<{
  more: [];
}>();
</script>

<template>
  <div class="ivr-node-context">
    <div v-if="isTitle && titleName" class="ivr-node-context__label">
      <div class="ivr-node-context__label-name">
        <span class="text-sm font-medium antialiased">{{ titleName }}</span>
        <Tooltip v-if="isTip" placement="top">
          <template #title>{{ tipContext }}</template>
          <IconifyIcon
            class="ml-1 cursor-pointer text-gray-400"
            icon="ic:baseline-help-outline"
          />
        </Tooltip>
      </div>
      <Button v-if="isMore" type="text" size="small" @click="emit('more')">
        <template #icon>
          <IconifyIcon class="text-blue-500" :icon="moreIcon" />
        </template>
      </Button>
    </div>
    <div v-if="isContext" class="ivr-node-context__content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.ivr-node-context__label {
  position: relative;
  display: flex;
  padding-left: 12px;
  margin-bottom: 8px;
}

.ivr-node-context__label::before {
  position: absolute;
  top: 50%;
  left: 2px;
  width: 2px;
  height: 80%;
  content: '';
  background: #3370ff;
  transform: translate(-50%, -50%);
}

.ivr-node-context__label-name {
  display: flex;
  flex: 1;
  align-items: center;
}

.ivr-node-context__content {
  padding: 8px 12px;
  background: #f5f6f7;
  border-radius: 4px;
}
</style>
