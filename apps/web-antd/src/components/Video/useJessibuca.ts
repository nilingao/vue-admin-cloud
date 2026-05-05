import type { Ref } from 'vue';

import { nextTick, reactive, unref, watch } from 'vue';

interface JessibucaPlayer {
  cancelMute?: () => void;
  destroy?: () => void;
  hasLoaded?: () => boolean;
  mute?: () => void;
  on?: (name: string, callback: (...args: any[]) => void) => void;
  pause?: () => void;
  play?: (url?: string) => void;
  resize?: () => void;
  screenshot?: () => void;
  setFullscreen?: (fullscreen: boolean) => void;
}

export interface JessibucaProps {
  hasAudio?: boolean;
  isMute?: boolean;
  options?: Record<string, any>;
  videoUrl?: string;
}

const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';
let scriptPromise: Promise<void> | undefined;

function loadJessibucaScript() {
  if ((window as any).Jessibuca) {
    return Promise.resolve();
  }
  if (scriptPromise) {
    return scriptPromise;
  }
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${publicPath}script/jessibuca/jessibuca.js`;
    script.async = true;
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () =>
      reject(new Error('Jessibuca 播放器加载失败')),
    );
    document.head.append(script);
  });
  return scriptPromise;
}

function isBlank(value?: string) {
  return !value || value.trim().length === 0;
}

export function useJessibuca(
  container: Ref<HTMLElement | undefined>,
  jessibucaProps: JessibucaProps,
) {
  let jessibucaPlayer: JessibucaPlayer | undefined;
  let playTimer: ReturnType<typeof setInterval> | undefined;
  let resizeObserver: ResizeObserver | undefined;

  const stats = reactive({
    destroy: true,
    fullscreen: false,
    isMute: jessibucaProps.isMute || false,
    kBps: 0,
    performance: '',
    playing: false,
  });

  const options = {
    autoWasm: true,
    background: '',
    controlAutoHide: false,
    debug: import.meta.env.DEV,
    decoder: `${publicPath}script/jessibuca/decoder.js`,
    forceNoOffscreen: false,
    hasAudio: jessibucaProps.hasAudio ?? true,
    hasVideo: true,
    heartTimeout: 5,
    heartTimeoutReplay: true,
    heartTimeoutReplayTimes: 3,
    hiddenAutoPause: false,
    hotKey: true,
    isFlv: false,
    isFullResize: false,
    isNotMute: stats.isMute,
    isResize: false,
    keepScreenOn: true,
    loadingText: '视频加载中...',
    loadingTimeout: 10,
    loadingTimeoutReplay: true,
    loadingTimeoutReplayTimes: 3,
    openWebglAlignment: false,
    operateBtns: {
      audio: false,
      fullscreen: false,
      play: false,
      record: false,
      screenshot: false,
    },
    recordType: 'mp4',
    rotate: 0,
    showBandwidth: false,
    supportDblclickFullscreen: false,
    timeout: 10,
    useMSE: true,
    useWCS: location.hostname === 'localhost' || location.protocol === 'https:',
    useWebFullScreen: true,
    videoBuffer: 0.1,
    wasmDecodeErrorReplay: true,
    wcsUseVideoRender: true,
    ...jessibucaProps.options,
  };

  function createPlayer() {
    const target = unref(container);
    if (!target || isBlank(jessibucaProps.videoUrl)) {
      return;
    }
    jessibucaPlayer = new (window as any).Jessibuca({
      container: target,
      ...options,
    });
    jessibucaPlayer?.on?.('pause', () => {
      stats.playing = false;
    });
    jessibucaPlayer?.on?.('play', () => {
      stats.playing = true;
    });
    jessibucaPlayer?.on?.('fullscreen', (fullscreen: boolean) => {
      stats.fullscreen = fullscreen;
    });
    jessibucaPlayer?.on?.('mute', (muted: boolean) => {
      stats.isMute = !muted;
    });
    jessibucaPlayer?.on?.('performance', (performance: number) => {
      stats.performance =
        performance === 2 ? '非常流畅' : (performance === 1 ? '流畅' : '卡顿');
    });
    jessibucaPlayer?.on?.('kBps', (kBps: number) => {
      stats.kBps = Math.round(kBps);
    });
    resizeObserver = new ResizeObserver(() => jessibucaPlayer?.resize?.());
    resizeObserver.observe(target);
    stats.destroy = false;
  }

  async function play(url?: string) {
    const playUrl = url || jessibucaProps.videoUrl;
    if (isBlank(playUrl)) {
      return;
    }
    try {
      await loadJessibucaScript();
    } catch {
      return;
    }
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = undefined;
    }
    await nextTick();
    if (!jessibucaPlayer) {
      createPlayer();
    }
    if (!jessibucaPlayer) {
      return;
    }
    if (jessibucaPlayer.hasLoaded?.()) {
      jessibucaPlayer.play?.(playUrl);
      return;
    }
    jessibucaPlayer.on?.('load', () => jessibucaPlayer?.play?.(playUrl));
  }

  function pause(isPlay: boolean) {
    stats.playing = isPlay;
    if (!isPlay) {
      jessibucaPlayer?.pause?.();
      return;
    }
    if (stats.destroy) {
      play();
    } else {
      jessibucaPlayer?.play?.();
    }
  }

  function screenshot() {
    jessibucaPlayer?.screenshot?.();
  }

  function onMute(isMute: boolean) {
    stats.isMute = isMute;
    if (isMute) {
      jessibucaPlayer?.cancelMute?.();
    } else {
      jessibucaPlayer?.mute?.();
    }
  }

  function fullscreenSwitch(fullscreen: boolean) {
    stats.fullscreen = fullscreen;
    jessibucaPlayer?.setFullscreen?.(fullscreen);
  }

  function refresh() {
    destroy();
    play();
  }

  function destroy() {
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = undefined;
    }
    resizeObserver?.disconnect();
    resizeObserver = undefined;
    stats.destroy = true;
    stats.kBps = 0;
    stats.performance = '';
    stats.playing = false;
    jessibucaPlayer?.destroy?.();
    jessibucaPlayer = undefined;
  }

  watch(
    () => jessibucaProps.videoUrl,
    () => {
      destroy();
      play();
    },
    { immediate: true },
  );

  return {
    destroy,
    fullscreenSwitch,
    onMute,
    pause,
    play,
    refresh,
    screenshot,
    stats,
  };
}
