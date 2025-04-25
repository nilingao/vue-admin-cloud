export enum ToolbarTypeEnum {
  ZOOM_IN = 'zoomIn',
  ZOOM_OUT = 'zoomOut',
  RESET_ZOOM = 'resetZoom',
  FIT_VIEW = 'fitView',
  RANDOM_VIEW = 'randomView',
  UNDO = 'undo',
  REDO = 'redo',

  SNAPSHOT = 'snapshot',
  VIEW_DATA = 'viewData',
}
export interface ToolbarConfig {
  type?: string | ToolbarTypeEnum;
  tooltip?: string | boolean;
  icon?: string;
  disabled?: boolean;
  separate?: boolean;
}

//通用节点参数
export interface NodeData {
  nodeId: number; //1.IF 2.ELSE IF 3.ELSE
  type: string;
  label: string;
  config?: NodeConfig; //配置
}
export interface NodeConfig {
  fields?: NodeFields[];
}

export interface NodeFields {
  label: string;
  value: string;
  globeLabel: string;
}

//开始节点
export interface StartNodeData extends NodeData {}

//条件节点
export interface ConditionNodeData extends NodeData {
  nodeData: BranchNodeData; //配置
}
export interface BranchNodeData {
  branch: Branch[];
  branchConditionList: BranchCondition[];
}
export interface Branch {
  id: string;
  checkId?: string;
  type: number; //1.IF 2.ELSE IF 3.ELSE
  condition: number;
  conditions: Condition[];
}
export interface Condition {
  checkId?: string;
  field: string;
  compare: number;
  value: string;
}
export interface BranchCondition {
  id: string;
  index: number;
  height: number;
}
//条件节点枚举
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
// 语音节点
export interface PlaybackNodeData extends NodeData {
  nodeData: PlaybackData; //配置
}
export interface PlaybackData {
  playId?: number;
  playType: number; //播放类型 1.语音文件播放 2.tts播放
  playback: number;
  content: string;
  retry?: number;
  dtmfMax?: number;
  dtmfMin?: number;
  dtmfEnd?: string;
  dtmfTimeout?: number;
  dtmfDigitTimeout?: number;
  dtmfErrorType?: number;
  dtmfErrorPlayback?: number;
  dtmfErrorContext?: string;
}
export const playTypeOptions = [
  { label: '使用语音文件', value: 1 },
  { label: '文本转语音', value: 2 },
];
//收号节点
export interface DigitsNodeData extends NodeData {
  nodeData: PlaybackData; //配置
}

// 转接节点
export interface TransferNodeData extends NodeData {
  nodeData: TransferNodeData; //配置
}
export interface TransferNodeData {
  routeType: string;
  skillId: number;
  agentId: number;
  outPhone: string;
  sipTrunkId: number;
  vdnId: number;
  ivrId: number;
}
export const transferTypeOptions = [
  { label: '转技能组', value: 'TRANSFER_GROUP' },
  { label: '转坐席', value: 'TRANSFER_AGENT' },
  { label: '转外线', value: 'TRANSFER_EXTERNAL' },
  { label: '转VDN', value: 'TRANSFER_VDN' },
  { label: '转IVR', value: 'TRANSFER_IVR' },
];

// 挂机节点
export interface HangupNodeData extends NodeData {}
