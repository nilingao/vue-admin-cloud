<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import { Button, Descriptions, Tag } from 'ant-design-vue';
import printJS from 'print-js';

import { UserInfoApi } from '#/api/sys/user';

// const htmlElement = ref<HTMLElement | null>(null);
const route = useRoute();
const { setTabTitle } = useTabs();
const state = reactive({
  userId: route.params?.id,
  userName: '',
  memoRef: '',
  user: {} as any,
});

const initUserInfo = async () => {
  state.user = await UserInfoApi({ id: state.userId });
  // 设置导航名称
  setTabTitle(`详情：用户${state.user.nickName}`);
  // 水印
  // nextTick(() => {
  //   htmlElement.value = document.querySelector('#myHtmlElement');
  //   const { setWatermark } = useWatermark(htmlElement);
  //   setWatermark(model.v);
  // });
};

const handleSubmit = () => {
  printJS({
    printable: 'myHtmlElement',
    type: 'html',
    targetStyles: ['*'],
    ignoreElements: ['no-print'],
    maxWidth: 900,
  });
};
onMounted(() => {
  initUserInfo();
});
</script>
<template>
  <Page
    :title="`用户${state.userName}的资料`"
    content-class="flex flex-col"
    auto-content-height
  >
    <div
      id="myHtmlElement"
      class="bg-background dark:bg-background relative flex flex-auto flex-col gap-[50px] rounded-t-md p-[10px]"
    >
      <Descriptions bordered title="基本信息" :column="3">
        <Descriptions.Item class="w-[180px]" label="用户名">
          {{ state.user?.userName }}
        </Descriptions.Item>
        <Descriptions.Item class="w-[180px]" label="昵称">
          {{ state.user?.nickName }}
        </Descriptions.Item>
        <Descriptions.Item class="w-[180px]" label="联系电话">
          {{ state.user?.phone }}
        </Descriptions.Item>
        <Descriptions.Item class="w-[180px]" label="性别">
          <Tag color="success">
            {{
              state.user?.gender === 1
                ? '男'
                : state.user?.gender === 2
                  ? '女'
                  : '隐藏'
            }}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item class="w-[180px]" label="身份证号">
          {{ state.user?.idCard }}
        </Descriptions.Item>
        <Descriptions.Item class="w-[180px]" label="地址">
          {{ state.user?.address }}
        </Descriptions.Item>
        <Descriptions.Item class="w-[180px]" label="备注">
          {{ state.user?.memo }}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions bordered title="用户设置" :column="2">
        <Descriptions.Item class="w-[180px]" label="系统管理员">
          <Tag :color="state.user?.isAdmin ? 'success' : 'error'">
            {{ state.user?.isAdmin ? '启用' : '禁用' }}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item class="w-[180px]" label="启用状态">
          <Tag :color="state.user?.isEnabled ? 'success' : 'error'">
            {{ state.user?.isEnabled ? '启用' : '禁用' }}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </div>
    <div
      class="bg-background dark:bg-background relative h-[60px] w-full flex-none rounded-b-md"
    >
      <div
        class="bg-background-deep z-100 absolute -left-4 bottom-1 top-0 h-2 w-[calc(100%+1rem)] overflow-hidden"
      ></div>
      <div
        v-access:code="['system.user:print']"
        class="flex h-full items-center justify-end pr-[10px] pt-2"
      >
        <Button @click="handleSubmit">打印</Button>
      </div>
    </div>
  </Page>
</template>
