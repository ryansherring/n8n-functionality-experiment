import type { JsonObject } from '../types/Json';
import type { INode, NodeId, NodeOutput } from '../types/Node';

export abstract class BaseNode<
  TInput extends JsonObject = JsonObject,
  TOutput extends NodeOutput = NodeOutput,
> implements INode<TInput, TOutput> {
  public readonly id: NodeId;
  public abstract readonly type: string;

  public constructor(id: NodeId) {
    this.id = id;
  }

  public abstract executeNode(input: TInput): TOutput;
}
