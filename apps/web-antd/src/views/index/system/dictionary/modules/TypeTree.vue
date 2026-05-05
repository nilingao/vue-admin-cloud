<script lang="ts" setup>
import type { DictionaryTypeEntity } from '#/api/sys/dictionary';

import { computed, onMounted, ref } from 'vue';

import { useAccess } from '@vben/access';
import { IconifyIcon } from '@vben/icons';

import {
  Button,
  Card,
  Dropdown,
  Empty,
  InputSearch,
  Menu,
  Spin,
  Tree,
} from 'ant-design-vue';

import { doDictionaryTypeList } from '#/api/sys/dictionary';

const emit = defineEmits<{
  edit: [id: number | string];
  remove: [id: number | string];
  select: [id: number | string];
}>();

const { hasAccessByCodes } = useAccess();
const loading = ref(false);
const keyword = ref('');
const selectedKeys = ref<Array<number | string>>([]);
const typeList = ref<DictionaryTypeEntity[]>([]);

const treeData = computed(() => {
  const keywordValue = keyword.value.trim();
  return typeList.value
    .filter((item) => !keywordValue || item.name?.includes(keywordValue))
    .map((item, index) => ({
      // 修复：确保 key 不为 undefined。优先使用 typeId，其次 id，最后使用索引作为兜底
      key: item.typeId ?? item.id ?? index,
      title: item.name,
      raw: item,
    }));
});

async function fetch() {
  loading.value = true;
  try {
    typeList.value = await doDictionaryTypeList();
    const firstKey = treeData.value[0]?.key;
    if (firstKey === undefined) {
      selectedKeys.value = [];
    } else {
      selectedKeys.value = [firstKey];
      emit('select', firstKey);
    }
  } finally {
    loading.value = false;
  }
}

function handleSelect(keys: Array<number | string>) {
  if (keys.length === 0) return;

  const firstKey = keys[0];
  if (firstKey === undefined) return;

  selectedKeys.value = keys;
  emit('select', firstKey);
}

function handleMenuClick(key: string, typeId: number | string) {
  if (key === 'edit') {
    emit('edit', typeId);
    return;
  }
  if (key === 'delete') {
    emit('remove', typeId);
  }
}

defineExpose({ fetch });

onMounted(fetch);
</script>

<template>
  <Card class="h-full" size="small">
    <template #title>
      <div class="flex items-center gap-2">
        <IconifyIcon icon="carbon:tree-view-alt" />
        <span>字典类型</span>
      </div>
    </template>
    <InputSearch
      v-model:value="keyword"
      allow-clear
      class="mb-3"
      placeholder="搜索字典类型"
    />
    <Spin :spinning="loading">
      <Tree
        v-if="treeData.length > 0"
        :selected-keys="selectedKeys"
        :tree-data="treeData"
        block-node
        @select="handleSelect"
      >
        <template #title="{ key, title }">
          <div class="flex items-center justify-between gap-2">
            <span class="min-w-0 flex-1 truncate">{{ title }}</span>
            <Dropdown :trigger="['click']">
              <Button type="text" size="small" @click.stop>
                <template #icon>
                  <IconifyIcon icon="ri:more-fill" />
                </template>
              </Button>
              <template #overlay>
                <Menu
                  @click="
                    ({ key: menuKey }) => handleMenuClick(`${menuKey}`, key)
                  "
                >
                  <Menu.Item
                    key="edit"
                    :disabled="
                      !hasAccessByCodes(['system.dictionary:update_type'])
                    "
                  >
                    编辑
                  </Menu.Item>
                  <Menu.Item
                    key="delete"
                    :disabled="
                      !hasAccessByCodes(['system.dictionary:delete_type'])
                    "
                  >
                    删除
                  </Menu.Item>
                </Menu>
              </template>
            </Dropdown>
          </div>
        </template>
      </Tree>
      <Empty v-else class="py-8" description="暂无字典类型" />
    </Spin>
  </Card>
</template>
