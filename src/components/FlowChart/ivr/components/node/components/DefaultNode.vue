<template>
  <div v-if="isTarget">
    <slot name="target">
      <Handle :id="`${nodeId}-target`" type="target" :position="Position.Left" />
    </slot>
  </div>
  <Card :class="prefixCls" hoverable size="small" :style="`width: ${nodeWidth}px`">
    <CardMeta :class="`${prefixCls}-meta`">
      <template #avatar>
        <Icon
          :class="`${prefixCls}-meta-icon`"
          :style="`background:${iconBackground}`"
          :icon="nodeIcon"
          :size="20"
        />
      </template>
      <template #title>
        <div :class="`${prefixCls}-meta-title`">
          <span>{{ nodeLabel }}</span>
        </div>
        <div v-if="isOperate" :class="`${prefixCls}-meta-check`">
          <Dropdown :arrow="{ pointAtCenter: true }" placement="bottom">
            <Button type="text" size="small">
              <template #icon>
                <Icon icon="ri:more-fill" :size="20" />
              </template>
            </Button>
            <template #overlay>
              <Menu @click="handleTitleClick">
                <MenuItem key="cope">复制</MenuItem>
                <MenuDivider />
                <MenuItem key="del">删除</MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </template>
    </CardMeta>
    <!-- 内容 -->
    <div :class="`${prefixCls}-content`">
      <slot></slot>
    </div>
  </Card>
  <div v-if="isSource">
    <slot name="source">
      <Handle :id="`${nodeId}-source`" type="source" :position="Position.Right" />
    </slot>
  </div>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { Card, CardMeta, Button, Dropdown, Menu, MenuItem, MenuDivider } from 'ant-design-vue';
  import { Handle, Position, useVueFlow } from '@vue-flow/core';

  const { prefixCls } = useDesign('default-node');
  defineOptions({ name: 'DefaultNode' });
  const props = defineProps({
    // 节点编号
    nodeId: {
      type: String,
      required: true,
    },
    // 节点宽度
    nodeWidth: {
      type: Number,
      default: 300,
    },
    // 节点图标
    nodeIcon: {
      type: String,
      default: 'hugeicons:start-up-02',
    },
    // 节点图标
    iconBackground: {
      type: String,
      default: 'rgb(209 54 209)',
    },
    isSource: {
      type: Boolean,
      default: true,
    },
    isTarget: {
      type: Boolean,
      default: true,
    },
    // 节点标题
    nodeLabel: {
      type: String,
      default: '节点标题',
    },
    // 是否展示操作按钮
    isOperate: {
      type: Boolean,
      default: false,
    },
  });

  const { removeNodes, findNode, addNodes, toObject } = useVueFlow();

  const handleTitleClick = ({ key }) => {
    if (key === 'del') {
      removeNodes([props.nodeId]);
    } else if (key === 'cope') {
      const { nodes } = toObject();
      const maxId = nodes.reduce((max, item) => {
        const id = parseInt(item.id); // 将 id 转换为数字
        return isNaN(id) ? max : Math.max(max, id);
      }, 0);
      const { type, position, data } = findNode(props.nodeId) as any;

      // 为新节点分配一个更大的 id
      const newNodeId = (maxId + 1).toString();
      addNodes({ id: newNodeId, position: { x: position.x + 20, y: position.y + 20 }, type, data });
    }
  };
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-default-node';
  .@{prefix-cls} {
    min-width: 300px;
    // 内容样式
    &-meta {
      margin: 0 0 6px !important;

      &-title {
        flex-grow: 1;
      }

      &-check {
        flex: none;
      }

      &-icon {
        border-radius: 4px;
        color: #fff;
      }

      .ant-card-meta-avatar {
        display: flex;
        flex: none;
        align-items: center;
        justify-content: center;
        padding-inline-end: 6px;
      }

      .ant-card-meta-detail {
        flex-grow: 1;

        .ant-card-meta-title {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
</style>
