<script lang="ts" setup>
import type { LogsEntity } from '#/api/sys/logs';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Descriptions } from 'ant-design-vue';

import { doLogsDetail } from '#/api/sys/logs';

import { getLogsTypeName } from './data';

const logsInfo = ref<LogsEntity>({});

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen) {
    if (!isOpen) {
      logsInfo.value = {};
      return;
    }

    const data = modalApi.getData<LogsEntity>();
    if (data?.id) {
      logsInfo.value = await doLogsDetail({ id: data.id });
    }
  },
});

const getTitle = computed(() =>
  logsInfo.value.id ? `日志详情：${logsInfo.value.id}` : '日志详情',
);
</script>

<template>
  <Modal class="w-[760px]" :footer="false" :title="getTitle">
    <Descriptions bordered size="small" :column="1">
      <Descriptions.Item label="编号">{{ logsInfo.id }}</Descriptions.Item>
      <Descriptions.Item label="日志类型">
        {{ getLogsTypeName(logsInfo.type) }}
      </Descriptions.Item>
      <Descriptions.Item label="访问者 IP">{{ logsInfo.ip }}</Descriptions.Item>
      <Descriptions.Item label="网络地址">
        {{ logsInfo.ipAttribution }}
      </Descriptions.Item>
      <Descriptions.Item label="请求方式">
        {{ logsInfo.method }}
      </Descriptions.Item>
      <Descriptions.Item label="访问接口">{{ logsInfo.api }}</Descriptions.Item>
      <Descriptions.Item label="持续时间(ms)">
        {{ logsInfo.duration }}
      </Descriptions.Item>
      <Descriptions.Item label="请求参数">
        <pre class="logs-detail-pre">{{ logsInfo.param }}</pre>
      </Descriptions.Item>
      <Descriptions.Item label="响应参数">
        <pre class="logs-detail-pre">{{ logsInfo.result }}</pre>
      </Descriptions.Item>
      <Descriptions.Item label="访问时间">
        {{ logsInfo.createTime }}
      </Descriptions.Item>
    </Descriptions>
  </Modal>
</template>

<style scoped>
.logs-detail-pre {
  max-height: 220px;
  margin: 0;
  overflow: auto;

  /* 修复：使用标准的 overflow-wrap 替代已废弃的 word-break: break-word */
  overflow-wrap: break-word;
  white-space: pre-wrap;
}
</style>
