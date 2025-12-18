import type { NodeId, PortName } from '../types/Node';
import type { Connector } from '../types/Workflow';

export class BaseConnector implements Connector {
  public readonly from: NodeId;
  public readonly output: PortName;
  public readonly to: NodeId;

  public constructor(args: Connector) {
    this.from = args.from;
    this.output = args.output;
    this.to = args.to;
  }

  public toJSON(): Connector {
    return { from: this.from, output: this.output, to: this.to };
  }
}

export type ConnectorLike = Connector | BaseConnector;

export function isConnectorLike(value: unknown): value is ConnectorLike {
  if (value === null || typeof value !== 'object') return false;

  const v = value as Partial<Connector>;
  const looksLikeConnector =
    typeof v.from === 'string' && typeof v.output === 'string' && typeof v.to === 'string';

  if (looksLikeConnector) return true;

  const maybe = value as { toJSON?: unknown };
  return typeof maybe.toJSON === 'function';
}

export function normalizeConnector(connector: ConnectorLike): Connector {
  return connector instanceof BaseConnector ? connector.toJSON() : connector;
}
