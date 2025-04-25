import type { Node, Edge } from '@vue-flow/core';
import { ref } from 'vue';

export const nodes = ref<Node[]>([
  // an input node, specified by using `type: 'input'`
  {
    id: '1',
    type: 'START_NODE',
    position: { x: 0, y: 0 },
    // all nodes can have a data object containing any data you want to pass to the node
    // a label can property can be used for default nodes
    data: {
      label: '开始',
      config: {
        fields: [
          {
            label: '通话唯一标识',
            value: 'callId',
            globeLabel: '{{GLOBAL_VARIABLE.CALL_ID}}',
          },
          {
            label: '主叫',
            value: 'caller',
            globeLabel: '{{$GLOBAL_VARIABLE.CALLER}}',
          },
          {
            label: '被叫',
            value: 'callee',
            globeLabel: '{{GLOBAL_VARIABLE.CALLED}}',
          },
          {
            label: '月份',
            value: 'month',
            globeLabel: '{{GLOBAL_VARIABLE.MONTH}}',
          },
          {
            label: '日期',
            value: 'day',
            globeLabel: '{{GLOBAL_VARIABLE.WEEK}}',
          },
          {
            label: '当前时间',
            value: 'time',
            globeLabel: '{{GLOBAL_VARIABLE.DATE}}',
          },
          {
            label: '星期',
            value: 'week',
            globeLabel: '{{GLOBAL_VARIABLE.TIME}}',
          },
        ],
      },
    },
  },
  {
    id: '2',
    type: 'CONDITION_NODE',
    position: { x: 350, y: -32 },
    data: {
      label: '判断器1',
      config: {
        fields: [],
      },
      nodeData: {
        branch: [
          {
            conditions: [
              {
                field: 'GLOBAL_VARIABLE.WEEK',
                compare: 5,
                value: '参观',
              },
            ],
            id: '4328',
            type: 'IF',
            condition: 1,
          },
          {
            conditions: [
              {
                field: 'GLOBAL_VARIABLE.WEEK',
                compare: 5,
                value: '本科',
              },
            ],
            type: 'ELSE IF 1',
            id: '2373',
            condition: 1,
          },
          {
            conditions: [
              {
                field: 'GLOBAL_VARIABLE.WEEK',
                compare: 5,
                value: '硕士',
              },
            ],
            type: 'ELSE IF 2',
            id: '4022',
            condition: 1,
          },
          {
            conditions: [],
            id: '9605',
            type: 'ELSE',
            condition: 1,
          },
        ],
        branchConditionList: [
          {
            index: 0,
            id: '4328',
          },
          {
            index: 1,
            id: '2373',
          },
          {
            index: 2,
            id: '4022',
          },
          {
            index: 3,
            id: '9605',
          },
        ],
      },
    },
  },
  {
    id: '3',
    type: 'PLAYBACK_NODE',
    position: { x: 1022, y: -4 },
    data: {
      label: '放音',
      config: {
        fields: [
          {
            label: '内容',
            value: 'TEXT',
            globeLabel: '{{放音.TEXT}}',
          },
        ],
      },
      nodeData: {
        playType: 1,
        playback: '1',
        content: '1',
      },
    },
  },
  {
    id: '4',
    type: 'HANGUP_NODE',
    position: { x: 1022, y: 136 },
    data: {
      label: '结束',
      config: {
        fields: [],
      },
    },
  },
  {
    id: '5',
    type: 'DIGITS_NODE',
    position: { x: 1598, y: -26 },
    data: {
      label: '收号',
      config: {
        fields: [
          {
            label: '内容',
            value: 'DTMF',
            globeLabel: '{{收号.DTMF}}',
          },
        ],
      },
      nodeData: {
        playType: 1,
        playback: '1',
        content: '1',
        retry: '1',
        dtmfMax: '1',
        dtmfMin: '1',
        dtmfEnd: '*',
        dtmfTimeout: '5000',
        dtmfDigitTimeout: '5000',
        dtmfErrorType: 1,
        dtmfErrorPlayback: '1',
        dtmfErrorContext: '1',
      },
    },
  },
  {
    id: '6',
    type: 'TRANSFER_NODE',
    position: { x: 2098, y: -26 },
    data: {
      label: '转接',
      config: {
        fields: [
          {
            label: '内容',
            value: 'DTMF',
            globeLabel: '{{收号.DTMF}}',
          },
        ],
      },
      nodeData: {
        routeType: 'TRANSFER_GROUP',
        skillId: 1,
        agentId: 1,
        outPhone: '18789432816',
        sipTrunkId: 1,
        vdnId: 1,
        ivrId: 1,
      },
    },
  },
]);

// these are our edges
export const edges = ref<Edge[]>([
  {
    id: 'start_node_id-source-6-target',
    type: 'button_edge',
    source: 'start_node_id',
    target: '6',
    sourceHandle: 'start_node_id-source',
    targetHandle: '6-target',
  },
  {
    id: '6-source-3-3-target',
    type: 'button_edge',
    source: '6',
    target: '3',
    sourceHandle: '6-source-3',
    targetHandle: '3-target',
  },
  {
    id: '3-source-7-target',
    type: 'button_edge',
    source: '3',
    target: '7',
    sourceHandle: '3-source',
    targetHandle: '7-target',
  },
  {
    id: '7-source-11-11-target',
    type: 'button_edge',
    source: '7',
    target: '11',
    sourceHandle: '7-source-11',
    targetHandle: '11-target',
  },
  {
    id: '11-source-5-target',
    type: 'button_edge',
    source: '11',
    target: '5',
    sourceHandle: '11-source',
    targetHandle: '5-target',
  },
  {
    id: '7-source-12-12-target',
    type: 'button_edge',
    source: '7',
    target: '12',
    sourceHandle: '7-source-12',
    targetHandle: '12-target',
  },
  {
    id: '12-source-5-target',
    type: 'button_edge',
    source: '12',
    target: '5',
    sourceHandle: '12-source',
    targetHandle: '5-target',
  },
  {
    id: '7-source-4-4-target',
    type: 'button_edge',
    source: '7',
    target: '4',
    sourceHandle: '7-source-4',
    targetHandle: '4-target',
  },
  {
    id: '4-source-5-target',
    type: 'button_edge',
    source: '4',
    target: '5',
    sourceHandle: '4-source',
    targetHandle: '5-target',
  },
  {
    id: '7-source-5-5-target',
    type: 'button_edge',
    source: '7',
    target: '5',
    sourceHandle: '7-source-5',
    targetHandle: '5-target',
  },
  {
    id: '7-source-5-5-target',
    type: 'button_edge',
    source: '7',
    target: '5',
    sourceHandle: '7-source-5',
    targetHandle: '5-target',
  },
  {
    id: '6-source-8-8-target',
    type: 'button_edge',
    source: '6',
    target: '8',
    sourceHandle: '6-source-8',
    targetHandle: '8-target',
  },
  {
    id: '8-source-5-target',
    type: 'button_edge',
    source: '8',
    target: '5',
    sourceHandle: '8-source',
    targetHandle: '5-target',
  },
]);
