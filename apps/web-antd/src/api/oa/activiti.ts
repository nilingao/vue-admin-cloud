import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export enum OAIndex {
  Deploy = '/oa/deploy/',
  Leave = '/work/leave/',
}

export interface StatsItem {
  totalAlreadyCount?: number;
  totalNeedCount?: number;
  userAlreadyCount?: number;
  userLaunchCount?: number;
  userNeedCount?: number;
}

export interface ActivitiUserNeedEntity extends Recordable<any> {
  assignee?: string;
  businessKey?: string;
  claimTime?: string;
  createTime?: string;
  dueDate?: string;
  instanceComment?: Recordable<any>;
  instanceId?: string;
  instanceName?: string;
  isSuspended?: boolean;
  processDefinitionId?: string;
  processVariables?: Recordable<any>;
  tackComment?: Recordable<any>;
  taskId?: string;
  taskName?: string;
}

export interface ActivitiUserAlreadyEntity extends Recordable<any> {
  businessKey?: string;
  endTime?: string;
  instanceComment?: Recordable<any>;
  instanceId?: string;
  instanceName?: string;
  processDefinitionId?: string;
  processDefinitionName?: string;
  processVariables?: Recordable<any>;
  startTime?: string;
  tackComment?: Recordable<any>;
  taskId?: string;
  taskName?: string;
}

export interface ActivitiRepositoryEntity extends Recordable<any> {
  deploymentId?: string;
  deploymentName?: string;
  diagramResourceName?: string;
  id?: string;
  isSuspended?: boolean | string;
  key?: string;
  version?: string;
}

export type ActivitiParams = Recordable<any>;
export type ActivitiPageResultModel = Recordable<any>;

enum Api {
  appointClaim = '/webapi/activiti/activiti/appoint_claim',
  backProcess = '/webapi/activiti/activiti/back_process',
  claim = '/webapi/activiti/activiti/claim',
  complete = '/webapi/activiti/activiti/complete',
  deleteProcess = '/webapi/activiti/activiti/delete_process',
  deleteProcessInstance = '/webapi/activiti/activiti/delete_process_instance',
  deployProcess = '/webapi/activiti/activiti/deploy_process',
  deployProcessParameter = '/webapi/activiti/activiti/deploy_process_parameter',
  findAlreadyList = '/webapi/activiti/activiti/find_already_list',
  findHistoricalInstanceIdList = '/webapi/activiti/activiti/find_historical_instance_id_list',
  findInstanceIdDetail = '/webapi/activiti/activiti/find_instance_id_detail',
  findNeedList = '/webapi/activiti/activiti/find_need_list',
  findRepositoryList = '/webapi/activiti/activiti/find_repository_list',
  findRepositoryXml = '/webapi/activiti/activiti/find_repository_xml',
  findUserAlreadyList = '/webapi/activiti/activiti/find_user_already_list',
  findUserLaunchList = '/webapi/activiti/activiti/find_user_launch_list',
  findUserNeedList = '/webapi/activiti/activiti/find_user_need_list',
  getFlowImgByInstanceId = '/webapi/activiti/activiti/get_flow_img_by_instance_id',
  jump = '/webapi/activiti/activiti/jump',
  statsUserOa = '/webapi/activiti/activiti/stats_user_oa',
  suspend = '/webapi/activiti/activiti/suspend',
  suspendedInstance = '/webapi/activiti/activiti/suspended_instance',
  suspendedProcessDefinition = '/webapi/activiti/activiti/suspended_process_definition',
}

export function doStatsUserOa() {
  return requestClient.get<StatsItem>(Api.statsUserOa);
}

export function doFindUserNeedList(params: ActivitiParams) {
  return requestClient.post<ActivitiPageResultModel>(
    Api.findUserNeedList,
    params,
  );
}

export function doFindUserLaunchList(params: ActivitiParams) {
  return requestClient.post<ActivitiPageResultModel>(
    Api.findUserLaunchList,
    params,
  );
}

export function doFindUserAlreadyList(params: ActivitiParams) {
  return requestClient.post<ActivitiPageResultModel>(
    Api.findUserAlreadyList,
    params,
  );
}

export function doFindRepositoryList(params: ActivitiParams) {
  return requestClient.post<ActivitiPageResultModel>(
    Api.findRepositoryList,
    params,
  );
}

export function doFindNeedList(params: ActivitiParams) {
  return requestClient.post<ActivitiPageResultModel>(Api.findNeedList, params);
}

export function doFindAlreadyList(params: ActivitiParams) {
  return requestClient.post<ActivitiPageResultModel>(
    Api.findAlreadyList,
    params,
  );
}

export function doFindHistoricalInstanceIdList(params: Recordable<any>) {
  return requestClient.get(Api.findHistoricalInstanceIdList, { params });
}

export function doFindRepositoryXml(params: Recordable<any>) {
  return requestClient.get<string>(Api.findRepositoryXml, { params });
}

export function doDeployProcessParameter(params: Recordable<any>) {
  return requestClient.post(Api.deployProcessParameter, params);
}

export function doDeployProcess(params: Recordable<any>) {
  return requestClient.post(Api.deployProcess, params);
}

export function doDeleteProcess(params: Recordable<any>) {
  return requestClient.get(Api.deleteProcess, { params });
}

export function doDeleteProcessInstance(params: Recordable<any>) {
  return requestClient.get(Api.deleteProcessInstance, { params });
}

export function doComplete(params: Recordable<any>) {
  return requestClient.post(Api.complete, params);
}

export function doClaim(params: Recordable<any>) {
  return requestClient.get(Api.claim, { params });
}

export function doAppointClaim(params: Recordable<any>) {
  return requestClient.get(Api.appointClaim, { params });
}

export function doJump(params: Recordable<any>) {
  return requestClient.get(Api.jump, { params });
}

export function doSuspend(params: Recordable<any>) {
  return requestClient.get(Api.suspend, { params });
}

export function doSuspendedInstance(params: Recordable<any>) {
  return requestClient.get(Api.suspendedInstance, { params });
}

export function doSuspendedProcessDefinition(params: Recordable<any>) {
  return requestClient.get(Api.suspendedProcessDefinition, { params });
}

export function doBackProcess(params: Recordable<any>) {
  return requestClient.get(Api.backProcess, { params });
}

export function doFindInstanceIdDetail(params: Recordable<any>) {
  return requestClient.get(Api.findInstanceIdDetail, { params });
}

export function doGetFlowImgByInstanceId(params: Recordable<any>) {
  return requestClient.get(Api.getFlowImgByInstanceId, { params });
}
