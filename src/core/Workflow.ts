import type { INode, NodeId } from './types/Node';
import type { ConnectorLike } from './classes/BaseConnector';
import { BaseWorkflow } from './classes/BaseWorkflow';

export type WorkflowDefinition = {
  nodes: Record<NodeId, INode>;
  connectors: ConnectorLike[];
  startNodeId: NodeId;
};

export class Workflow extends BaseWorkflow {
  public constructor(definition: WorkflowDefinition) {
    super(definition);
  }

  public static from(definition: WorkflowDefinition): Workflow {
    return new Workflow(definition);
  }
}

export class WorkflowBuilder {
  private nodes: Record<NodeId, INode> = {};
  private connectors: ConnectorLike[] = [];
  private startNodeId: NodeId | null = null;

  public addNode(node: INode, options?: { setAsStart?: boolean }): this {
    this.nodes[node.id] = node;
    if (options?.setAsStart || !this.startNodeId) {
      this.startNodeId = node.id;
    }
    return this;
  }

  public replaceNode(node: INode): this {
    if (!this.nodes[node.id]) {
      throw new Error(`Cannot replace unknown node: ${node.id}`);
    }
    this.nodes[node.id] = node;
    return this;
  }

  public addConnector(connector: ConnectorLike): this {
    this.connectors.push(connector);
    return this;
  }

  public setStartNode(nodeId: NodeId): this {
    if (!this.nodes[nodeId]) {
      throw new Error(`Cannot set start node. Unknown node: ${nodeId}`);
    }
    this.startNodeId = nodeId;
    return this;
  }

  public build(): Workflow {
    const startNodeId = this.startNodeId;
    if (!startNodeId) {
      throw new Error('A start node must be specified before building the workflow');
    }

    return Workflow.from({
      nodes: { ...this.nodes },
      connectors: [...this.connectors],
      startNodeId,
    });
  }
}
