import type { INode, NodeId } from '../types/Node';
import type { Connector } from '../types/Workflow';
import type { ConnectorLike } from './BaseConnector';
import { normalizeConnector } from './BaseConnector';

export abstract class BaseWorkflow {
  private readonly nodesInternal: Readonly<Record<NodeId, INode>>;
  private readonly connectorsInternal: ReadonlyArray<Readonly<Connector>>;
  private readonly startNodeIdInternal: NodeId;

  protected constructor(args: {
    nodes: Record<NodeId, INode>;
    connectors: ConnectorLike[];
    startNodeId: NodeId;
  }) {
    this.nodesInternal = Object.freeze({ ...args.nodes });
    const normalized = args.connectors.map(normalizeConnector).map((connector) => Object.freeze({ ...connector }));
    this.connectorsInternal = Object.freeze(normalized);
    this.startNodeIdInternal = args.startNodeId;
  }

  public getNode(nodeId: NodeId): INode | undefined {
    return this.nodesInternal[nodeId];
  }

  public getNodes(): Readonly<Record<NodeId, INode>> {
    return this.nodesInternal;
  }

  public getConnectors(): ReadonlyArray<Connector> {
    return this.connectorsInternal;
  }

  public getStartNodeId(): NodeId {
    return this.startNodeIdInternal;
  }
}
