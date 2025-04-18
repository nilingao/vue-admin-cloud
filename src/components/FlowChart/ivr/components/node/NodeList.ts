import StartNode from './StartNode.vue';
import ConditionNode from './ConditionNode.vue';
import PlaybackNode from './PlaybackNode.vue';
import HangupNode from './HangupNode.vue';
import DigitsNode from './DigitsNode.vue';

export enum NodeTypeEnum {
  START_NODE = 'start_node',
  CONDITION_NODE = 'condition_node',
  PLAYBACK_NODE = 'playback_node',
  HANGUP_NODE = 'hangup_node',
  DIGITS_NODE = 'digits_node',
}
export const NodeInstanceMap = {
  [NodeTypeEnum.START_NODE]: StartNode,
  [NodeTypeEnum.CONDITION_NODE]: ConditionNode,
  [NodeTypeEnum.PLAYBACK_NODE]: PlaybackNode,
  [NodeTypeEnum.HANGUP_NODE]: HangupNode,
  [NodeTypeEnum.DIGITS_NODE]: DigitsNode,
};
