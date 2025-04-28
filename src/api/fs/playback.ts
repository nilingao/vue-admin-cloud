import { defHttp } from '@/utils/http/axios';
import { PlaybackEntity, PlaybackParams, PlaybackPageResultModel } from './model/playbackModel';

enum Api {
  page = '/webapi/fs/playback/page',
  detail = '/webapi/fs/playback/detail',
  save = '/webapi/fs/playback/save',
  remove = '/webapi/fs/playback/remove',
}

export function doPlaybackPage(params: PlaybackParams) {
  return defHttp.post<PlaybackPageResultModel>({ url: Api.page, params });
}

export function doPlaybackDetail(params: { id: number }) {
  return defHttp.get<PlaybackEntity>({ url: Api.detail, params });
}

export function doPlaybackSave(params: PlaybackEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doPlaybackRemove(params: { id: number }) {
  return defHttp.post({ url: Api.remove, params });
}
