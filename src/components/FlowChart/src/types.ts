import type { LogicFlow } from '@logicflow/core';
import { ToolbarTypeEnum } from './enum';

export interface NodeItem extends LogicFlow.NodeConfig {
  icon: string;
}

export interface ToolbarConfig {
  type?: string | ToolbarTypeEnum;
  tooltip?: string | boolean;
  icon?: string;
  disabled?: boolean;
  separate?: boolean;
}
