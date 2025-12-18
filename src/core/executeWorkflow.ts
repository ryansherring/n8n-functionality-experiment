import type { JsonObject } from './types/Json';
import type { Connector } from './types/Workflow';
import type { INode, NodeId, NodeOutput, PortName } from './types/Node';
import { BaseWorkflow } from './classes/BaseWorkflow';

function isNonEmptyJsonObject(value: unknown): value is JsonObject {
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  return Object.keys(value as Record<string, unknown>).length > 0;
}

function indexConnectorsByFrom(connectors: ReadonlyArray<Connector>): Map<NodeId, Connector[]> {
  const map = new Map<NodeId, Connector[]>();
  for (const c of connectors) {
    const existing = map.get(c.from);
    if (existing) existing.push(c);
    else map.set(c.from, [c]);
  }
  return map;
}

export type WorkflowRunResult = {
  executedNodeIds: NodeId[];
  outputsByNodeId: Record<NodeId, NodeOutput>;
  terminalOutputs: Record<NodeId, NodeOutput>;
};

export type WorkflowLogger = {
  log: (event: string, data?: unknown) => void;
};

export function executeWorkflow(
  workflow: BaseWorkflow,
  initialInput: JsonObject,
  options?: { logger?: WorkflowLogger },
): WorkflowRunResult {
  const log: WorkflowLogger['log'] = options?.logger?.log ?? (() => undefined);
  const connectorsByFrom = indexConnectorsByFrom(workflow.getConnectors());

  const executedNodeIds: NodeId[] = [];
  const outputsByNodeId: Record<NodeId, NodeOutput> = {};
  const traversedFromIds = new Set<NodeId>();

  const stack: Array<{ nodeId: NodeId; input: JsonObject }> = [
    { nodeId: workflow.getStartNodeId(), input: initialInput },
  ];

  while (stack.length > 0) {
    const next = stack.pop()!;

    const node: INode | undefined = workflow.getNode(next.nodeId);
    if (!node) {
      throw new Error(`Unknown node: ${next.nodeId}`);
    }

    if (outputsByNodeId[next.nodeId]) {
      continue;
    }

    log('node.execute', { nodeId: next.nodeId, nodeType: node.type, input: next.input });
    const output = node.executeNode(next.input);
    log('node.output', { nodeId: next.nodeId, nodeType: node.type, output });
    outputsByNodeId[next.nodeId] = output;
    executedNodeIds.push(next.nodeId);

    const outgoing = connectorsByFrom.get(next.nodeId) ?? [];
    for (const connector of outgoing) {
      const port: PortName = connector.output;
      const payload = output[port];
      if (!isNonEmptyJsonObject(payload)) {
        continue;
      }

      traversedFromIds.add(next.nodeId);
      log('connector.traverse', { from: connector.from, output: connector.output, to: connector.to, payload });
      stack.push({ nodeId: connector.to, input: payload });
    }
  }

  const terminalOutputs: Record<NodeId, NodeOutput> = {};
  for (const nodeId of executedNodeIds) {
    if (!traversedFromIds.has(nodeId)) {
      terminalOutputs[nodeId] = outputsByNodeId[nodeId];
    }
  }

  log('workflow.terminalOutputs', terminalOutputs);

  return {
    executedNodeIds,
    outputsByNodeId,
    terminalOutputs,
  };
}
