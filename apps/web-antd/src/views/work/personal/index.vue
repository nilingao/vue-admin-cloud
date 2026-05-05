<script lang="ts" setup>
import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Card, Menu } from 'ant-design-vue';

import AccountBind from '#/views/index/system/user/component/accountBind/index.vue';
import BaseSetting from '#/views/index/system/user/component/baseSetting/index.vue';

const userStore = useUserStore();

const selectedKeys = ref(['base']);
const currentComponent = computed(() =>
  selectedKeys.value[0] === 'bind' ? AccountBind : BaseSetting,
);

const userId = computed(() => userStore.userInfo?.id);

const menuItems = [
  { key: 'base', label: '基本设置' },
  { key: 'bind', label: '账号绑定' },
];
</script>

<template>
  <Page auto-content-height title="个人中心">
    <div class="personal-page">
      <Card class="personal-menu" :body-style="{ padding: 0 }">
        <Menu
          v-model:selected-keys="selectedKeys"
          :items="menuItems"
          mode="inline"
        />
      </Card>
      <Card class="min-w-0 flex-1">
        <component :is="currentComponent" :user-id="userId" />
      </Card>
    </div>
  </Page>
</template>

<style scoped>
.personal-page {
  display: flex;
  gap: 16px;
  min-height: 600px;
}

.personal-menu {
  width: 240px;
  min-width: 220px;
}
</style>
