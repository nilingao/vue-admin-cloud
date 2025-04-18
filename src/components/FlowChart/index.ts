import { withInstall } from '@/utils';
import bpmnFlowChart from './bpmn/BpmnFlowChart.vue';
import ivrFlowChart from './ivr/IvrFlowChart.vue';

const BpmnFlowChart = withInstall(bpmnFlowChart);
const IvrFlowChart = withInstall(ivrFlowChart);
export { BpmnFlowChart, IvrFlowChart };
