import { BaseNode } from '../core/classes/BaseNode';
import type { JsonObject } from '../core/types/Json';
import type { NodeId, NodeOutput } from '../core/types/Node';

type NodeHandler = (input: JsonObject) => NodeOutput;

export class CallbackNode extends BaseNode {
  public readonly type: string;
  private readonly handler: NodeHandler;

  public constructor(id: NodeId, handler: NodeHandler, type = 'callback') {
    super(id);
    this.type = type;
    this.handler = handler;
  }

  public executeNode(input: JsonObject): NodeOutput {
    return this.handler(input);
  }
}

export class PassthroughNode extends BaseNode {
  public readonly type = 'passthrough';

  public constructor(id: NodeId) {
    super(id);
  }

  public executeNode(input: JsonObject): NodeOutput {
    return { output0: { ...input } };
  }
}
