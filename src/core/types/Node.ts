import type { JsonObject } from './Json';

export type NodeId = string;
export type PortName = string;

export type NodeOutput<TPortName extends string = PortName> = Record<TPortName, JsonObject>;

export interface INode<TInput extends JsonObject = JsonObject, TOutput extends NodeOutput = NodeOutput> {
  readonly id: NodeId;
  readonly type: string;
  executeNode(input: TInput): TOutput;
}
