import ConditionNode from '../ConditionNode.vue';
import DigitsNode from '../DigitsNode.vue';
import HangupNode from '../HangupNode.vue';
import PlaybackNode from '../PlaybackNode.vue';
import StartNode from '../StartNode.vue';
import TransferNode from '../TransferNode.vue';

export enum NodeTypeEnum {
  CONDITION_NODE = 'CONDITION_NODE',
  DIGITS_NODE = 'DIGITS_NODE',
  HANGUP_NODE = 'HANGUP_NODE',
  PLAYBACK_NODE = 'PLAYBACK_NODE',
  START_NODE = 'START_NODE',
  TRANSFER_NODE = 'TRANSFER_NODE',
}

export const NodeInstanceMap = {
  [NodeTypeEnum.CONDITION_NODE]: ConditionNode,
  [NodeTypeEnum.DIGITS_NODE]: DigitsNode,
  [NodeTypeEnum.HANGUP_NODE]: HangupNode,
  [NodeTypeEnum.PLAYBACK_NODE]: PlaybackNode,
  [NodeTypeEnum.START_NODE]: StartNode,
  [NodeTypeEnum.TRANSFER_NODE]: TransferNode,
};
