import { Workflow, WorkflowBuilder } from './Workflow';
import type { INode, NodeOutput } from './types/Node';

class StubNode implements INode {
  public readonly id: string;
  public readonly type: string;

  public constructor(id: string, type = 'stub') {
    this.id = id;
    this.type = type;
  }

  public executeNode(): NodeOutput {
    return { output0: {} };
  }
}

describe('Workflow', () => {
  test('creates an instance from definition', () => {
    const wf = new Workflow({
      nodes: {
        nodeA: new StubNode('nodeA'),
      },
      connectors: [],
      startNodeId: 'nodeA',
    });

    expect(wf.getNode('nodeA')).toBeDefined();
    expect(wf.getStartNodeId()).toBe('nodeA');
  });
});

describe('WorkflowBuilder', () => {
  test('builds workflows with modular node operations', () => {
    const builder = new WorkflowBuilder();
    const nodeA = new StubNode('nodeA', 'first');
    const nodeB = new StubNode('nodeB', 'second');
    builder
      .addNode(nodeA, { setAsStart: true })
      .addNode(nodeB)
      .addConnector({ from: nodeA.id, output: 'output0', to: nodeB.id });

    const wf = builder.build();

    expect(wf.getNode('nodeA')).toBe(nodeA);
    expect(wf.getConnectors()).toEqual([{ from: 'nodeA', output: 'output0', to: 'nodeB' }]);

    builder.replaceNode(new StubNode('nodeB', 'replacement'));
    builder.setStartNode('nodeB');
    const wf2 = builder.build();
    expect(wf2.getStartNodeId()).toBe('nodeB');
    expect(wf2.getNode('nodeB')?.type).toBe('replacement');
  });

  test('requires a start node before build', () => {
    expect(() => new WorkflowBuilder().build()).toThrow('start node');
  });

  test('validates node replacement and start-node assignment', () => {
    const builder = new WorkflowBuilder();
    builder.addNode(new StubNode('nodeA'), { setAsStart: true });
    expect(() => builder.replaceNode(new StubNode('nodeB'))).toThrow('unknown node');
    expect(() => builder.setStartNode('missing')).toThrow('Unknown node');
  });
});
