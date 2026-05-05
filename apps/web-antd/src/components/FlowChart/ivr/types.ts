export enum ToolbarTypeEnum {
  FIT_VIEW = 'fitView',
  RANDOM_VIEW = 'randomView',
  RESET_ZOOM = 'resetZoom',
  VIEW_DATA = 'viewData',
  ZOOM_IN = 'zoomIn',
  ZOOM_OUT = 'zoomOut',
}

export interface ToolbarConfig {
  disabled?: boolean;
  icon?: string;
  separate?: boolean;
  tooltip?: string;
  type?: ToolbarTypeEnum;
}

export interface NodeFields {
  globeLabel: string;
  label: string;
  value: string;
}

export interface NodeConfig {
  fields?: NodeFields[];
}

export interface NodeData {
  config?: NodeConfig;
  label: string;
  nodeData?: Record<string, any>;
  nodeId?: number | string;
  type?: string;
}

export interface BranchCondition {
  height?: number;
  id: number | string;
  index: number;
  nextNodeId?: number | string;
}

export interface Condition {
  checkId?: number | string;
  compare: number;
  field: string;
  value: string;
}

export interface Branch {
  checkId?: number | string;
  condition: number;
  conditions: Condition[];
  id: number | string;
  type: number;
}

export const branchConditionOptions = [
  { label: '为空', value: 1 },
  { label: '不为空', value: 2 },
  { label: '包含', value: 3 },
  { label: '不包含', value: 4 },
  { label: '等于', value: 5 },
  { label: '不等于', value: 6 },
  { label: '大于', value: 7 },
  { label: '大于等于', value: 8 },
  { label: '小于', value: 9 },
  { label: '小于等于', value: 10 },
  { label: '长度大于', value: 11 },
  { label: '长度大于等于', value: 12 },
  { label: '长度小于', value: 13 },
  { label: '长度小于等于', value: 14 },
  { label: '长度等于', value: 15 },
  { label: '介于', value: 16 },
];

export const conditionOptions = [
  { label: '包含', value: 1 },
  { label: '任意', value: 2 },
];

export const playTypeOptions = [
  { label: '使用语音文件', value: 1 },
  { label: '文本转语音', value: 2 },
];

export const transferTypeOptions = [
  { label: '转技能组', value: 'TRANSFER_GROUP' },
  { label: '转坐席', value: 'TRANSFER_AGENT' },
  { label: '转外线', value: 'TRANSFER_EXTERNAL' },
  { label: '转 VDN', value: 'TRANSFER_VDN' },
  { label: '转 IVR', value: 'TRANSFER_IVR' },
];

export const playbackOptions = [
  { label: '欢迎语音', value: 1 },
  { label: '忙线提示', value: 2 },
  { label: '非工作时间提示', value: 3 },
];

export const skillOptions = [
  { label: '默认技能组', value: 1 },
  { label: '售后技能组', value: 2 },
];

export const agentOptions = [
  { label: '1001 坐席', value: 1 },
  { label: '1002 坐席', value: 2 },
];
