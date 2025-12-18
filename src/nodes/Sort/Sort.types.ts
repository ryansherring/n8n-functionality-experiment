import type { JsonArray, JsonObject, JsonValue } from '../../core/types/Json';
import type { NodeOutput } from '../../core/types/Node';

export type SortOrder = 'asc' | 'desc';

export type SortInput = JsonObject & {
  items?: JsonValue;
  key?: string;
  order?: SortOrder;
};

export type SortOutput = NodeOutput & {
  output0: JsonObject & { items: JsonArray };
};

export function isSortOrder(value: unknown): value is SortOrder {
  return value === 'asc' || value === 'desc';
}
