import type { Node, Edge } from '@vue-flow/core';
import { ref } from 'vue';

export const nodes = ref<Node[]>([
  {
    id: 'start_node_id',
    type: 'START_NODE',
    position: {
      x: 0,
      y: 0,
    },
    data: {
      type: 'START_NODE',
      nodeId: 0,
      label: '开始',
      config: {
        fields: [
          {
            label: '通话唯一表示',
            value: 'callId',
            globeLabel: '{{GLOBAL_VARIABLE.callId}}',
          },
          {
            label: '主叫',
            value: 'caller',
            globeLabel: '{{GLOBAL_VARIABLE.caller}}',
          },
          {
            label: '被叫',
            value: 'called',
            globeLabel: '{{GLOBAL_VARIABLE.called}}',
          },
          {
            label: '月份',
            value: 'month',
            globeLabel: '{{GLOBAL_VARIABLE.month}}',
          },
          {
            label: '日期',
            value: 'date',
            globeLabel: '{{GLOBAL_VARIABLE.date}}',
          },
          {
            label: '时间',
            value: 'time',
            globeLabel: '{{GLOBAL_VARIABLE.time}}',
          },
          {
            label: '星期',
            value: 'week',
            globeLabel: '{{GLOBAL_VARIABLE.week}}',
          },
        ],
      },
    },
  },
  {
    id: '6',
    type: 'CONDITION_NODE',
    position: {
      x: 500.0,
      y: 0.0,
    },
    data: {
      type: 'CONDITION_NODE',
      nodeId: 6,
      label: 'vdn转日期判断器',
      config: {
        fields: [
          {
            label: '按钮内容',
            value: 'dtmf',
            globeLabel: '{{vdn转日期判断器.dtmf}}',
          },
        ],
      },
      nodeData: {
        branch: [
          {
            conditions: [
              {
                checkId: 1,
                field: 'GLOBAL_VARIABLE.WEEK',
                compare: 3,
                value: '一,二,三,四,五,六,日',
              },
              {
                checkId: 2,
                field: 'GLOBAL_VARIABLE.TIME',
                compare: 7,
                value: '08:00:00',
              },
              {
                checkId: 3,
                field: 'GLOBAL_VARIABLE.TIME',
                compare: 9,
                value: '21:59:59',
              },
            ],
            id: 1,
            checkId: 1,
            type: 1,
            condition: 1,
          },
          {
            conditions: [
              {
                checkId: 4,
                field: '',
                compare: 5,
                value: '',
              },
            ],
            id: 4,
            checkId: 4,
            type: 3,
            condition: 1,
          },
        ],
        branchConditionList: [
          {
            id: 1,
            index: 1,
            nextNodeId: 3,
            height: 0,
          },
          {
            id: 4,
            index: 4,
            nextNodeId: 8,
            height: 0,
          },
        ],
      },
    },
  },
  {
    id: '3',
    type: 'DIGITS_NODE',
    position: {
      x: 1100.0,
      y: 0.0,
    },
    data: {
      type: 'DIGITS_NODE',
      nodeId: 3,
      label: 'vdn转收号',
      config: {
        fields: [],
      },
      nodeData: {
        playId: 1,
        playType: 2,
        playback: 0,
        content: '按键语音播报 坐席请按1，技能组请按3，放音请按4，挂机请按6',
        retry: 3,
        dtmfMax: 1,
        dtmfMin: 1,
        dtmfEnd: '#',
        dtmfTimeout: 5000,
        dtmfDigitTimeout: 5000,
        dtmfErrorType: 2,
        dtmfErrorPlayback: 0,
        dtmfErrorContext: '欢迎接听，再见',
      },
    },
  },
  {
    id: '7',
    type: 'CONDITION_NODE',
    position: {
      x: 1600.0,
      y: 0.0,
    },
    data: {
      type: 'CONDITION_NODE',
      nodeId: 7,
      label: 'vdn转收号判断器',
      config: {
        fields: [
          {
            label: '按钮内容',
            value: 'dtmf',
            globeLabel: '{{vdn转收号判断器.dtmf}}',
          },
        ],
      },
      nodeData: {
        branch: [
          {
            conditions: [
              {
                checkId: 5,
                field: 'vdn转收号.DTMF',
                compare: 5,
                value: '1',
              },
            ],
            id: 5,
            checkId: 5,
            type: 1,
            condition: 0,
          },
          {
            conditions: [
              {
                checkId: 6,
                field: 'vdn转收号.DTMF',
                compare: 5,
                value: '3',
              },
            ],
            id: 6,
            checkId: 6,
            type: 2,
            condition: 0,
          },
          {
            conditions: [
              {
                checkId: 7,
                field: 'vdn转收号.DTMF',
                compare: 5,
                value: '4',
              },
            ],
            id: 7,
            checkId: 7,
            type: 2,
            condition: 0,
          },
          {
            conditions: [
              {
                checkId: 8,
                field: 'vdn转收号.DTMF',
                compare: 5,
                value: '6',
              },
            ],
            id: 8,
            checkId: 8,
            type: 2,
            condition: 0,
          },
          {
            conditions: [
              {
                checkId: 9,
                field: '',
                compare: 5,
                value: '',
              },
            ],
            id: 9,
            checkId: 9,
            type: 3,
            condition: 0,
          },
        ],
        branchConditionList: [
          {
            id: 5,
            index: 1,
            nextNodeId: 1,
            height: 0,
          },
          {
            id: 6,
            index: 2,
            nextNodeId: 2,
            height: 0,
          },
          {
            id: 7,
            index: 3,
            nextNodeId: 4,
            height: 0,
          },
          {
            id: 8,
            index: 4,
            nextNodeId: 5,
            height: 0,
          },
          {
            id: 9,
            index: 5,
            nextNodeId: 5,
            height: 0,
          },
        ],
      },
    },
  },
  {
    id: '1',
    type: 'TRANSFER_NODE',
    position: {
      x: 2200.0,
      y: 0.0,
    },
    data: {
      type: 'TRANSFER_NODE',
      nodeId: 1,
      label: 'vdn转收号坐席',
      config: {
        fields: [],
      },
      nodeData: {
        routeType: 'TRANSFER_AGENT',
        skillId: null,
        agentId: 1,
        outPhone: null,
        sipTrunkId: null,
        vdnId: null,
        ivrId: null,
        conferenceId: null,
      },
    },
  },
  {
    id: '5',
    type: 'HANGUP_NODE',
    position: {
      x: 2700.0,
      y: 0.0,
    },
    data: {
      type: 'HANGUP_NODE',
      nodeId: 5,
      label: 'vdn转挂机',
      config: {
        fields: [],
      },
    },
  },
  {
    id: '2',
    type: 'TRANSFER_NODE',
    position: {
      x: 2200.0,
      y: 500.0,
    },
    data: {
      type: 'TRANSFER_NODE',
      nodeId: 2,
      label: 'vdn转收号技能组',
      config: {
        fields: [],
      },
      nodeData: {
        routeType: 'TRANSFER_GROUP',
        skillId: 1,
        agentId: null,
        outPhone: null,
        sipTrunkId: null,
        vdnId: null,
        ivrId: null,
        conferenceId: null,
      },
    },
  },
  {
    id: '4',
    type: 'PLAYBACK_NODE',
    position: {
      x: 2200.0,
      y: 1000.0,
    },
    data: {
      type: 'PLAYBACK_NODE',
      nodeId: 4,
      label: 'vdn转收号放音',
      config: {
        fields: [
          {
            label: '放音内容',
            value: 'text',
            globeLabel: '{{vdn转收号放音.text}}',
          },
        ],
      },
      nodeData: {
        playId: 2,
        playType: 1,
        playback: 1,
        content: '',
        retry: 0,
        dtmfMax: 0,
        dtmfMin: 0,
        dtmfEnd: null,
        dtmfTimeout: 0,
        dtmfDigitTimeout: 0,
        dtmfErrorType: 0,
        dtmfErrorPlayback: null,
        dtmfErrorContext: null,
      },
    },
  },
  {
    id: '8',
    type: 'PLAYBACK_NODE',
    position: {
      x: 1100.0,
      y: 500.0,
    },
    data: {
      type: 'PLAYBACK_NODE',
      nodeId: 8,
      label: 'vdn转收号未到营业时间放音',
      config: {
        fields: [
          {
            label: '放音内容',
            value: 'text',
            globeLabel: '{{vdn转收号未到营业时间放音.text}}',
          },
        ],
      },
      nodeData: {
        playId: 3,
        playType: 2,
        playback: null,
        content: '你好，公司工作时间为周一到周五，早上八点到晚上10点，请在时间范围内拨打，再见',
        retry: 0,
        dtmfMax: 0,
        dtmfMin: 0,
        dtmfEnd: null,
        dtmfTimeout: 0,
        dtmfDigitTimeout: 0,
        dtmfErrorType: 0,
        dtmfErrorPlayback: null,
        dtmfErrorContext: null,
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
    id: '6-source-1-3-target',
    type: 'button_edge',
    source: '6',
    target: '3',
    sourceHandle: '6-source-1',
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
    id: '7-source-5-1-target',
    type: 'button_edge',
    source: '7',
    target: '1',
    sourceHandle: '7-source-5',
    targetHandle: '1-target',
  },
  {
    id: '1-source-5-target',
    type: 'button_edge',
    source: '1',
    target: '5',
    sourceHandle: '1-source',
    targetHandle: '5-target',
  },
  {
    id: '7-source-6-2-target',
    type: 'button_edge',
    source: '7',
    target: '2',
    sourceHandle: '7-source-6',
    targetHandle: '2-target',
  },
  {
    id: '2-source-5-target',
    type: 'button_edge',
    source: '2',
    target: '5',
    sourceHandle: '2-source',
    targetHandle: '5-target',
  },
  {
    id: '7-source-7-4-target',
    type: 'button_edge',
    source: '7',
    target: '4',
    sourceHandle: '7-source-7',
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
    id: '7-source-8-5-target',
    type: 'button_edge',
    source: '7',
    target: '5',
    sourceHandle: '7-source-8',
    targetHandle: '5-target',
  },
  {
    id: '7-source-9-5-target',
    type: 'button_edge',
    source: '7',
    target: '5',
    sourceHandle: '7-source-9',
    targetHandle: '5-target',
  },
  {
    id: '6-source-4-8-target',
    type: 'button_edge',
    source: '6',
    target: '8',
    sourceHandle: '6-source-4',
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
