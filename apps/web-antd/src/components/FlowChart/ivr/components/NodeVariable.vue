<script setup lang="ts">
import type { NodeFields } from '../types';

import { IconifyIcon } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import NodeContext from './NodeContext.vue';

defineOptions({ name: 'IvrNodeVariable' });

withDefaults(
  defineProps<{
    fieldList?: NodeFields[];
    isPt?: boolean;
    isTip?: boolean;
    tipContext?: string;
    titleName?: string;
  }>(),
  {
    fieldList: () => [],
    isPt: true,
    isTip: false,
    tipContext: '',
    titleName: '变量',
  },
);

async function copyVariable(item: NodeFields) {
  try {
    await navigator.clipboard.writeText(item.globeLabel);
    message.success('复制成功');
  } catch {
    message.error('复制失败');
  }
}

function formatVariable(item: NodeFields) {
  return `${item.label} {${item.value}}`;
}
</script>

<template>
  <NodeContext
    :class="isPt ? 'pt-2' : ''"
    :is-context="false"
    is-title
    :title-name="titleName"
    :is-tip="isTip"
    :tip-context="tipContext"
  />
  <div class="grid gap-2">
    <NodeContext v-for="item in fieldList" :key="item.value">
      <div class="group flex items-center">
        <div class="flex-1">
          <span class="text-sm" v-text="formatVariable(item)"></span>
        </div>
        <Button
          class="hidden size-5 items-center justify-center p-0 group-hover:inline-flex"
          type="text"
          size="small"
          @click="copyVariable(item)"
        >
          <template #icon>
            <IconifyIcon icon="akar-icons:copy" />
          </template>
        </Button>
      </div>
    </NodeContext>
  </div>
</template>
