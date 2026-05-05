<script lang="ts" setup>
import type { Key } from 'ant-design-vue/es/_util/type';
import type { DataNode } from 'ant-design-vue/es/tree';

import type { Recordable } from '@vben/types';

import type { PlatformEntity } from '#/api/video/platform';

import { computed, nextTick, ref } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  Modal as AntModal,
  Button,
  Card,
  Dropdown,
  Empty,
  Menu,
  Spin,
  Tabs,
  Tree,
} from 'ant-design-vue';

import {
  doPlatformCatalogDelete,
  doPlatformCatalogDeleteRelation,
  doPlatformCatalogTree,
} from '#/api/video/platform';

import PlatformBindTransfer from './PlatformBindTransfer.vue';
import PlatformCatalogModal from './PlatformCatalogModal.vue';

const { hasAccessByCodes } = useAccess();
const platform = ref<PlatformEntity>();
const activeKey = ref<'gbChannel' | 'gbStream'>('gbChannel');
const catalogId = ref<string>();
const loadingTree = ref(false);
type CatalogTreeNode = DataNode & {
  children?: CatalogTreeNode[];
  raw: Recordable<any>;
};

const treeData = ref<CatalogTreeNode[]>([]);
const bindTransferRef = ref<InstanceType<typeof PlatformBindTransfer>>();

const [CatalogModal, catalogModalApi] = useVbenModal({
  connectedComponent: PlatformCatalogModal,
  destroyOnClose: true,
});

function normalizeTree(list: Recordable<any>[]): CatalogTreeNode[] {
  return list.map((item) => ({
    ...item,
    key: String(item.id),
    raw: item,
    title: item.name ?? item.id,
    children: item.children ? normalizeTree(item.children) : undefined,
  }));
}

async function fetchTree() {
  if (!platform.value?.serverGbId) {
    treeData.value = [];
    catalogId.value = undefined;
    return;
  }

  loadingTree.value = true;
  try {
    const list = await doPlatformCatalogTree({
      platformId: platform.value.serverGbId,
    });
    treeData.value = normalizeTree(list);
    catalogId.value =
      treeData.value[0]?.key === undefined
        ? undefined
        : String(treeData.value[0].key);
  } finally {
    loadingTree.value = false;
  }
}

function refreshBind() {
  nextTick(() => bindTransferRef.value?.refresh());
}

function handleSelect(keys: Key[]) {
  catalogId.value = keys[0] === undefined ? undefined : String(keys[0]);
}

function openCatalogModal(isUpdate: boolean, node: Recordable<any>) {
  catalogModalApi
    .setData({
      isUpdate,
      node: {
        ...node.raw,
        platformId: platform.value?.serverGbId,
      },
    })
    .open();
}

async function handleDeleteCatalog(node: Recordable<any>) {
  AntModal.confirm({
    title: '删除目录',
    content: `确定删除目录「${node.title}」吗？`,
    async onOk() {
      await doPlatformCatalogDelete({ id: node.key });
      await fetchTree();
      refreshBind();
    },
  });
}

async function handleDeleteRelation(node: Recordable<any>) {
  AntModal.confirm({
    title: '解除国标绑定',
    content: `确定解除目录「${node.title}」下的国标绑定吗？`,
    async onOk() {
      await doPlatformCatalogDeleteRelation({ id: node.key, type: 0 });
      await fetchTree();
      refreshBind();
    },
  });
}

function handleMenuClick(menuKey: string, node: Recordable<any>) {
  switch (menuKey) {
    case 'add': {
      openCatalogModal(false, node);
      break;
    }
    case 'delete': {
      handleDeleteCatalog(node);
      break;
    }
    case 'deleteRelation': {
      handleDeleteRelation(node);
      break;
    }
    case 'edit': {
      openCatalogModal(true, node);
      break;
    }
  }
}

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen) {
    if (!isOpen) {
      platform.value = undefined;
      activeKey.value = 'gbChannel';
      catalogId.value = undefined;
      treeData.value = [];
      return;
    }

    platform.value = modalApi.getData<PlatformEntity>();
    await fetchTree();
  },
});

const modalTitle = computed(
  () => `关联国标：${platform.value?.name ?? platform.value?.serverGbId ?? ''}`,
);
</script>

<template>
  <Modal class="w-[90vw]" :footer="false" :title="modalTitle">
    <CatalogModal @success="fetchTree" />
    <div class="flex min-h-[560px] gap-4">
      <Card class="w-[280px]" size="small" title="目录">
        <Spin :spinning="loadingTree">
          <Tree
            v-if="treeData.length > 0"
            :selected-keys="catalogId ? [catalogId] : []"
            :tree-data="treeData"
            block-node
            default-expand-all
            @select="handleSelect"
          >
            <template #title="node">
              <div class="flex items-center justify-between gap-2">
                <span class="min-w-0 flex-1 truncate">{{ node.title }}</span>
                <Dropdown :trigger="['click']">
                  <Button type="text" size="small" @click.stop>
                    <template #icon>
                      <IconifyIcon icon="ri:more-fill" />
                    </template>
                  </Button>
                  <template #overlay>
                    <Menu
                      @click="({ key }) => handleMenuClick(String(key), node)"
                    >
                      <Menu.Item
                        key="add"
                        :disabled="!hasAccessByCodes(['video.platform:join'])"
                      >
                        添加下级目录
                      </Menu.Item>
                      <Menu.Item
                        key="edit"
                        :disabled="
                          !hasAccessByCodes(['video.platform:join']) ||
                          !node.raw?.parentId
                        "
                      >
                        编辑当前目录
                      </Menu.Item>
                      <Menu.Item
                        key="deleteRelation"
                        :disabled="!hasAccessByCodes(['video.platform:join'])"
                      >
                        解除国标绑定
                      </Menu.Item>
                      <Menu.Item
                        key="delete"
                        :disabled="
                          !hasAccessByCodes(['video.platform:join']) ||
                          !node.raw?.parentId
                        "
                      >
                        删除当前目录
                      </Menu.Item>
                    </Menu>
                  </template>
                </Dropdown>
              </div>
            </template>
          </Tree>
          <Empty v-else class="py-16" description="暂无目录" />
        </Spin>
      </Card>
      <Card class="min-w-0 flex-1" size="small">
        <Tabs v-model:active-key="activeKey">
          <Tabs.TabPane key="gbChannel" tab="国标通道" />
          <Tabs.TabPane key="gbStream" tab="国标流" />
        </Tabs>
        <PlatformBindTransfer
          ref="bindTransferRef"
          :active-key="activeKey"
          :catalog-id="catalogId"
          :server-gb-id="platform?.serverGbId"
        />
      </Card>
    </div>
  </Modal>
</template>
