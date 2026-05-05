<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { IvrFlowChart } from '#/components/FlowChart';

import { edges, nodes } from './data';
</script>

<template>
  <Page auto-content-height>
    <IvrFlowChart :data="{ edges, nodes }" />
  </Page>
</template>
