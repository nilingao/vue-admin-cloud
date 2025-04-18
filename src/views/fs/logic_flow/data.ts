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
            globeLabel: '{{全局变量.callId}}',
          },
          {
            label: '主叫',
            value: 'caller',
            globeLabel: '{{$全局变量.caller}}',
          },
          {
            label: '被叫',
            value: 'callee',
            globeLabel: '{{全局变量.callee}}',
          },
          {
            label: '月份',
            value: 'month',
            globeLabel: '{{全局变量.month}}',
          },
          {
            label: '日期',
            value: 'day',
            globeLabel: '{{全局变量.day}}',
          },
          {
            label: '当前时间',
            value: 'time',
            globeLabel: '{{全局变量.time}}',
          },
          {
            label: '星期',
            value: 'week',
            globeLabel: '{{全局变量.week}}',
          },
        ],
      },
    },
  },
  {
    id: '2',
    type: 'condition_node',
    position: { x: 514, y: -52 },
    data: {
      label: '判断器1',
      config: {
        fields: [
          {
            label: '分支名称',
            value: 'branch_name',
          },
        ],
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
    position: { x: 1544, y: -26 },
    data: {
      label: '放音',
      config: {
        fields: [],
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
    position: { x: 1546, y: 122 },
    data: {
      label: '结束',
      config: {
        fields: [],
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
]);
