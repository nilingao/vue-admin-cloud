import StartNode from './StartNode.vue';
import ConditionNode from './ConditionNode.vue';
import PlaybackNode from './PlaybackNode.vue';

export enum NodeTypeEnum {
  START_NODE = 'start_node',
  CONDITION_NODE = 'condition_node',
  PLAYBACK_NODE = 'playback_node',
}
export const NodeInstanceMap = {
  [NodeTypeEnum.START_NODE]: StartNode,
  [NodeTypeEnum.CONDITION_NODE]: ConditionNode,
  [NodeTypeEnum.PLAYBACK_NODE]: PlaybackNode,
};
