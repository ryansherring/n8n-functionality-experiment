import type { JsonObject, JsonValue } from '../../core/types/Json';
import type { NodeOutput } from '../../core/types/Node';

export type ConditionOp = 'eq' | 'neq' | 'gt' | 'lt' | 'includes';

export interface Condition {
  leftPath: string;
  op: ConditionOp;
  right: JsonValue;
}

export type IfElsePorts = 'output0' | 'output1';

export type IfElseInput = JsonObject & {
  condition?: unknown;
};

export type IfElseOutput = NodeOutput & {
  output0: JsonObject;
  output1: JsonObject;
};

const CONDITION_OPS: ReadonlySet<ConditionOp> = new Set(['eq', 'neq', 'gt', 'lt', 'includes']);

export function isConditionOp(value: unknown): value is ConditionOp {
  return typeof value === 'string' && CONDITION_OPS.has(value as ConditionOp);
}

export function isCondition(value: unknown): value is Condition {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.leftPath === 'string' &&
    isConditionOp(candidate.op) &&
    Object.prototype.hasOwnProperty.call(candidate, 'right')
  );
}
