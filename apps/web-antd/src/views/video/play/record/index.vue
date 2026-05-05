<script lang="ts" setup>
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import type { SliderValue } from 'ant-design-vue/es/slider';
import type { Dayjs } from 'dayjs';

import type { VideoRecordItem } from '#/api/video/record';

import { computed, onMounted, onUnmounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { useAccessStore } from '@vben/stores';

import {
  Button,
  DatePicker,
  Dropdown,
  Empty,
  List,
  Menu,
  message,
  Slider,
  Tag,
  TimeRangePicker,
} from 'ant-design-vue';
import dayjs from 'dayjs';

import {
  doRecordDownloadDel,
  doRecordDownloadList,
  doRecordDownloadStart,
  doRecordDownloadStop,
  doRecordList,
  doRecordSpeed,
  doRecordStartPlay,
  doRecordStopPlay,
} from '#/api/video/record';
import { VideoJessibucaPlay } from '#/components/Video';

const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm:ss';
const DAY_START = 0;
const DAY_END = 86_399;

const route = useRoute();
const router = useRouter();
const accessStore = useAccessStore();

const state = reactive({
  channelId: String(route.params.channelId ?? ''),
  deviceId: String(route.params.deviceId ?? ''),
  downloadStatus: false,
  loading: false,
  recordDate: dayjs(),
  recordList: [] as VideoRecordItem[],
  selectedStartTime: '',
  sliderRange: [DAY_START, DAY_END] as [number, number],
  streamId: '',
  timeRange: [
    dayjs('00:00:00', TIME_FORMAT),
    dayjs('23:59:59', TIME_FORMAT),
  ] as [Dayjs, Dayjs],
  videoUrl: '',
});

const marks = Object.fromEntries(
  Array.from({ length: 25 }, (_, hour) => [
    hour * 3600,
    `${String(hour).padStart(2, '0')}:00`,
  ]),
);

const title = computed(() => `国标录像：${state.deviceId}/${state.channelId}`);

function secondsToTime(seconds = 0) {
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds % 3600) / 60);
  const second = seconds % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(
    2,
    '0',
  )}:${String(second).padStart(2, '0')}`;
}

function timeToSeconds(value: string) {
  const time = value.includes(' ') ? value.split(' ').pop() || value : value;
  const [hour = '0', minute = '0', second = '0'] = time.split(':');
  return Number(hour) * 3600 + Number(minute) * 60 + Number(second);
}

function formatDateTime(time: string) {
  return dayjs(time).isValid() ? dayjs(time).format(TIME_FORMAT) : time;
}

function getPlayUrl(result: Record<string, any>) {
  const url =
    result.sslStatus === 0
      ? result.wsFlv?.url || result.flv?.url
      : result.wssFlv?.url || result.httpsFlv?.url;
  if (!url) {
    return '';
  }
  const token = accessStore.accessToken;
  if (!token) {
    return url;
  }
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}token=${encodeURIComponent(token)}`;
}

function setTimeRange(startSeconds: number, endSeconds: number) {
  state.sliderRange = [startSeconds, endSeconds];
  state.timeRange = [
    dayjs(secondsToTime(startSeconds), TIME_FORMAT),
    dayjs(secondsToTime(endSeconds), TIME_FORMAT),
  ];
}

async function loadRecords() {
  state.loading = true;
  try {
    const date = state.recordDate.format(DATE_FORMAT);
    const data = await doRecordList({
      channelId: state.channelId,
      deviceGbId: state.deviceId,
      endTime: `${date} 23:59:59`,
      startTime: `${date} 00:00:00`,
    });
    state.recordList = data.recordList ?? [];
    state.selectedStartTime = '';
    setTimeRange(DAY_START, DAY_END);
  } finally {
    state.loading = false;
  }
}

function onDateChange(value: Dayjs | string) {
  state.recordDate = dayjs(value);
  loadRecords();
}

function onRecordClick(item: VideoRecordItem) {
  if (state.selectedStartTime === item.startTime) {
    state.selectedStartTime = '';
    setTimeRange(DAY_START, DAY_END);
    return;
  }
  state.selectedStartTime = item.startTime;
  setTimeRange(timeToSeconds(item.startTime), timeToSeconds(item.endTime));
}

function onSliderChange(value: SliderValue) {
  if (!Array.isArray(value)) {
    return;
  }
  setTimeRange(Number(value[0]), Number(value[1]));
}

function onTimeRangeChange(
  value: [Dayjs | null, Dayjs | null] | [null | string, null | string] | null,
) {
  if (!value?.[0] || !value[1]) {
    return;
  }
  const [start, end] = value;
  const startText =
    typeof start === 'string' ? start : start.format(TIME_FORMAT);
  const endText = typeof end === 'string' ? end : end.format(TIME_FORMAT);
  setTimeRange(timeToSeconds(startText), timeToSeconds(endText));
}

async function stopPlayback(silent = false) {
  if (!state.streamId) {
    return;
  }
  await doRecordStopPlay({
    channelId: state.channelId,
    deviceId: state.deviceId,
    streamId: state.streamId,
  });
  state.streamId = '';
  state.videoUrl = '';
  if (!silent) {
    message.success('已停止录像回放');
  }
}

async function startPlayback() {
  const date = state.recordDate.format(DATE_FORMAT);
  const [start, end] = state.timeRange;
  const result = await doRecordStartPlay({
    channelId: state.channelId,
    deviceId: state.deviceId,
    endTime: `${date} ${end.format(TIME_FORMAT)}`,
    startTime: `${date} ${start.format(TIME_FORMAT)}`,
  });
  state.videoUrl = getPlayUrl(result);
  state.streamId = result.stream || result.streamId || '';
  message.success('开始录像回放');
}

async function onSpeedClick({ key }: MenuInfo) {
  if (!state.streamId) {
    return;
  }
  await doRecordSpeed({
    speed: key,
    streamId: state.streamId,
  });
  message.success(`已切换为 ${key} 倍速`);
}

async function toggleDownload() {
  const date = state.recordDate.format(DATE_FORMAT);
  const [start, end] = state.timeRange;
  if (!state.downloadStatus) {
    await doRecordDownloadStart({
      channelId: state.channelId,
      deviceGbId: state.deviceId,
      downloadSpeed: 4,
      endTime: `${date} ${end.format(TIME_FORMAT)}`,
      startTime: `${date} ${start.format(TIME_FORMAT)}`,
    });
    state.downloadStatus = true;
    message.success('已开始下载录像');
    return;
  }

  const list = await doRecordDownloadList();
  await Promise.all(
    list
      .filter((item) => item.stream)
      .map(async (item) => {
        await doRecordDownloadStop({
          channelId: state.channelId,
          deviceGbId: state.deviceId,
          stream: item.stream,
        });
        await doRecordDownloadDel({ key: item.stream });
      }),
  );
  state.downloadStatus = false;
  message.success('已取消下载录像');
}

function goBack() {
  router.push(`/video/play/channel/${state.deviceId}`);
}

onMounted(() => {
  loadRecords();
});

onUnmounted(() => {
  stopPlayback(true);
});
</script>

<template>
  <Page auto-content-height :title="title">
    <template #extra>
      <Button @click="goBack">返回</Button>
    </template>
    <div class="video-record-page">
      <aside class="video-record-side">
        <DatePicker
          :allow-clear="false"
          class="w-full"
          :value="state.recordDate"
          value-format="YYYY-MM-DD"
          @change="onDateChange"
        />
        <List
          v-if="state.recordList.length > 0"
          class="mt-3 flex-1 overflow-auto"
          :data-source="state.recordList"
          :loading="state.loading"
          size="small"
        >
          <template #renderItem="{ item }">
            <List.Item>
              <Tag
                class="record-item-tag"
                :color="
                  state.selectedStartTime === item.startTime
                    ? 'blue'
                    : 'default'
                "
                @click="onRecordClick(item)"
              >
                {{ formatDateTime(item.startTime) }} -
                {{ formatDateTime(item.endTime) }}
              </Tag>
            </List.Item>
          </template>
        </List>
        <div v-else class="flex flex-1 items-center justify-center">
          <Empty description="暂无录像" />
        </div>
      </aside>
      <section class="video-record-main">
        <div class="video-record-player">
          <VideoJessibucaPlay :has-audio="true" :video-url="state.videoUrl" />
        </div>
        <div class="video-record-controls">
          <div class="flex flex-wrap items-center justify-center gap-2">
            <TimeRangePicker
              :allow-clear="false"
              :value="state.timeRange"
              value-format="HH:mm:ss"
              @change="onTimeRangeChange"
            />
            <Button
              v-access:code="'video.play.record:play'"
              :disabled="!!state.streamId"
              size="small"
              type="primary"
              @click="startPlayback"
            >
              播放
            </Button>
            <Button
              v-access:code="'video.play.record:suspend'"
              :disabled="!state.streamId"
              size="small"
              @click="stopPlayback(false)"
            >
              暂停
            </Button>
            <Dropdown>
              <Button :disabled="!state.streamId" size="small">倍速</Button>
              <template #overlay>
                <Menu @click="onSpeedClick">
                  <Menu.Item key="0.25">0.25 倍速</Menu.Item>
                  <Menu.Item key="0.5">0.5 倍速</Menu.Item>
                  <Menu.Item key="1.0">1 倍速</Menu.Item>
                  <Menu.Item key="2.0">2 倍速</Menu.Item>
                  <Menu.Item key="4.0">4 倍速</Menu.Item>
                </Menu>
              </template>
            </Dropdown>
            <Button size="small" @click="toggleDownload">
              {{ state.downloadStatus ? '取消下载' : '下载录像' }}
            </Button>
          </div>
          <div class="relative mt-4 px-2">
            <Slider
              range
              :disabled="state.recordList.length === 0"
              :marks="marks"
              :max="DAY_END"
              :min="DAY_START"
              :tip-formatter="secondsToTime"
              :value="state.sliderRange"
              @change="onSliderChange"
            />
            <div v-if="!state.selectedStartTime" class="record-segments">
              <div
                v-for="record in state.recordList"
                :key="record.startTime"
                class="record-segment"
                :style="{
                  left: `${(timeToSeconds(record.startTime) / DAY_END) * 100}%`,
                  width: `${
                    ((timeToSeconds(record.endTime) -
                      timeToSeconds(record.startTime)) /
                      DAY_END) *
                    100
                  }%`,
                }"
              ></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </Page>
</template>

<style scoped>
.video-record-page {
  display: flex;
  gap: 16px;
  height: 100%;
  min-height: 620px;
}

.video-record-side {
  display: flex;
  flex-direction: column;
  width: 280px;
  min-width: 240px;
  padding: 12px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
}

.video-record-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.video-record-player {
  flex: 1;
  min-height: 460px;
  background: #000;
}

.video-record-controls {
  padding: 12px 18px 18px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
}

.record-item-tag {
  width: 100%;
  text-align: center;
  cursor: pointer;
}

.record-segments {
  position: absolute;
  top: 31px;
  right: 8px;
  left: 8px;
  height: 4px;
  pointer-events: none;
}

.record-segment {
  position: absolute;
  height: 4px;
  background: #1677ff;
}
</style>
