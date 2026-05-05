<script setup lang="ts">
import { IconifyIcon } from '@vben/icons';

import { Handle, Position, useVueFlow } from '@vue-flow/core';
import { Button, Card, CardMeta, Dropdown, Menu } from 'ant-design-vue';

defineOptions({ name: 'IvrDefaultNode' });

const props = withDefaults(
  defineProps<{
    iconBackground?: string;
    isOperate?: boolean;
    isSource?: boolean;
    isTarget?: boolean;
    nodeIcon?: string;
    nodeId: string;
    nodeLabel?: string;
    nodeWidth?: number;
  }>(),
  {
    iconBackground: 'rgb(209 54 209)',
    isOperate: false,
    isSource: true,
    isTarget: true,
    nodeIcon: 'hugeicons:start-up-02',
    nodeLabel: '节点标题',
    nodeWidth: 300,
  },
);

const emit = defineEmits<{
  cope: [nodeId: string];
}>();

const { removeNodes } = useVueFlow();

function handleMenuClick({ key }: { key: string }) {
  if (key === 'del') {
    removeNodes([props.nodeId]);
    return;
  }
  if (key === 'cope') {
    emit('cope', `${Date.now()}`);
  }
}
</script>

<template>
  <slot v-if="isTarget" name="target">
    <Handle :id="`${nodeId}-target`" type="target" :position="Position.Left" />
  </slot>
  <Card
    class="ivr-default-node"
    hoverable
    size="small"
    :style="{ width: `${nodeWidth}px` }"
  >
    <CardMeta class="ivr-default-node__meta">
      <template #avatar>
        <span
          class="ivr-default-node__icon"
          :style="{ background: iconBackground }"
        >
          <IconifyIcon :icon="nodeIcon" />
        </span>
      </template>
      <template #title>
        <div class="ivr-default-node__title">
          <span class="truncate">{{ nodeLabel }}</span>
        </div>
        <div v-if="isOperate" class="ivr-default-node__operate">
          <Dropdown :arrow="{ pointAtCenter: true }" placement="bottom">
            <Button type="text" size="small">
              <template #icon>
                <IconifyIcon icon="ri:more-fill" class="text-lg" />
              </template>
            </Button>
            <template #overlay>
              <Menu @click="handleMenuClick">
                <Menu.Item key="cope">复制</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="del">删除</Menu.Item>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </template>
    </CardMeta>
    <div class="ivr-default-node__content">
      <slot></slot>
    </div>
  </Card>
  <slot v-if="isSource" name="source">
    <Handle :id="`${nodeId}-source`" type="source" :position="Position.Right" />
  </slot>
</template>

<style scoped>
.ivr-default-node {
  min-width: 300px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 14px rgb(15 23 42 / 8%);
}

.ivr-default-node__meta {
  margin: 0 0 6px !important;
}

.ivr-default-node__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #fff;
  border-radius: 4px;
}

.ivr-default-node__title {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
}

.ivr-default-node__operate {
  flex: none;
  margin-left: 8px;
}

.ivr-default-node__content {
  min-height: 24px;
}

:deep(.ant-card-meta-avatar) {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  padding-inline-end: 6px;
}

:deep(.ant-card-meta-detail) {
  flex-grow: 1;
  min-width: 0;
}

:deep(.ant-card-meta-title) {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0 !important;
}
</style>
