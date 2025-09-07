<script lang="ts" setup>
import { onBeforeMount, reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Divider, Image } from 'ant-design-vue';

import {
  ResultEnum,
  SocketData,
  SocketInEvent,
  SocketNamespace,
  SocketOutEvent,
} from '#/enums/SocketEnum';
import rootSocketEmitter from '#/hooks/socket/rootSocketEmitter';
import { useSocketStore } from '#/store/model/socket';

const emit = defineEmits(['success']);

const useSocket = useSocketStore();
const stats = reactive({
  img: '',
  scene: '',
});

const qrCode = () => {
  useSocket.sendMessage(
    SocketNamespace.QR_NAMESPACE,
    SocketInEvent.IN_LOGIN_QR_CODE_EVENT,
    {
      type: SocketData.WX_MINI_QR_BIND_DATA,
    },
  );
};

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    modalApi.lock();
    modalApi.close();
    modalApi.lock(false);
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      qrCode();
    }
  },
});

onBeforeMount(() => {
  rootSocketEmitter.on(SocketOutEvent.OUT_LOGIN_QR_CODE_EVENT, (val: any) => {
    const { code, message, data } = val;
    if (code !== ResultEnum.SUCCESS) {
      message.error(message || '获取消息错误');
      return;
    }
    const { scene, type, img } = data;
    if (type && type === SocketData.WX_MINI_QR_BIND_DATA) {
      stats.img = img;
      stats.scene = scene;
    }
  });
  // 检测socket平台消息
  rootSocketEmitter.on(SocketOutEvent.OUT_LOGIN_BIND_EVENT, (val: any) => {
    const { code, message } = val;
    if (code === ResultEnum.OVERDUE) {
      qrCode();
      message.info('二维码过期');
    } else if (code !== ResultEnum.SUCCESS) {
      message.error(message || '获取消息错误');
      return;
    }
    message.success('绑定成功');
    emit('success');
  });
});
</script>

<template>
  <Modal title="绑定账户">
    <div class="enter-x flex min-h-64 min-w-64 justify-center">
      <Image
        :src="stats.img"
        :preview="false"
        :width="240"
        class="enter-x"
        @click="qrCode()"
      />
    </div>
    <Divider class="enter-x">{{ '扫码后点击\"确认\"，即可完成登录' }}</Divider>
  </Modal>
</template>
