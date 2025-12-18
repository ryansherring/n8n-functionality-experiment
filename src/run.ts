import { WorkflowBuilder } from './core/Workflow';
import { executeWorkflow } from './core/executeWorkflow';
import { ReceiveEmailNode } from './nodes/ReceiveEmail';
import { IfElseNode } from './nodes/IfElse';
import { SortNode } from './nodes/Sort';
import { createConsoleWorkflowLogger } from './logger';

const builder = new WorkflowBuilder();

builder
  .addNode(new ReceiveEmailNode('nodeA'), { setAsStart: true })
  .addNode(new IfElseNode('nodeB'))
  .addNode(new SortNode('nodeC'))
  .addNode(new SortNode('nodeD'))
  .addConnector({ from: 'nodeA', output: 'output0', to: 'nodeB' })
  .addConnector({ from: 'nodeB', output: 'output1', to: 'nodeC' })
  .addConnector({ from: 'nodeB', output: 'output0', to: 'nodeD' });

const workflow = builder.build();

const initialInput = {
  items: [3, 2, 1],
  value: 10,
  condition: { leftPath: 'value', op: 'gt', right: 5 },
};

const result = executeWorkflow(workflow, initialInput, {
  logger: createConsoleWorkflowLogger({ prefix: 'iv', includeData: true }),
});

console.log(JSON.stringify(result, null, 2));
