import { BaseNode } from '../../core/classes/BaseNode';
import type { JsonValue } from '../../core/types/Json';
import { compareJson } from './compareJson';
import type { SortInput, SortOutput } from './Sort.types';
import { isSortOrder } from './Sort.types';

export class SortNode extends BaseNode<SortInput, SortOutput> {
  public readonly type = 'sort';

  public executeNode(input: SortInput): SortOutput {
    const rawItems = input.items;
    if (!Array.isArray(rawItems)) {
      throw new Error('items must be an array');
    }

    const key = typeof input.key === 'string' ? input.key : undefined;
    const order = isSortOrder(input.order) ? input.order : 'asc';

    const items = [...rawItems];
    items.sort((left, right) => {
      const a =
        key && left && typeof left === 'object'
          ? (left as Record<string, unknown>)[key]
          : left;
      const b =
        key && right && typeof right === 'object'
          ? (right as Record<string, unknown>)[key]
          : right;

      const cmp = compareJson(a as JsonValue, b as JsonValue);
      return order === 'desc' ? -cmp : cmp;
    });

    return {
      output0: {
        ...input,
        items,
      },
    };
  }
}
