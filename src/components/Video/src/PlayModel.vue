<template>
  <BasicModal
    v-bind="$attrs"
    centered
    destroyOnClose
    :maskClosable="false"
    @register="registerModal"
    title="播放器"
    @cancel="handleCancel"
    width="1200px"
    :footer="null"
  >
    <div :class="` ${prefixCls} flex flex-row gap-x-px `">
      <div
        :class="
          props.control
            ? `${prefixCls}-left grid grid-rows-16  grid-cols-1 basis-16/20`
            : `${prefixCls}-left grid grid-rows-16  grid-cols-1 grow`
        "
      >
        <!-- 选择器 :footer="{ disabled: true }"-->
        <div :class="`${prefixCls}-left-top row-span-1`">
          <RadioButtonGroup
            :value="stats.selectPlay"
            :options="stats.options"
            @change="handleSelectPlay"
          />
        </div>
        <!-- 播放器 -->
        <div :class="`${prefixCls}-left-video bg-black grid row-span-15`">
          <component ref="payVideo" :is="payComponent" :videoUrl="payUrl" :hasAudio="true" />
        </div>
        <!-- 播放地址 -->
        <div
          :class="`${prefixCls}-left-bot mt-2 row-span-0 space-y-2`"
          v-if="stats.selectPlay === 'Stream'"
        >
          <Input v-model:value="payUrl" disabled>
            <template #addonBefore>
              <Dropdown trigger="click" :overlayClassName="`${prefixCls}-left-dropdown`">
                <template #overlay>
                  <Menu @click="handleMenuClick">
                    <MenuItem :key="val" v-for="val in Object.keys(stats.streamMap)">
                      <Input :defaultValue="stats.streamMap[val].value" disabled>
                        <template #addonBefore>
                          {{ stats.streamMap[val].name }}
                        </template>
                        <template #addonAfter>
                          <Button
                            :class="`${prefixCls}-left-bot-cope`"
                            @click="handleCopy(stats.streamMap[val].value)"
                            >复制</Button
                          >
                        </template>
                      </Input>
                    </MenuItem>
                  </Menu>
                </template>
                <Button :class="`${prefixCls}-left-bot-cope`">
                  更多地址
                  <Icon class="cursor-pointer" icon="ic-baseline-keyboard-arrow-down" />
                </Button>
              </Dropdown>
            </template>
            <template #addonAfter>
              <Button
                :class="`${prefixCls}-left-bot-cope`"
                @click="handleCopy(stats.streamMap[stats.playType].value)"
                >复制</Button
              >
            </template>
          </Input>
        </div>
      </div>
      <Divider v-if="props.control" style="height: inherit" type="vertical" />
      <div v-if="props.control" :class="`${prefixCls}-right basis-4/20 row-span-3 flex flex-col `">
        <!-- 方向控制 -->
        <PlayDirection
          :deviceId="stats.deviceId"
          :channelId="stats.channelId"
          :auth="auth"
          :audioPushApi="audioPushApi"
          :broadcastApi="broadcastApi"
          :stopPushApi="stopPushApi"
          @options-contro-speed="handleControSpeed"
        />
        <!-- 云台控制 -->
        <PlayPTZ
          :deviceId="stats.deviceId"
          :channelId="stats.channelId"
          :controSpeed="stats.controSpeed"
        />
        <!-- 流信息 -->
        <PlayStream :app="stats.app" :stream="stats.stream" :mediaServerId="stats.mediaServerId" />
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import PlayDirection from './components/PlayDirection.vue';
  import PlayPTZ from './components/PlayPTZ.vue';
  import PlayStream from './components/PlayStream.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { reactive, ref, unref, computed, nextTick, defineAsyncComponent } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { RadioButtonGroup } from '@/components/Form';
  import { useDesign } from '@/hooks/web/useDesign';
  import { isEmpty } from '@/utils/is';
  import { setObjToUrlParams } from '@/utils';
  import { useMessage } from '@/hooks/web/useMessage';
  import { copyText } from '@/utils/copyTextToClipboard';
  import { Input, Button, Divider, Dropdown, Menu, MenuItem } from 'ant-design-vue';

  const VideoJessibucaPlay = defineAsyncComponent(() => import('./VideoJessibucaPlay.vue'));
  const VideoZlmRtcPlay = defineAsyncComponent(() => import('./VideoZlmRtcPlay.vue'));
  const payVideo = ref();
  const { prefixCls } = useDesign('video-play-model');
  const { createMessage } = useMessage();
  const payComponent: any = computed(() => {
    if (stats.selectPlay == 'Stream') {
      return VideoJessibucaPlay;
    } else if (stats.selectPlay == 'ZlmRtc') {
      return VideoZlmRtcPlay;
    }
  });

  const props = defineProps({
    //播放url
    control: {
      type: Boolean,
      default: false,
    },
    auth: {
      type: String,
      default: null,
    },
    //获取推流地址
    audioPushApi: {
      type: Function as PropType<PromiseFn>,
      default: null,
    },
    //广播推流地址
    broadcastApi: {
      type: Function as PropType<PromiseFn>,
      default: null,
    },
    //广播推流注销
    stopPushApi: {
      type: Function as PropType<PromiseFn>,
      default: null,
    },
  });
  const stats = reactive({
    //视频相关
    selectPlay: 'Stream', //选择的播放器
    playType: 'wsFlv', //默认播放地址
    playing: true, //播放状态
    options: [
      {
        label: 'Stream',
        value: 'Stream',
      },
      {
        label: 'ZlmRtc',
        value: 'ZlmRtc',
      },
    ], //播放器信息
    //控制相关
    controSpeed: 30, //方向速度
    //视频流相关
    app: '', //app编号
    stream: '', //流编号
    deviceId: '', //设备编号
    channelId: '', //通道编号
    mediaServerId: '', //流媒体编号
    tracks: [] as any, // 流编码信息
    zlmRtcUrl: {} as any, //zlmrtc播放地址
    streamMap: {} as any, //jessibuca播放地址
  });

  //获取播放地址
  const payUrl = computed(() => {
    let url;
    if (stats.selectPlay === 'Stream') {
      url = stats.streamMap[stats.playType]?.value;
    } else {
      url = stats.zlmRtcUrl?.value;
    }
    return url;
  });
  const handleSelectPlay = (item) => {
    if (typeof item !== 'string') {
      return;
    }
    stats.selectPlay = item;
  };
  //复制触发
  const handleCopy = (value) => {
    if (!value) {
      createMessage.warning('未获取要拷贝的内容！');
      return;
    }
    copyText(value);
  };
  //下拉更多点击
  const handleMenuClick = (val) => {
    stats.playType = val.key; //切换播放key
  };
  const authUrl = (url) => {
    if (isEmpty(props.auth)) {
      return url;
    }
    return setObjToUrlParams(url, { token: props.auth });
  };
  const handleControSpeed = (val) => {
    stats.controSpeed = val;
  };

  const handleCancel = () => {
    unref(payVideo).destroy();
  };

  const [registerModal, { setModalProps }] = useModalInner((data) => {
    setModalProps({ confirmLoading: false });
    if (!data) {
      return;
    }
    const {
      sslStatus,
      app,
      stream,
      deviceId,
      channelId,
      mediaServerId,
      tracks,
      flv,
      wsFlv,
      ts,
      wsTs,
      httpsFlv,
      wssFlv,
      httpsTs,
      wssTs,
      rtc,
      rtcs,
    } = data;
    stats.app = app;
    stats.stream = stream;
    stats.deviceId = deviceId;
    stats.channelId = channelId;
    stats.mediaServerId = mediaServerId;
    stats.tracks = tracks;
    stats.streamMap = {
      hls: {
        name: 'flv地址',
        value: authUrl(sslStatus == 0 ? flv?.url : httpsFlv?.url),
      },
      wsFlv: {
        name: 'wsFlv地址',
        value: authUrl(sslStatus == 0 ? wsFlv?.url : wssFlv?.url),
      },
      ts: {
        name: 'ts地址',
        value: authUrl(sslStatus == 0 ? ts?.url : httpsTs?.url),
      },
      wsTs: {
        name: 'wsTs地址',
        value: authUrl(sslStatus == 0 ? wsTs?.url : wssTs?.url),
      },
    };
    stats.zlmRtcUrl = {
      name: 'rtc地址',
      value: authUrl(sslStatus == 0 ? rtc?.url : rtcs?.url),
    };
    nextTick(() => {
      unref(payVideo)?.play();
    });
  });
</script>
<style lang="less">
  .ant-modal div[aria-hidden='true'] {
    display: none !important;
  }
  @prefix-cls: ~'@{namespace}-video-play-model';
  .@{prefix-cls} {
    min-height: 680px;

    &-left {
      min-width: 600px;

      &-bot {
        &-cope {
          height: 30px;
          border: none;
        }

        .ant-input-group-addon {
          padding: 0;
        }
      }

      &-dropdown {
        width: 853px;

        .ant-dropdown-menu-item {
          padding: 4px 1px;
        }

        .ant-input-group-addon {
          padding: 0;
        }

        .ant-input-group-addon:nth-of-type(1) {
          width: 108px;
        }

        .ant-input-group-addon:nth-of-type(2) {
          width: 63px;
        }
      }
    }

    &-right {
      min-width: 300px;

      .ant-divider-with-text-center {
        margin: 5px 0;
      }
    }
  }
</style>
