import type { Recordable } from '@vben/types';

import type { AreaEntity, DictionaryItemEntity } from '#/api';

import { defineStore } from 'pinia';

import { doDictionaryItemMap, getAreaInfoList, getSystem } from '#/api';

interface SystemState {
  systemConfigMap: Recordable<string>;
  areaList: AreaEntity[] | undefined;
  dictMap: Record<string, Array<DictionaryItemEntity>> | undefined;
}

export const useSystemStore = defineStore('app-system', {
  persist: {
    // 持久化
    pick: ['systemConfigMap', 'areaList', 'dictMap'],
  },
  state: (): SystemState => ({
    systemConfigMap: {} as Record<string, string>,
    areaList: [],
    dictMap: {},
  }),
  getters: {
    getSystemConfigMap(): Recordable<any> {
      return { ...this.systemConfigMap };
    },
    getAreaList(): AreaEntity[] {
      return [...(this.areaList || [])];
    },
    getDictMap(): Record<string, Array<DictionaryItemEntity>> {
      return { ...this.dictMap };
    },
  },
  actions: {
    setSystemConfigMap(systemConfigMap: Recordable<string>) {
      this.systemConfigMap = systemConfigMap;
    },
    setAreaList(areaList: Array<AreaEntity>) {
      this.areaList = areaList;
    },
    setDictMap(dictMap: Record<string, Array<DictionaryItemEntity>>) {
      this.dictMap = dictMap;
    },

    getSystemConfig(systemKey: string): string {
      return this.systemConfigMap[systemKey] as string;
    },
    async getSystemConfigAction(): Promise<Recordable<any>> {
      const systemList = await getSystem();
      const systemMap: Recordable<string> = {};
      systemList.forEach((obj) => {
        systemMap[obj.k] = obj.v;
      });
      this.setSystemConfigMap(systemMap);
      return systemMap;
    },
    async getAreaListAction(): Promise<AreaEntity[]> {
      const areaList = await getAreaInfoList();
      this.setAreaList(areaList);
      return areaList;
    },
    async getDictMapAction(): Promise<
      Record<string, Array<DictionaryItemEntity>>
    > {
      const enumMap = await doDictionaryItemMap();
      this.setDictMap(enumMap);
      return enumMap;
    },
  },
});
