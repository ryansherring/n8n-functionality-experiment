import type { NodeId, PortName } from './Node';

export interface Connector {
  from: NodeId;
  output: PortName;
  to: NodeId;
}
