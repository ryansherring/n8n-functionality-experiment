import { Workflow, WorkflowBuilder } from './Workflow';
import { executeWorkflow } from './executeWorkflow';
import { ReceiveEmailNode } from '../nodes/ReceiveEmail';
import { IfElseNode } from '../nodes/IfElse';
import { SortNode } from '../nodes/Sort';
import { CallbackNode, PassthroughNode } from '../mocks';

describe('executeWorkflow', () => {
  test('works with a single node (nodeA)', () => {
    const wf = new Workflow({
      nodes: {
        nodeA: new ReceiveEmailNode('nodeA'),
      },
      connectors: [],
      startNodeId: 'nodeA',
    });

    const run = executeWorkflow(wf, {});
    expect(run.terminalOutputs.nodeA).toEqual({
      output0: { email: { from: 'unknown', subject: '', body: '' } },
    });
  });

  test('executes a linear chain nodeA -> nodeB', () => {
    const wf = new Workflow({
      nodes: {
        nodeA: new ReceiveEmailNode('nodeA'),
        nodeB: new SortNode('nodeB'),
      },
      connectors: [{ from: 'nodeA', output: 'output0', to: 'nodeB' }],
      startNodeId: 'nodeA',
    });

    const run = executeWorkflow(wf, { items: [2, 1] });
    expect(run.terminalOutputs.nodeB.output0).toEqual({
      items: [1, 2],
      email: { from: 'unknown', subject: '', body: '' },
    });
  });

  test('executes only the selected if/else branch', () => {
    const wf = new Workflow({
      nodes: {
        nodeA: new ReceiveEmailNode('nodeA'),
        nodeB: new IfElseNode('nodeB'),
        nodeC: new SortNode('nodeC'),
        nodeD: new SortNode('nodeD'),
      },
      connectors: [
        { from: 'nodeA', output: 'output0', to: 'nodeB' },
        { from: 'nodeB', output: 'output1', to: 'nodeC' },
        { from: 'nodeB', output: 'output0', to: 'nodeD' },
      ],
      startNodeId: 'nodeA',
    });

    const runTrue = executeWorkflow(wf, {
      items: [3, 2, 1],
      value: 10,
      condition: { leftPath: 'value', op: 'gt', right: 5 },
    });
    expect(runTrue.executedNodeIds.sort()).toEqual(['nodeA', 'nodeB', 'nodeC']);
    expect(runTrue.terminalOutputs.nodeC.output0.items).toEqual([1, 2, 3]);
    expect(runTrue.terminalOutputs.nodeD).toBeUndefined();

    const runFalse = executeWorkflow(wf, {
      items: [3, 2, 1],
      value: 2,
      condition: { leftPath: 'value', op: 'gt', right: 5 },
    });
    expect(runFalse.executedNodeIds.sort()).toEqual(['nodeA', 'nodeB', 'nodeD']);
    expect(runFalse.terminalOutputs.nodeD.output0.items).toEqual([1, 2, 3]);
    expect(runFalse.terminalOutputs.nodeC).toBeUndefined();
  });

  test('throws if the start node is unknown', () => {
    const wf = new Workflow({
      nodes: {},
      connectors: [],
      startNodeId: 'nodeA',
    });

    expect(() => executeWorkflow(wf, {})).toThrow('Unknown node: nodeA');
  });

  test('treats re-entry as a no-op (cycle protection)', () => {
    const wf = new Workflow({
      nodes: {
        nodeA: new ReceiveEmailNode('nodeA'),
      },
      connectors: [{ from: 'nodeA', output: 'output0', to: 'nodeA' }],
      startNodeId: 'nodeA',
    });

    const run = executeWorkflow(wf, {});
    expect(run.executedNodeIds).toEqual(['nodeA']);
    expect(run.terminalOutputs).toEqual({});
  });

  test('skips non-object connector payloads', () => {
    const nodeA = new CallbackNode('nodeA', () => ({ output0: [] as any }), 'array');
    const nodeB = new CallbackNode('nodeB', () => ({ output0: {} }), 'noop');

    const wf = new Workflow({
      nodes: {
        nodeA,
        nodeB,
      },
      connectors: [{ from: 'nodeA', output: 'output0', to: 'nodeB' }],
      startNodeId: 'nodeA',
    });

    const run = executeWorkflow(wf, {});
    expect(run.executedNodeIds).toEqual(['nodeA']);
    expect(run.terminalOutputs.nodeA).toEqual({ output0: [] as any });
  });

  test('skips null/primitive connector payloads', () => {
    const nodeA = new CallbackNode('nodeA', () => ({ output0: null as any }), 'nuller');
    const nodeB = new CallbackNode('nodeB', () => ({ output0: {} }), 'noop');

    const wf = new Workflow({
      nodes: {
        nodeA,
        nodeB,
      },
      connectors: [{ from: 'nodeA', output: 'output0', to: 'nodeB' }],
      startNodeId: 'nodeA',
    });

    const run = executeWorkflow(wf, {});
    expect(run.executedNodeIds).toEqual(['nodeA']);
    expect(run.terminalOutputs.nodeA).toEqual({ output0: null as any });
  });

  test('logs node and connector execution when a logger is provided', () => {
    const wf = new Workflow({
      nodes: {
        nodeA: new ReceiveEmailNode('nodeA'),
        nodeB: new SortNode('nodeB'),
      },
      connectors: [{ from: 'nodeA', output: 'output0', to: 'nodeB' }],
      startNodeId: 'nodeA',
    });

    const events: string[] = [];
    executeWorkflow(
      wf,
      { items: [2, 1] },
      {
        logger: {
          log: (event) => events.push(event),
        },
      },
    );

    expect(events).toEqual(
      expect.arrayContaining(['node.execute', 'node.output', 'connector.traverse', 'workflow.terminalOutputs']),
    );
  });

  test('getConnectors returns normalized connectors', () => {
    const wf = new WorkflowBuilder()
      .addNode(new PassthroughNode('nodeA'), { setAsStart: true })
      .addNode(new PassthroughNode('nodeB'))
      .addConnector({ from: 'nodeA', output: 'output0', to: 'nodeB' })
      .build();

    expect(wf.getConnectors()).toEqual([{ from: 'nodeA', output: 'output0', to: 'nodeB' }]);
  });
});
