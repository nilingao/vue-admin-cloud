<template>
  <PageWrapper
    title="流程图"
    content="简单流程图示例,具体功能需要自己完善"
    contentFullHeight
    fixedHeight
  >
    <IvrFlowChart :data="{ nodes, edges }" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { IvrFlowChart } from '@/components/FlowChart';
  import { PageWrapper } from '@/components/Page';
  import { nodes, edges } from './data';
</script>
