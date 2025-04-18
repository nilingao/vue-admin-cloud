import type { Node, Edge } from '@vue-flow/core';
import { ref } from 'vue';

export const nodes = ref<Node[]>([
  // an input node, specified by using `type: 'input'`
  {
    id: '1',
    type: 'start_node',
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
    type: 'condition_node',
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
                field: ['1', 'week'],
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
                field: ['1', 'month'],
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
                field: ['1', 'day'],
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
      },
      branchConditionList: [
        {
          index: 0,
          height: 96,
          id: '4328',
        },
        {
          index: 1,
          height: 96,
          id: '2373',
        },
        {
          index: 2,
          height: 96,
          id: '4022',
        },
        {
          index: 3,
          height: 40,
          id: '9605',
        },
      ],
    },
  },
  {
    id: '3',
    type: 'playback_node',
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
    type: 'hangup_node',
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
    type: 'digits_node',
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
    type: 'transfer_node',
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
        routeType: 1,
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
  // default bezier edge
  // consists of an edge id, source node id and target node id
  {
    id: '1->2',
    source: '1',
    target: '2',
    sourceHandle: '',
    targetHandle: '',
  },

  // set `animated: true` to create an animated edge path
  {
    id: '2->3',
    source: '2',
    target: '3',
    sourceHandle: 'right_1',
    targetHandle: '',
  },
  {
    id: '2->4',
    source: '2',
    target: '4',
    sourceHandle: 'right_2',
    targetHandle: '',
  },
  {
    id: '3->5',
    source: '3',
    target: '5',
    sourceHandle: '',
    targetHandle: '',
  },
  {
    id: '5->6',
    source: '5',
    target: '6',
    sourceHandle: '',
    targetHandle: '',
  },
]);
