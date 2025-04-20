<template>
  <foreignObject
    :class="prefixCls"
    :height="foreignObjectSize"
    :width="foreignObjectSize"
    :x="edgeCenterX - foreignObjectSize / 2"
    :y="edgeCenterY - foreignObjectSize / 2"
    requiredExtensions="http://www.w3.org/1999/xhtml"
  >
    <div :class="`${prefixCls}-div`">
      <Button :class="`${prefixCls}-div-button`" type="text" size="small" @click="handleDelete">
        <template #icon>
          <Icon icon="streamline:delete-1-solid" :size="6" />
        </template>
      </Button>
    </div>
  </foreignObject>
</template>
<script setup lang="ts">
  import { useDesign } from '@/hooks/web/useDesign';
  import { Button } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';

  const foreignObjectSize = 40;
  const emit = defineEmits(['delete']);
  const { prefixCls } = useDesign('button_marker');
  defineProps({
    edgeCenterX: {
      type: Number,
      required: true,
    },
    edgeCenterY: {
      type: Number,
      required: true,
    },
  });
  const handleDelete = (evt) => {
    evt?.stopPropagation();
    emit('delete');
  };
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-button_marker';

  .@{prefix-cls} {
    &-div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      min-height: 40px;
      background: transparent;

      &-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px !important;
        height: 20px !important;
        padding: 0 !important;
        transition: none !important;
        border: 1px solid #fff;
        border-radius: 50% !important;
        background: #eee;
        cursor: pointer;

        &:hover {
          background: #5e35b1 !important;
          box-shadow: 0 0 6px 2px #00000014 !important;
          color: #eee !important;
        }
      }
    }
  }
</style>
