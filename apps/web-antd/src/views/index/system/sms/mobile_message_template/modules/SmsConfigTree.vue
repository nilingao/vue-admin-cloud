<script lang="ts" setup>
import type { SmsConfigEntity } from '#/api/sys/smsConfig';

import { computed, onMounted, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { Card, Empty, InputSearch, Spin, Tree } from 'ant-design-vue';

import { doSmsConfigAll } from '#/api/sys/smsConfig';

const emit = defineEmits<{
  select: [id: number | string];
}>();

const loading = ref(false);
const keyword = ref('');
const selectedKeys = ref<Array<number | string>>([]);
const configList = ref<SmsConfigEntity[]>([]);

const treeData = computed(() => {
  const keywordValue = keyword.value.trim();
  return configList.value
    .filter((item) => {
      if (!item.id || !item.configName) return false;
      return !keywordValue || item.configName.includes(keywordValue);
    })
    .map((item) => ({
      key: item.id as number | string,
      title: item.configName || '',
      raw: item,
    }));
});

async function fetch() {
  loading.value = true;
  try {
    configList.value = await doSmsConfigAll();
    const firstKey = treeData.value[0]?.key;
    if (firstKey === undefined) {
      selectedKeys.value = [];
      return;
    }
    selectedKeys.value = [firstKey];
    emit('select', firstKey);
  } finally {
    loading.value = false;
  }
}

function handleSelect(keys: Array<number | string>) {
  const firstKey = keys[0];
  if (firstKey === undefined) return;

  selectedKeys.value = [firstKey];
  emit('select', firstKey);
}

defineExpose({ fetch });

onMounted(fetch);
</script>

<template>
  <Card class="h-full" size="small">
    <template #title>
      <div class="flex items-center gap-2">
        <IconifyIcon icon="carbon:tree-view-alt" />
        <span>短信配置</span>
      </div>
    </template>
    <InputSearch
      v-model:value="keyword"
      allow-clear
      class="mb-3"
      placeholder="搜索短信配置"
    />
    <Spin :spinning="loading">
      <Tree
        v-if="treeData.length > 0"
        :selected-keys="selectedKeys"
        :tree-data="treeData"
        block-node
        @select="handleSelect"
      />
      <Empty v-else class="py-8" description="暂无短信配置" />
    </Spin>
  </Card>
</template>
