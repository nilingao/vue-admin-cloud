<script setup lang="ts">
import type { ToolbarConfig } from '../../types';

import { ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { useVueFlow } from '@vue-flow/core';
import { Button, Divider, Tooltip } from 'ant-design-vue';

import { ToolbarTypeEnum } from '../../types';

defineOptions({ name: 'IvrFlowChartToolbar' });

const props = withDefaults(
  defineProps<{
    vueFlowId?: string;
  }>(),
  {
    vueFlowId: 'ivr-flow-chart',
  },
);

const emit = defineEmits<{
  viewData: [];
}>();

const { fitView, setNodes, setViewport, toObject, zoomIn, zoomOut } =
  useVueFlow(props.vueFlowId);

const toolbarItemList = ref<ToolbarConfig[]>([
  {
    icon: 'codicon:zoom-out',
    tooltip: '缩小',
    type: ToolbarTypeEnum.ZOOM_OUT,
  },
  {
    icon: 'codicon:zoom-in',
    tooltip: '放大',
    type: ToolbarTypeEnum.ZOOM_IN,
  },
  { separate: true },
  {
    icon: 'codicon:git-pull-request-create',
    tooltip: '重置比例',
    type: ToolbarTypeEnum.RESET_ZOOM,
  },
  {
    icon: 'codicon:screen-normal',
    tooltip: '自适应',
    type: ToolbarTypeEnum.FIT_VIEW,
  },
  {
    icon: 'uil:arrow-random',
    tooltip: '随机排列',
    type: ToolbarTypeEnum.RANDOM_VIEW,
  },
  { separate: true },
  {
    icon: 'carbon:document-view',
    tooltip: '查看数据',
    type: ToolbarTypeEnum.VIEW_DATA,
  },
]);

function onControl(item: ToolbarConfig) {
  if (item.disabled) return;

  switch (item.type) {
    case ToolbarTypeEnum.FIT_VIEW: {
      fitView({ padding: 0.2 });
      break;
    }
    case ToolbarTypeEnum.RANDOM_VIEW: {
      const { nodes } = toObject();
      setNodes(
        nodes.map((node) => ({
          ...node,
          position: {
            x: Math.random() * 1600,
            y: Math.random() * 800,
          },
        })),
      );
      break;
    }
    case ToolbarTypeEnum.RESET_ZOOM: {
      setViewport({ x: 0, y: 0, zoom: 1 });
      break;
    }
    case ToolbarTypeEnum.VIEW_DATA: {
      emit('viewData');
      break;
    }
    case ToolbarTypeEnum.ZOOM_IN: {
      zoomIn();
      break;
    }
    case ToolbarTypeEnum.ZOOM_OUT: {
      zoomOut();
      break;
    }
  }
}
</script>

<template>
  <div class="ivr-flow-chart-toolbar">
    <template v-for="item in toolbarItemList" :key="item.type || item.tooltip">
      <Divider v-if="item.separate" type="vertical" />
      <Tooltip v-else placement="bottom" :title="item.tooltip">
        <Button
          class="ivr-flow-chart-toolbar__button"
          type="text"
          size="small"
          :disabled="item.disabled"
          @click="onControl(item)"
        >
          <template #icon>
            <IconifyIcon :icon="item.icon || ''" />
          </template>
        </Button>
      </Tooltip>
    </template>
  </div>
</template>

<style scoped>
.ivr-flow-chart-toolbar {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 8px;
  background: hsl(var(--background));
  border-bottom: 1px solid hsl(var(--border));
}

.ivr-flow-chart-toolbar__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
