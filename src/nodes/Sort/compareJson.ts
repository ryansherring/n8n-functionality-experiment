import type { JsonValue } from '../../core/types/Json';

export function compareJson(a: JsonValue, b: JsonValue): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b);
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);

  const left = JSON.stringify(a);
  const right = JSON.stringify(b);
  return left.localeCompare(right);
}
