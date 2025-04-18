<template>
  <div :class="`${prefixCls}`">
    <div :class="`${prefixCls}-label`" v-if="isTitle && titleName">
      <div :class="`${prefixCls}-label-name`">
        <span :class="`${prefixCls}-label-name-span text-sm font-medium antialiased`"
          >{{ titleName }}
        </span>
        <Tooltip v-if="isTip" placement="top">
          <template #title>{{ tipContext }}</template>
          <span :class="`${prefixCls}-label-name-span-icon `">
            <Icon class="cursor-pointer" icon="ic:baseline-help-outline" />
          </span>
        </Tooltip>
      </div>
      <Button
        v-if="isMore"
        :class="`${prefixCls}-label-button`"
        type="text"
        size="small"
        @click="headerMore"
      >
        <template #icon>
          <Icon :class="`${prefixCls}-label-button-icon`" :icon="moreIcon" :size="20" />
        </template>
      </Button>
    </div>
    <div v-if="isContext" :class="`${prefixCls}-content`">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useDesign } from '@/hooks/web/useDesign';
  import Icon from '@/components/Icon/Icon.vue';
  import { Button, Tooltip } from 'ant-design-vue';

  const { prefixCls } = useDesign('node-context');
  defineOptions({ name: 'NodeContext' });
  const emit = defineEmits(['more']);
  defineProps({
    // 是否展示标题
    isTitle: {
      type: Boolean,
      default: false,
    },
    // 标题名
    titleName: {
      type: String,
      default: '标题名称',
    },
    // 是否展示内容注解
    isTip: {
      type: Boolean,
      default: false,
    },
    // 是否展示内容注解
    tipContext: {
      type: String,
      default: '默认内容注解',
    },
    // 是否内容
    isContext: {
      type: Boolean,
      default: true,
    },
    // 是否需要更多按钮
    isMore: {
      type: Boolean,
      default: false,
    },
    // 是否需要更多按钮
    moreIcon: {
      type: String,
      default: 'ri:more-fill',
    },
  });
  const headerMore = () => {
    emit('more');
  };
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-node-context';

  .@{prefix-cls} {
    // 内容样式
    &-label {
      display: flex;
      position: relative;
      margin-bottom: 8px;
      padding-left: 12px;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 2px;
        width: 2px;
        height: 80%;
        transform: translate(-50%, -50%);
        background: #3370ff;
      }

      &-name {
        display: flex;
        flex-grow: 1;
        align-items: center;

        &-span {
          padding-right: 4px;

          &-icon {
            display: inline-block;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #909399;

            &:hover {
              color: @primary-color;
            }
          }
        }
      }

      &-button {
        flex: none;

        &-icon {
          color: #3370ff;
        }
      }
    }

    &-content {
      padding: 8px 12px;
      border-radius: 4px;
      background: #f5f6f7;
    }
  }
</style>
