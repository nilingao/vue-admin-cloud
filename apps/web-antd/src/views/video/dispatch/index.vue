<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';

import { computed, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useAccessStore } from '@vben/stores';

import { Button, Empty, InputSearch, message, Tree } from 'ant-design-vue';

import { doTreeDeviceChannel } from '#/api/video/deviceChannel';
import { doPlayStart } from '#/api/video/play';
import { VideoJessibucaPlay } from '#/components/Video';

interface ChannelTreeNode {
  channelId?: string;
  children?: ChannelTreeNode[];
  deviceId?: string;
  id?: string;
  isChildren?: boolean;
  key: string;
  name?: string;
  status?: number;
  title?: string;
  type?: number;
}

const accessStore = useAccessStore();

const treeData = ref<ChannelTreeNode[]>([]);
const expandedKeys = ref<string[]>([]);
const searchKeyword = ref('');

const state = reactive({
  checkIndex: 1,
  gridNum: 1,
  videoUrls: [] as string[],
});

const gridClass = computed(() =>
  state.gridNum === 1
    ? 'grid-cols-1'
    : state.gridNum === 4
      ? 'grid-cols-2'
      : 'grid-cols-3',
);

const filteredTreeData = computed<TreeProps['treeData']>(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();
  if (!keyword) {
    return treeData.value;
  }
  const filterNode = (node: ChannelTreeNode): ChannelTreeNode | undefined => {
    const children = node.children
      ?.map((item) => filterNode(item))
      .filter(Boolean) as ChannelTreeNode[] | undefined;
    const matched = (node.name || node.title || '')
      .toLowerCase()
      .includes(keyword);
    if (matched || (children && children.length > 0)) {
      return { ...node, children };
    }
  };
  return treeData.value
    .map((item) => filterNode(item))
    .filter(Boolean) as ChannelTreeNode[];
});
const visibleTreeData = computed(() => filteredTreeData.value ?? []);

function normalizeTree(
  nodes: Array<Partial<ChannelTreeNode>> = [],
): ChannelTreeNode[] {
  return nodes.map((node) => {
    const key = String(node.id ?? node.channelId ?? node.deviceId ?? '');
    const children = normalizeTree(node.children ?? []);
    return {
      ...node,
      children,
      key,
      title: node.name ?? key,
    };
  });
}

function collectKeys(nodes: ChannelTreeNode[]): string[] {
  return nodes.flatMap((node) => [
    String(node.key),
    ...collectKeys(node.children ?? []),
  ]);
}

function withToken(url?: string) {
  if (!url) {
    return '';
  }
  const token = accessStore.accessToken;
  if (!token) {
    return url;
  }
  return `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
}

async function loadTree() {
  const data = normalizeTree(await doTreeDeviceChannel());
  treeData.value = data;
  expandedKeys.value = collectKeys(data).slice(0, 30);
}

function selectGrid(num: number) {
  state.gridNum = num;
  if (state.checkIndex > num) {
    state.checkIndex = 1;
  }
}

function selectWindow(index: number) {
  state.checkIndex = index;
}

async function onSelect(
  _selectedKeys: Parameters<NonNullable<TreeProps['onSelect']>>[0],
  info: Parameters<NonNullable<TreeProps['onSelect']>>[1],
) {
  const node = info.node as unknown as ChannelTreeNode;
  const channelId = node.channelId ?? node.id;
  if (node.type === 1 || node.isChildren || !node.deviceId || !channelId) {
    return;
  }
  if (node.status !== 1) {
    message.warning('请选择在线通道');
    return;
  }
  const data = await doPlayStart({
    channelId,
    deviceId: node.deviceId,
  });
  const playUrl = withToken(
    data.sslStatus === 0
      ? data.wsFlv?.url || data.flv?.url
      : data.wssFlv?.url || data.httpsFlv?.url,
  );
  if (!playUrl) {
    message.warning('未获取到播放地址');
    return;
  }
  state.videoUrls[state.checkIndex - 1] = playUrl;
  state.checkIndex =
    state.checkIndex >= state.gridNum ? 1 : state.checkIndex + 1;
}

onMounted(() => {
  loadTree();
});
</script>

<template>
  <Page auto-content-height>
    <div class="dispatch-page">
      <aside class="dispatch-tree">
        <div class="mb-3 text-base font-medium">设备通道</div>
        <InputSearch
          v-model:value="searchKeyword"
          allow-clear
          class="mb-3"
          placeholder="搜索通道"
        />
        <Tree
          v-if="visibleTreeData.length > 0"
          v-model:expanded-keys="expandedKeys"
          :field-names="{ children: 'children', key: 'key', title: 'title' }"
          :tree-data="visibleTreeData"
          block-node
          class="dispatch-tree-list"
          @select="onSelect"
        />
        <Empty v-else class="mt-10" description="暂无通道" />
      </aside>
      <section class="dispatch-main">
        <div class="dispatch-toolbar">
          <span class="font-medium">分屏</span>
          <Button
            :type="state.gridNum === 1 ? 'primary' : 'default'"
            @click="selectGrid(1)"
          >
            1
          </Button>
          <Button
            :type="state.gridNum === 4 ? 'primary' : 'default'"
            @click="selectGrid(4)"
          >
            4
          </Button>
          <Button
            :type="state.gridNum === 9 ? 'primary' : 'default'"
            @click="selectGrid(9)"
          >
            9
          </Button>
        </div>
        <div class="dispatch-grid" :class="[gridClass]">
          <div
            v-for="index in state.gridNum"
            :key="index"
            class="dispatch-player"
            :class="[
              state.checkIndex === index ? 'dispatch-player-active' : '',
            ]"
            @click="selectWindow(index)"
          >
            <VideoJessibucaPlay
              v-if="state.videoUrls[index - 1]"
              :has-audio="true"
              :video-url="state.videoUrls[index - 1]"
            />
            <span v-else>{{ index }}</span>
          </div>
        </div>
      </section>
    </div>
  </Page>
</template>

<style scoped>
.dispatch-page {
  display: flex;
  gap: 16px;
  height: 100%;
  min-height: 680px;
}

.dispatch-tree {
  width: 300px;
  min-width: 260px;
  padding: 12px;
  overflow: hidden;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
}

.dispatch-tree-list {
  height: calc(100% - 86px);
  overflow: auto;
}

.dispatch-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.dispatch-toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 48px;
  padding: 0 14px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
}

.dispatch-grid {
  display: grid;
  flex: 1;
  gap: 4px;
  padding-top: 12px;
}

.dispatch-player {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  background: #000;
  border: 2px solid transparent;
}

.dispatch-player-active {
  border-color: #1677ff;
}
</style>
