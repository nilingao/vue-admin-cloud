<template>
  <div :class="`${prefixCls}-toolbar`" class="flex items-center px-2 py-1">
    <template v-for="item in toolbarItemList" :key="item.type">
      <Tooltip placement="bottom" v-bind="item.disabled ? { open: false } : {}">
        <template #title>{{ item.tooltip }}</template>
        <span :class="`${prefixCls}-toolbar__icon`" v-if="item.icon" @click="onControl(item)">
          <Icon
            :icon="item.icon"
            :class="item.disabled ? 'cursor-not-allowed disabled' : 'cursor-pointer'"
          />
        </span>
      </Tooltip>
      <Divider v-if="item.separate" type="vertical" />
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { useVueFlow } from '@vue-flow/core';
  import { ref } from 'vue';
  import { Divider, Tooltip } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { ToolbarTypeEnum, ToolbarConfig } from '../../hooks/common';

  const props = defineProps({
    prefixCls: String,
    vueFlowId: {
      type: String,
      default: 'ivr-flow-chart',
    },
  });

  defineOptions({ name: 'IvrFlowChartToolbar' });
  const { zoomIn, zoomOut, fitView, setViewport, setNodes, toObject } = useVueFlow(props.vueFlowId);

  const emit = defineEmits(['view-data']);
  const toolbarItemList = ref<ToolbarConfig[]>([
    {
      type: ToolbarTypeEnum.ZOOM_OUT,
      icon: 'codicon:zoom-out',
      tooltip: '缩小',
    },
    {
      type: ToolbarTypeEnum.ZOOM_IN,
      icon: 'codicon:zoom-in',
      tooltip: '放大',
    },
    { separate: true },
    {
      type: ToolbarTypeEnum.RESET_ZOOM,
      icon: 'codicon:git-pull-request-create',
      tooltip: '重置比例',
    },
    {
      type: ToolbarTypeEnum.FIT_VIEW,
      icon: 'codicon:screen-normal',
      tooltip: '自适应',
    },
    {
      type: ToolbarTypeEnum.RANDOM_VIEW,
      icon: 'uil:arrow-random',
      tooltip: '随机排列',
    },
    // {
    //   type: ToolbarTypeEnum.UNDO,
    //   icon: 'ion:arrow-undo-outline',
    //   tooltip: '后退',
    //   disabled: true,
    // },
    // {
    //   type: ToolbarTypeEnum.REDO,
    //   icon: 'ion:arrow-redo-outline',
    //   tooltip: '前进',
    //   disabled: true,
    // },
    // {
    //   type: ToolbarTypeEnum.SNAPSHOT,
    //   icon: 'ion:download-outline',
    //   tooltip: '下载',
    // },
    { separate: true },
    {
      type: ToolbarTypeEnum.VIEW_DATA,
      icon: 'carbon:document-view',
      tooltip: '查看数据',
    },
  ]);

  const onControl = (item) => {
    switch (item.type) {
      case ToolbarTypeEnum.ZOOM_IN:
        zoomIn();
        break;
      case ToolbarTypeEnum.ZOOM_OUT:
        zoomOut();
        break;
      case ToolbarTypeEnum.RESET_ZOOM:
        setViewport({ x: 0, y: 0, zoom: 1 });
        break;
      case ToolbarTypeEnum.FIT_VIEW:
        fitView();
        break;
      case ToolbarTypeEnum.RANDOM_VIEW:
        const { nodes } = toObject();
        const nodesList = nodes.map((node) => {
          return {
            ...node,
            position: {
              x: Math.random() * 400,
              y: Math.random() * 400,
            },
          };
        });
        setNodes(nodesList);
        break;
      case ToolbarTypeEnum.UNDO:
        // lf.undo();
        break;
      case ToolbarTypeEnum.REDO:
        // lf.redo();
        break;
      case ToolbarTypeEnum.SNAPSHOT:
        // lf.getSnapshot();
        break;
      case ToolbarTypeEnum.VIEW_DATA:
        emit('view-data');
        break;
    }
  };
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-ivr-chart-toolbar';

  html[data-theme='dark'] {
    .lf-dnd {
      background: #080808;
    }
  }
  .@{prefix-cls} {
    height: 36px;
    border-bottom: 1px solid @border-color-base;
    background-color: @app-content-background;

    .disabeld {
      color: @disabled-color;
    }

    &__icon {
      display: inline-block;
      margin-right: 10px;
      padding: 2px 4px;

      &:hover {
        color: @primary-color;
      }
    }
  }
</style>
