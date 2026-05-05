<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { computed, onMounted, ref, watch } from 'vue';

import { Empty, message, Spin, Transfer } from 'ant-design-vue';

import {
  doPlatformChannelBindKey,
  doPlatformGbChannelDelete,
  doPlatformGbChannelInsert,
  doPlatformGbChannelList,
  doPlatformGbStreamDelete,
  doPlatformGbStreamInsert,
  doPlatformGbStreamList,
  doPlatformStreamBindKey,
} from '#/api/video/platform';

const props = defineProps<{
  activeKey: 'gbChannel' | 'gbStream';
  catalogId?: string;
  serverGbId?: string;
}>();

interface TransferItem extends Recordable<any> {
  disabled?: boolean;
  key: string;
  title: string;
}

const loading = ref(false);
const dataSource = ref<TransferItem[]>([]);
const allGbIdList = ref<string[]>([]);
const targetKeys = ref<string[]>([]);

const tabConfig = computed(() => {
  if (props.activeKey === 'gbStream') {
    return {
      bindApi: doPlatformStreamBindKey,
      deleteApi: doPlatformGbStreamDelete,
      insertApi: doPlatformGbStreamInsert,
      listApi: doPlatformGbStreamList,
      rowKey: 'gbId',
      title: '国标流',
    };
  }

  return {
    bindApi: doPlatformChannelBindKey,
    deleteApi: doPlatformGbChannelDelete,
    insertApi: doPlatformGbChannelInsert,
    listApi: doPlatformGbChannelList,
    rowKey: 'id',
    title: '国标通道',
  };
});

function flatten(list: Recordable<any>[]): Recordable<any>[] {
  return list.flatMap((item) => {
    const { children, ...rest } = item;
    return children ? [rest, ...flatten(children)] : [rest];
  });
}

async function fetchList() {
  const config = tabConfig.value;
  const list = await config.listApi();
  dataSource.value = flatten(list).map((item) => {
    const key = String(item[config.rowKey] ?? '');
    const name = item.name ?? item.channelName ?? item.stream ?? key;
    return {
      ...item,
      disabled:
        allGbIdList.value.includes(key) && !targetKeys.value.includes(key),
      key,
      title: `${key}${name && name !== key ? ` - ${name}` : ''}`,
    };
  });
}

async function fetchBind() {
  if (!props.serverGbId || !props.catalogId) {
    allGbIdList.value = [];
    targetKeys.value = [];
    return;
  }

  const data = await tabConfig.value.bindApi({
    catalogId: props.catalogId,
    isSub: 0,
    platformId: props.serverGbId,
  });
  allGbIdList.value = (data.allGbIdList ?? []).map(String);
  targetKeys.value = (data.useCatalogGbIdList ?? []).map(String);
}

async function refresh() {
  loading.value = true;
  try {
    await fetchBind();
    await fetchList();
  } finally {
    loading.value = false;
  }
}

async function handleChange(
  _nextTargetKeys: string[],
  direction: 'left' | 'right',
  moveKeys: string[],
) {
  if (!props.serverGbId || !props.catalogId) {
    message.warning('请先选择目录');
    return;
  }

  const params = {
    catalogId: props.catalogId,
    gbIdList: moveKeys,
    isAll: 0,
    isSub: 0,
    platformId: props.serverGbId,
  };

  await (direction === 'right'
    ? tabConfig.value.insertApi(params)
    : tabConfig.value.deleteApi(params));
  await refresh();
}

watch(
  () => [props.activeKey, props.catalogId, props.serverGbId],
  () => {
    refresh();
  },
);

onMounted(refresh);

defineExpose({ refresh });
</script>

<template>
  <Spin :spinning="loading">
    <Transfer
      v-if="serverGbId && catalogId"
      :data-source="dataSource"
      :list-style="{ height: '460px', width: '45%' }"
      :render="(item) => item.title"
      :show-select-all="false"
      :target-keys="targetKeys"
      :titles="[`可选${tabConfig.title}`, `已绑定${tabConfig.title}`]"
      show-search
      @change="handleChange"
    />
    <Empty v-else class="py-20" description="请选择左侧目录" />
  </Spin>
</template>
