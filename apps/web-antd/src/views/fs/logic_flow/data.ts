import type { Edge, Node } from '@vue-flow/core';

export const nodes: Node[] = [
  {
    id: 'start_node_id',
    data: {
      config: {
        fields: [
          {
            globeLabel: '{{GLOBAL_VARIABLE.callId}}',
            label: '通话唯一标识',
            value: 'callId',
          },
          {
            globeLabel: '{{GLOBAL_VARIABLE.caller}}',
            label: '主叫',
            value: 'caller',
          },
          {
            globeLabel: '{{GLOBAL_VARIABLE.called}}',
            label: '被叫',
            value: 'called',
          },
          {
            globeLabel: '{{GLOBAL_VARIABLE.month}}',
            label: '月份',
            value: 'month',
          },
          {
            globeLabel: '{{GLOBAL_VARIABLE.date}}',
            label: '日期',
            value: 'date',
          },
          {
            globeLabel: '{{GLOBAL_VARIABLE.time}}',
            label: '时间',
            value: 'time',
          },
          {
            globeLabel: '{{GLOBAL_VARIABLE.week}}',
            label: '星期',
            value: 'week',
          },
        ],
      },
      label: '开始',
      nodeId: 0,
      type: 'START_NODE',
    },
    position: { x: 0, y: 0 },
    type: 'START_NODE',
  },
  {
    id: '6',
    data: {
      config: {
        fields: [
          {
            globeLabel: '{{工作时间判断器.dtmf}}',
            label: '按钮内容',
            value: 'dtmf',
          },
        ],
      },
      label: '工作时间判断器',
      nodeData: {
        branch: [
          {
            checkId: 1,
            condition: 1,
            conditions: [
              {
                checkId: 1,
                compare: 3,
                field: 'GLOBAL_VARIABLE.WEEK',
                value: '周一,周二,周三,周四,周五',
              },
              {
                checkId: 2,
                compare: 7,
                field: 'GLOBAL_VARIABLE.TIME',
                value: '08:00:00',
              },
              {
                checkId: 3,
                compare: 9,
                field: 'GLOBAL_VARIABLE.TIME',
                value: '21:59:59',
              },
            ],
            id: 1,
            type: 1,
          },
          {
            checkId: 4,
            condition: 1,
            conditions: [],
            id: 4,
            type: 3,
          },
        ],
        branchConditionList: [
          {
            height: 0,
            id: 1,
            index: 1,
            nextNodeId: 3,
          },
          {
            height: 0,
            id: 4,
            index: 4,
            nextNodeId: 8,
          },
        ],
      },
      nodeId: 6,
      type: 'CONDITION_NODE',
    },
    position: { x: 500, y: 0 },
    type: 'CONDITION_NODE',
  },
  {
    id: '3',
    data: {
      config: {
        fields: [],
      },
      label: '收号',
      nodeData: {
        content: '按键语音播报：坐席请按1，技能组请按3，放音请按4，挂机请按6',
        dtmfDigitTimeout: 5000,
        dtmfEnd: '#',
        dtmfErrorContext: '输入有误，请重新输入',
        dtmfErrorPlayback: undefined,
        dtmfErrorType: 2,
        dtmfMax: 1,
        dtmfMin: 1,
        dtmfTimeout: 5000,
        playback: undefined,
        playId: 1,
        playType: 2,
        retry: 3,
      },
      nodeId: 3,
      type: 'DIGITS_NODE',
    },
    position: { x: 1100, y: 0 },
    type: 'DIGITS_NODE',
  },
  {
    id: '7',
    data: {
      config: {
        fields: [
          {
            globeLabel: '{{收号判断器.dtmf}}',
            label: '按钮内容',
            value: 'dtmf',
          },
        ],
      },
      label: '收号判断器',
      nodeData: {
        branch: [
          {
            checkId: 5,
            condition: 1,
            conditions: [{ checkId: 5, compare: 5, field: 'DTMF', value: '1' }],
            id: 5,
            type: 1,
          },
          {
            checkId: 6,
            condition: 1,
            conditions: [{ checkId: 6, compare: 5, field: 'DTMF', value: '3' }],
            id: 6,
            type: 2,
          },
          {
            checkId: 7,
            condition: 1,
            conditions: [{ checkId: 7, compare: 5, field: 'DTMF', value: '4' }],
            id: 7,
            type: 2,
          },
          {
            checkId: 8,
            condition: 1,
            conditions: [{ checkId: 8, compare: 5, field: 'DTMF', value: '6' }],
            id: 8,
            type: 2,
          },
          {
            checkId: 9,
            condition: 1,
            conditions: [],
            id: 9,
            type: 3,
          },
        ],
        branchConditionList: [
          { height: 0, id: 5, index: 1, nextNodeId: 1 },
          { height: 0, id: 6, index: 2, nextNodeId: 2 },
          { height: 0, id: 7, index: 3, nextNodeId: 4 },
          { height: 0, id: 8, index: 4, nextNodeId: 5 },
          { height: 0, id: 9, index: 5, nextNodeId: 5 },
        ],
      },
      nodeId: 7,
      type: 'CONDITION_NODE',
    },
    position: { x: 1600, y: 0 },
    type: 'CONDITION_NODE',
  },
  {
    id: '1',
    data: {
      config: {
        fields: [],
      },
      label: '转坐席',
      nodeData: {
        agentId: 1,
        conferenceId: undefined,
        ivrId: undefined,
        outPhone: '',
        routeType: 'TRANSFER_AGENT',
        sipTrunkId: undefined,
        skillId: undefined,
        vdnId: undefined,
      },
      nodeId: 1,
      type: 'TRANSFER_NODE',
    },
    position: { x: 2200, y: 0 },
    type: 'TRANSFER_NODE',
  },
  {
    id: '5',
    data: {
      config: {
        fields: [],
      },
      label: '挂机',
      nodeId: 5,
      type: 'HANGUP_NODE',
    },
    position: { x: 2700, y: 0 },
    type: 'HANGUP_NODE',
  },
  {
    id: '2',
    data: {
      config: {
        fields: [],
      },
      label: '转技能组',
      nodeData: {
        agentId: undefined,
        conferenceId: undefined,
        ivrId: undefined,
        outPhone: '',
        routeType: 'TRANSFER_GROUP',
        sipTrunkId: undefined,
        skillId: 1,
        vdnId: undefined,
      },
      nodeId: 2,
      type: 'TRANSFER_NODE',
    },
    position: { x: 2200, y: 500 },
    type: 'TRANSFER_NODE',
  },
  {
    id: '4',
    data: {
      config: {
        fields: [
          {
            globeLabel: '{{放音.text}}',
            label: '放音内容',
            value: 'text',
          },
        ],
      },
      label: '放音',
      nodeData: {
        content: '',
        playback: 1,
        playId: 2,
        playType: 1,
      },
      nodeId: 4,
      type: 'PLAYBACK_NODE',
    },
    position: { x: 2200, y: 1000 },
    type: 'PLAYBACK_NODE',
  },
  {
    id: '8',
    data: {
      config: {
        fields: [
          {
            globeLabel: '{{非工作时间放音.text}}',
            label: '放音内容',
            value: 'text',
          },
        ],
      },
      label: '非工作时间放音',
      nodeData: {
        content:
          '你好，公司工作时间为周一到周五，早上八点到晚上十点，请在时间范围内拨打，再见',
        playback: undefined,
        playId: 3,
        playType: 2,
      },
      nodeId: 8,
      type: 'PLAYBACK_NODE',
    },
    position: { x: 1100, y: 500 },
    type: 'PLAYBACK_NODE',
  },
];

export const edges: Edge[] = [
  {
    id: 'start_node_id-source-6-target',
    source: 'start_node_id',
    sourceHandle: 'start_node_id-source',
    target: '6',
    targetHandle: '6-target',
    type: 'button_edge',
  },
  {
    id: '6-source-1-3-target',
    source: '6',
    sourceHandle: '6-source-1',
    target: '3',
    targetHandle: '3-target',
    type: 'button_edge',
  },
  {
    id: '3-source-7-target',
    source: '3',
    sourceHandle: '3-source',
    target: '7',
    targetHandle: '7-target',
    type: 'button_edge',
  },
  {
    id: '7-source-5-1-target',
    source: '7',
    sourceHandle: '7-source-5',
    target: '1',
    targetHandle: '1-target',
    type: 'button_edge',
  },
  {
    id: '1-source-5-target',
    source: '1',
    sourceHandle: '1-source',
    target: '5',
    targetHandle: '5-target',
    type: 'button_edge',
  },
  {
    id: '7-source-6-2-target',
    source: '7',
    sourceHandle: '7-source-6',
    target: '2',
    targetHandle: '2-target',
    type: 'button_edge',
  },
  {
    id: '2-source-5-target',
    source: '2',
    sourceHandle: '2-source',
    target: '5',
    targetHandle: '5-target',
    type: 'button_edge',
  },
  {
    id: '7-source-7-4-target',
    source: '7',
    sourceHandle: '7-source-7',
    target: '4',
    targetHandle: '4-target',
    type: 'button_edge',
  },
  {
    id: '4-source-5-target',
    source: '4',
    sourceHandle: '4-source',
    target: '5',
    targetHandle: '5-target',
    type: 'button_edge',
  },
  {
    id: '7-source-8-5-target',
    source: '7',
    sourceHandle: '7-source-8',
    target: '5',
    targetHandle: '5-target',
    type: 'button_edge',
  },
  {
    id: '7-source-9-5-target',
    source: '7',
    sourceHandle: '7-source-9',
    target: '5',
    targetHandle: '5-target',
    type: 'button_edge',
  },
  {
    id: '6-source-4-8-target',
    source: '6',
    sourceHandle: '6-source-4',
    target: '8',
    targetHandle: '8-target',
    type: 'button_edge',
  },
  {
    id: '8-source-5-target',
    source: '8',
    sourceHandle: '8-source',
    target: '5',
    targetHandle: '5-target',
    type: 'button_edge',
  },
];
