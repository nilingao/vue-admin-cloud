import StartNode from './StartNode.vue';
import ConditionNode from './ConditionNode.vue';
import PlaybackNode from './PlaybackNode.vue';
import HangupNode from './HangupNode.vue';
import DigitsNode from './DigitsNode.vue';
import TransferNode from './TransferNode.vue';

export enum NodeTypeEnum {
  START_NODE = 'START_NODE',
  CONDITION_NODE = 'CONDITION_NODE',
  PLAYBACK_NODE = 'PLAYBACK_NODE',
  HANGUP_NODE = 'HANGUP_NODE',
  DIGITS_NODE = 'DIGITS_NODE',
  TRANSFER_NODE = 'TRANSFER_NODE',
}
export const NodeInstanceMap = {
  [NodeTypeEnum.START_NODE]: StartNode,
  [NodeTypeEnum.CONDITION_NODE]: ConditionNode,
  [NodeTypeEnum.PLAYBACK_NODE]: PlaybackNode,
  [NodeTypeEnum.HANGUP_NODE]: HangupNode,
  [NodeTypeEnum.DIGITS_NODE]: DigitsNode,
  [NodeTypeEnum.TRANSFER_NODE]: TransferNode,
};
