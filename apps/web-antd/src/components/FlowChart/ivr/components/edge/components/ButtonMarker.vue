<script setup lang="ts">
import { IconifyIcon } from '@vben/icons';

import { Button } from 'ant-design-vue';

defineOptions({ name: 'IvrButtonMarker' });

defineProps<{
  edgeCenterX: number;
  edgeCenterY: number;
}>();

const emit = defineEmits<{
  delete: [];
}>();

const foreignObjectSize = 40;

function handleDelete(event: MouseEvent) {
  event.stopPropagation();
  emit('delete');
}
</script>

<template>
  <foreignObject
    class="ivr-button-marker"
    :height="foreignObjectSize"
    :width="foreignObjectSize"
    :x="edgeCenterX - foreignObjectSize / 2"
    :y="edgeCenterY - foreignObjectSize / 2"
    requiredExtensions="http://www.w3.org/1999/xhtml"
  >
    <div class="ivr-button-marker__inner">
      <Button
        class="ivr-button-marker__button"
        type="text"
        size="small"
        @click="handleDelete"
      >
        <template #icon>
          <IconifyIcon icon="fluent:delete-16-regular" />
        </template>
      </Button>
    </div>
  </foreignObject>
</template>

<style scoped>
.ivr-button-marker__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
}

.ivr-button-marker__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px !important;
  height: 22px !important;
  padding: 0 !important;
  color: #6b7280;
  cursor: pointer;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 50% !important;
  box-shadow: 0 2px 6px rgb(15 23 42 / 12%);
}

.ivr-button-marker__button:hover {
  color: #fff !important;
  background: #1677ff !important;
  border-color: #1677ff !important;
}
</style>
