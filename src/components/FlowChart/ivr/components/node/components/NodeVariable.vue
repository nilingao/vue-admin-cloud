<template>
  <NodeContext
    :class="isPt ? 'pt-2' : ''"
    :isContext="false"
    :isTitle="true"
    :titleName="titleName"
    :isTip="isTip"
    :tipContext="tipContext"
  />
  <div :class="`${prefixCls} grid gap-2`">
    <NodeContext v-for="item in fieldList" :key="item.value">
      <div class="ver-context flex items-center">
        <div class="flex-grow">
          <span class="text-sm">{{ item.label + ' {' + item.value + '}' }}</span>
        </div>
        <div class="ver-context-icon flex-none">
          <Button class="ver-context-icon-bot" type="text" size="small" @click="headerCopy(item)">
            <template #icon>
              <Icon icon="akar-icons:copy" />
            </template>
          </Button>
        </div>
      </div>
    </NodeContext>
  </div>
</template>
<script setup lang="ts">
  import { useDesign } from '@/hooks/web/useDesign';
  import NodeContext from './NodeContext.vue';
  import { Button } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { copyText } from '@/utils/copyTextToClipboard';
  import { NodeFields } from '../../../hooks/common';
  import { useMessage } from '@/hooks/web/useMessage';

  const { prefixCls } = useDesign('node-variable');
  const { createMessage } = useMessage();
  defineOptions({ name: 'NodeVariable' });
  defineProps({
    // 是否展示标题
    // 标题名
    titleName: {
      type: String,
      default: '变量标题',
    },
    // 是否展示内容注解
    isTip: {
      type: Boolean,
      default: false,
    },
    isPt: {
      type: Boolean,
      default: true,
    },
    // 是否展示内容注解
    tipContext: {
      type: String,
      default: '默认内容注解',
    },
    // 变量内容
    fieldList: {
      type: Array<NodeFields>,
      default: () => [] as NodeFields[],
    },
  });

  const headerCopy = (item: NodeFields) => {
    copyText(item.globeLabel).catch(() => {
      createMessage.error('复制失败');
    });
  };
</script>
<style lang="less">
  .ver-context {
    &-icon {
      display: none;
      align-items: center;
      justify-content: center;
      color: #909399;

      &-bot {
        width: 20px !important;
        height: 20px !important;
      }
    }

    &:hover &-icon {
      display: flex;
    }
  }
</style>
