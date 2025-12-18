import { SortNode, compareJson, isSortOrder } from '.';

describe('SortNode', () => {
  test('sorts primitives ascending by default', () => {
    const node = new SortNode('nodeC');
    const out = node.executeNode({ items: [3, 1, 2] });
    expect(out).toEqual({ output0: { items: [1, 2, 3] } });
  });

  test('sorts objects by key and order', () => {
    const node = new SortNode('nodeC');

    const asc = node.executeNode({
      items: [{ n: 2 }, { n: 1 }],
      key: 'n',
      order: 'asc',
    });
    expect(asc.output0.items).toEqual([{ n: 1 }, { n: 2 }]);

    const desc = node.executeNode({
      items: [{ n: 2 }, { n: 1 }],
      key: 'n',
      order: 'desc',
    });
    expect(desc.output0.items).toEqual([{ n: 2 }, { n: 1 }]);
  });

  test('sorts strings and falls back to JSON comparison for objects', () => {
    const node = new SortNode('nodeC');

    const strings = node.executeNode({ items: ['b', 'a'] });
    expect(strings.output0.items).toEqual(['a', 'b']);

    const objects = node.executeNode({ items: [{ a: 2 }, { a: 1 }] });
    expect(objects.output0.items).toEqual([{ a: 1 }, { a: 2 }]);
  });

  test('throws on invalid items', () => {
    const node = new SortNode('nodeC');
    expect(() => node.executeNode({ items: 123 as any })).toThrow('items must be an array');
  });
});

describe('Sort helpers', () => {
  test('compareJson handles primitive and object ordering', () => {
    expect(compareJson(1, 2)).toBeLessThan(0);
    expect(compareJson('b', 'a')).toBeGreaterThan(0);
    expect(compareJson(true, false)).toBeGreaterThan(0);
    expect(compareJson({ a: 1 }, { a: 2 })).toBeLessThan(0);
  });

  test('isSortOrder type guard', () => {
    expect(isSortOrder('asc')).toBe(true);
    expect(isSortOrder('desc')).toBe(true);
    expect(isSortOrder('nope' as any)).toBe(false);
  });
});
