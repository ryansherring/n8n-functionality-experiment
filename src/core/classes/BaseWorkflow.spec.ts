import type { INode, NodeOutput } from '../types/Node';
import type { Connector } from '../types/Workflow';
import type { ConnectorLike } from './BaseConnector';
import { BaseWorkflow } from './BaseWorkflow';

class TestNode implements INode {
  public readonly id: string;
  public readonly type = 'test';

  public constructor(id: string) {
    this.id = id;
  }

  public executeNode(): NodeOutput {
    return { output0: {} };
  }
}

class TestWorkflow extends BaseWorkflow {
  public constructor(args: {
    nodes: Record<string, INode>;
    connectors: ConnectorLike[];
    startNodeId: string;
  }) {
    super(args);
  }
}

describe('BaseWorkflow', () => {
  test('encapsulates nodes and connectors with accessors', () => {
    const nodes = {
      nodeA: new TestNode('nodeA'),
      nodeB: new TestNode('nodeB'),
    };
    const connectors: Connector[] = [
      { from: 'nodeA', output: 'output0', to: 'nodeB' },
    ];
    const workflow = new TestWorkflow({
      nodes,
      connectors,
      startNodeId: 'nodeA',
    });

    expect(workflow.getNodes()).toMatchObject(nodes);
    expect(workflow.getNode('nodeA')).toBe(nodes.nodeA);
    expect(workflow.getConnectors()).toEqual(connectors);
    expect(workflow.getStartNodeId()).toBe('nodeA');
  });
});
