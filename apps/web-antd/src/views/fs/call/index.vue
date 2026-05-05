<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Switch,
  Tag,
} from 'ant-design-vue';

import { FsRtcPlay } from '#/components/Video';
import {
  ResultEnum,
  SocketInEvent,
  SocketNamespace,
  SocketOutEvent,
} from '#/enums/SocketEnum';
import { useFsSocket } from '#/hooks/socket';
import rootSocketEmitter from '#/hooks/socket/rootSocketEmitter';
import { useSocketStore } from '#/store/model';

const socketStore = useSocketStore();
const fsRtcPlayRef = ref<InstanceType<typeof FsRtcPlay>>();

const callForm = reactive({
  dtmf: '',
  mobile: '',
});

const callState = reactive({
  callId: '',
  caller: '',
  incomingDialogs: {} as Record<string, ReturnType<typeof Modal.confirm>>,
  isCalling: false,
  timeout: undefined as ReturnType<typeof setTimeout> | undefined,
});

const agentState = reactive({
  agentId: '',
  agentKey: '',
  agentName: '',
  agentState: '',
  loginType: '',
  mediaAddress: '',
});

const mediaState = reactive({
  audioEnable: true,
  recvOnly: false,
  recvSdp: '',
  useCamera: true,
  useDtmf: true,
  videoEnable: false,
});

const callModeLabel = computed(() =>
  mediaState.videoEnable ? '视频电话' : '音频电话',
);

const hasSocket = computed(() =>
  Boolean(socketStore.getSocketMap[SocketNamespace.AGENT_NAMESPACE]),
);

function clearCallTimer() {
  if (callState.timeout) {
    clearTimeout(callState.timeout);
    callState.timeout = undefined;
  }
}

function closeIncomingDialogs() {
  Object.values(callState.incomingDialogs).forEach((dialog) =>
    dialog.destroy(),
  );
  callState.incomingDialogs = {};
}

function resetCall() {
  clearCallTimer();
  callState.callId = '';
  callState.caller = '';
  callState.isCalling = false;
  mediaState.recvOnly = false;
  mediaState.recvSdp = '';
  closeIncomingDialogs();
  fsRtcPlayRef.value?.destroy();
}

function sendAgentMessage(event: SocketInEvent, payload: Recordable<any>) {
  if (!hasSocket.value) {
    message.warning('客服通话 Socket 尚未连接');
    return false;
  }
  socketStore.sendMessage(SocketNamespace.AGENT_NAMESPACE, event, payload);
  return true;
}

function refreshAgentStatus(updateStatus = 1) {
  sendAgentMessage(SocketInEvent.AGENT_IN_STATUS, { updateStatus });
}

function startCall() {
  if (!callForm.mobile) {
    message.warning('请输入被叫号码');
    return;
  }
  callState.isCalling = true;
  callState.caller = callForm.mobile;
  mediaState.recvOnly = false;
  mediaState.recvSdp = '';
  fsRtcPlayRef.value?.call({ ...mediaState });
}

function hangUp() {
  if (callState.callId) {
    sendAgentMessage(SocketInEvent.AGENT_IN_HANG_UP_PHONE, {
      callId: callState.callId,
    });
  }
  resetCall();
}

function sendDtmf() {
  if (!callForm.dtmf) {
    message.warning('请输入按键号码');
    return;
  }
  fsRtcPlayRef.value?.sendDtmf(callForm.dtmf);
}

function sendSdpApi(sdp: string) {
  return new Promise((resolve, reject) => {
    if (callState.isCalling) {
      rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_PHONE);
      rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_CALL_PHONE, (val) => {
        const { code, data, message: responseMessage } = val as Recordable<any>;
        if (code !== ResultEnum.SUCCESS) {
          resetCall();
          rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_PHONE);
          reject(responseMessage || '拨打电话失败');
          return;
        }
        callState.callId = data?.callId ?? '';
        if (data?.type === 'ON_CALL') {
          clearCallTimer();
          rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_PHONE);
        }
        resolve(data);
      });
      if (
        !sendAgentMessage(SocketInEvent.AGENT_IN_CALL_PHONE, {
          caller: callState.caller,
          sdp,
          type: mediaState.videoEnable
            ? 'CALL_VIDEO_PHONE'
            : 'CALL_AUDIO_PHONE',
        })
      ) {
        reject(new Error('客服通话 Socket 尚未连接'));
        return;
      }
      callState.timeout = setTimeout(() => {
        resetCall();
        rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_PHONE);
        reject(new Error('获取拨打用户 SDP 超时'));
      }, 15_000);
      return;
    }

    rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_NOTIFICATION);
    rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_CALL_NOTIFICATION, (val) => {
      clearCallTimer();
      const { code, message: responseMessage } = val as Recordable<any>;
      if (code !== ResultEnum.SUCCESS) {
        resetCall();
        rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_NOTIFICATION);
        reject(responseMessage || '来电回调失败');
        return;
      }
      rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_NOTIFICATION);
      resolve({ sdp: mediaState.recvSdp });
    });
    if (
      !sendAgentMessage(SocketInEvent.AGENT_IN_CALL_NOTIFICATION, {
        callId: callState.callId,
        sdp,
        type: 2,
      })
    ) {
      reject(new Error('客服通话 Socket 尚未连接'));
      return;
    }
    callState.timeout = setTimeout(() => {
      resetCall();
      rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_NOTIFICATION);
      reject(new Error('来电回调失败'));
    }, 15_000);
  });
}

function handleAgentStatus(val: any) {
  const { code, data, message: responseMessage } = val as Recordable<any>;
  if (code !== ResultEnum.SUCCESS) {
    message.error(responseMessage || '获取客服状态失败');
    return;
  }
  Object.assign(agentState, {
    agentId: data?.agentId ?? '',
    agentKey: data?.agentKey ?? '',
    agentName: data?.agentName ?? '',
    agentState: data?.agentState ?? '',
    loginType: data?.loginType ?? '',
    mediaAddress: data?.mediaAddress ?? '',
  });
  message.info(responseMessage || '客服状态已更新');
}

function handleHangUpResult(val: any) {
  const { code, message: responseMessage } = val as Recordable<any>;
  if (code !== ResultEnum.SUCCESS) {
    message.error(responseMessage || '挂断失败');
    return;
  }
  resetCall();
  message.success(responseMessage || '通话已挂断');
}

function handlePhoneNotification(val: any) {
  const { code, data, message: responseMessage } = val as Recordable<any>;
  if (code !== ResultEnum.SUCCESS) {
    resetCall();
    message.error(responseMessage || '处理通话事件失败');
    return;
  }
  const { agentState: nextAgentState, callId, data: payload } = data ?? {};
  if (nextAgentState !== 'IN_CALL_RING' || !callId) {
    return;
  }
  if (callState.incomingDialogs[callId]) {
    return;
  }
  const caller = payload?.caller ?? '未知号码';
  const callType = payload?.callType === 'INNER_CALL' ? '内部呼叫' : '外部呼叫';
  mediaState.videoEnable = payload?.onVideo === 1;
  callState.incomingDialogs[callId] = Modal.confirm({
    cancelText: '拒绝',
    content: `号码：${caller}`,
    okText: '接听',
    onCancel: () => {
      sendAgentMessage(SocketInEvent.AGENT_IN_CALL_NOTIFICATION, {
        callId,
        type: 1,
      });
      resetCall();
      message.success('已拒绝');
    },
    onOk: () => {
      callState.callId = callId;
      callState.isCalling = false;
      mediaState.recvOnly = true;
      mediaState.recvSdp = payload?.sdp ?? '';
      fsRtcPlayRef.value?.call({ ...mediaState });
    },
    title: callType,
  });
}

onMounted(() => {
  useFsSocket(SocketNamespace.AGENT_NAMESPACE);
  rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_HANG_UP_PHONE);
  rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_LOGIN);
  rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_PHONE_NOTIFICATION);
  rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_STATUS);
  rootSocketEmitter.on(
    SocketOutEvent.AGENT_OUT_HANG_UP_PHONE,
    handleHangUpResult,
  );
  rootSocketEmitter.on(
    SocketOutEvent.AGENT_OUT_PHONE_NOTIFICATION,
    handlePhoneNotification,
  );
  rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_STATUS, handleAgentStatus);
  rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_LOGIN, () =>
    refreshAgentStatus(0),
  );
});

onUnmounted(() => {
  rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_NOTIFICATION);
  rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_PHONE);
  rootSocketEmitter.off(
    SocketOutEvent.AGENT_OUT_HANG_UP_PHONE,
    handleHangUpResult,
  );
  rootSocketEmitter.off(
    SocketOutEvent.AGENT_OUT_PHONE_NOTIFICATION,
    handlePhoneNotification,
  );
  rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_STATUS, handleAgentStatus);
  resetCall();
  socketStore.delNamespace(SocketNamespace.AGENT_NAMESPACE);
});
</script>

<template>
  <Page auto-content-height>
    <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card title="客服拨打">
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <Tag :color="hasSocket ? 'success' : 'warning'">
            {{ hasSocket ? 'Socket 已连接' : 'Socket 连接中' }}
          </Tag>
          <span>拨打状态：{{ callModeLabel }}</span>
          <Switch
            v-model:checked="mediaState.videoEnable"
            checked-children="视频"
            un-checked-children="音频"
          />
        </div>

        <div class="mb-4 h-[320px] overflow-hidden rounded bg-black">
          <FsRtcPlay
            ref="fsRtcPlayRef"
            :muted="false"
            :send-sdp-api="sendSdpApi"
          />
        </div>

        <Form layout="vertical">
          <Row :gutter="16">
            <Col :lg="10" :md="12" :xs="24">
              <Form.Item label="被叫号码" required>
                <Input
                  v-model:value="callForm.mobile"
                  allow-clear
                  placeholder="请输入被叫号码"
                />
              </Form.Item>
            </Col>
            <Col :lg="8" :md="12" :xs="24">
              <Form.Item label="按键号码">
                <Input
                  v-model:value="callForm.dtmf"
                  allow-clear
                  placeholder="请输入 DTMF 按键"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Space wrap>
          <Button type="primary" @click="startCall">拨打</Button>
          <Button danger @click="hangUp">挂断</Button>
          <Button @click="sendDtmf">发送按键</Button>
          <Button @click="refreshAgentStatus()">更新客服状态</Button>
        </Space>
      </Card>

      <Card title="客服状态">
        <Descriptions :column="1" bordered size="small">
          <Descriptions.Item label="客服名称">
            {{ agentState.agentName || '-' }}
          </Descriptions.Item>
          <Descriptions.Item label="客服账号">
            {{ agentState.agentKey || '-' }}
          </Descriptions.Item>
          <Descriptions.Item label="客服工号">
            {{ agentState.agentId || '-' }}
          </Descriptions.Item>
          <Descriptions.Item label="登录类型">
            {{ agentState.loginType || '-' }}
          </Descriptions.Item>
          <Descriptions.Item label="客服状态">
            {{ agentState.agentState || '-' }}
          </Descriptions.Item>
          <Descriptions.Item label="推流地址">
            {{ agentState.mediaAddress || '-' }}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  </Page>
</template>
