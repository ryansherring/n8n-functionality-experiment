import { BaseNode } from '../../core/classes/BaseNode';
import type { JsonObject, JsonValue } from '../../core/types/Json';
import type { Condition, ConditionOp, IfElseInput, IfElseOutput } from './IfElse.types';
import { isCondition } from './IfElse.types';

function getByPath(root: JsonObject, path: string): JsonValue {
  if (path.trim() === '') return root;

  const parts = path.split('.').filter(Boolean);
  let current: JsonValue = root;

  for (const part of parts) {
    if (current === null || typeof current !== 'object' || Array.isArray(current)) {
      return null;
    }
    current = (current as JsonObject)[part] ?? null;
  }

  return current;
}

function jsonEquals(a: JsonValue, b: JsonValue): boolean {
  if (a === b) return true;

  const aObj = a !== null && typeof a === 'object';
  const bObj = b !== null && typeof b === 'object';
  if (aObj && bObj) return JSON.stringify(a) === JSON.stringify(b);

  return false;
}

const CONDITION_HANDLERS: Record<ConditionOp, (left: JsonValue, right: JsonValue) => boolean> = {
  eq: (left, right) => jsonEquals(left, right),
  neq: (left, right) => !jsonEquals(left, right),
  gt: (left, right) => typeof left === 'number' && typeof right === 'number' && left > right,
  lt: (left, right) => typeof left === 'number' && typeof right === 'number' && left < right,
  includes: (left, right) => {
    if (typeof left === 'string' && typeof right === 'string') return left.includes(right);
    if (Array.isArray(left)) return left.some((v) => jsonEquals(v, right));
    return false;
  },
};

function evaluateCondition(input: JsonObject, condition: Condition): boolean {
  const left = getByPath(input, condition.leftPath);
  const right = condition.right;

  return CONDITION_HANDLERS[condition.op](left, right);
}

export class IfElseNode extends BaseNode<IfElseInput, IfElseOutput> {
  public readonly type = 'ifElse';

  public executeNode(input: IfElseInput): IfElseOutput {
    const condition = isCondition(input.condition) ? input.condition : undefined;
    if (!condition) return { output0: input, output1: {} };

    const passed = evaluateCondition(input, condition);
    return passed ? { output0: {}, output1: input } : { output0: input, output1: {} };
  }
}
