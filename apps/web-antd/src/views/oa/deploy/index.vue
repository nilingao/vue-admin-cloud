<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Input, message, Space, Textarea } from 'ant-design-vue';

import {
  doDeployProcessParameter,
  doFindRepositoryXml,
} from '#/api/oa/activiti';

const route = useRoute();
const router = useRouter();

const formData = reactive({
  id: String(route.params?.id ?? ''),
  name: '',
  processId: '',
  xml: '',
});

async function init() {
  if (formData.id && formData.id !== 'undefined') {
    const xml = await doFindRepositoryXml({
      processDefinitionId: formData.id,
    });
    formData.xml = xml ?? '';
    formData.processId = formData.id.split(':')[0] ?? '';
  }
}

function goBack() {
  router.push('/oa/repository');
}

async function deploy() {
  if (!formData.processId) {
    message.warning('请输入流程编号');
    return;
  }
  if (!formData.name) {
    message.warning('请输入流程名称');
    return;
  }
  if (!formData.xml) {
    message.warning('请输入流程 XML');
    return;
  }

  await doDeployProcessParameter({
    id: `${formData.processId}.bpmn`,
    name: formData.name,
    xml: formData.xml,
  });
  message.success('部署成功');
  goBack();
}

onMounted(init);
</script>

<template>
  <Page title="流程实例部署" auto-content-height>
    <div class="flex h-full flex-col gap-4 p-4">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Input v-model:value="formData.processId" placeholder="流程编号" />
        <Input v-model:value="formData.name" placeholder="流程名称" />
      </div>
      <Textarea
        v-model:value="formData.xml"
        class="min-h-0 flex-1"
        placeholder="请输入或粘贴 BPMN XML"
        :auto-size="{ minRows: 18 }"
      />
      <Space class="justify-end">
        <Button @click="goBack">取消</Button>
        <Button
          v-access:code="'oa.deploy:deploy'"
          type="primary"
          @click="deploy"
        >
          部署
        </Button>
      </Space>
    </div>
  </Page>
</template>
