import ButtonEdge from './ButtonEdge.vue';

export enum EdgeTypeEnum {
  BUTTON_EDGE = 'button_edge',
}
export const EdgeInstanceMap = {
  [EdgeTypeEnum.BUTTON_EDGE]: ButtonEdge,
};
