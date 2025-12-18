import { IfElseNode, isCondition, isConditionOp } from '.';

describe('IfElseNode', () => {
  test('routes true to output1, false to output0', () => {
    const node = new IfElseNode('nodeB');

    const trueOut = node.executeNode({
      value: 10,
      condition: { leftPath: 'value', op: 'gt', right: 5 },
    });
    expect(trueOut.output1).toEqual({
      value: 10,
      condition: { leftPath: 'value', op: 'gt', right: 5 },
    });
    expect(trueOut.output0).toEqual({});

    const falseOut = node.executeNode({
      value: 2,
      condition: { leftPath: 'value', op: 'gt', right: 5 },
    });
    expect(falseOut.output0).toEqual({
      value: 2,
      condition: { leftPath: 'value', op: 'gt', right: 5 },
    });
    expect(falseOut.output1).toEqual({});
  });

  test('supports includes on arrays and strings and defaults when condition missing', () => {
    const node = new IfElseNode('nodeB');

    const arrayOut = node.executeNode({
      tags: ['a', 'b'],
      condition: { leftPath: 'tags', op: 'includes', right: 'b' },
    });
    expect(arrayOut.output1.tags).toEqual(['a', 'b']);

    const missing = node.executeNode({ ok: true });
    expect(missing).toEqual({ output0: { ok: true }, output1: {} });

    const stringOut = node.executeNode({
      text: 'hello',
      condition: { leftPath: 'text', op: 'includes', right: 'ell' },
    });
    expect(stringOut.output1.text).toBe('hello');
  });

  test('supports eq/neq, empty-path, nested-path, and non-object paths', () => {
    const node = new IfElseNode('nodeB');

    const eqObject = node.executeNode({
      a: { b: 1 },
      condition: { leftPath: 'a', op: 'eq', right: { b: 1 } },
    });
    expect(eqObject.output1.a).toEqual({ b: 1 });

    const neqObject = node.executeNode({
      a: { b: 1 },
      condition: { leftPath: 'a', op: 'neq', right: { b: 2 } },
    });
    expect(neqObject.output1.a).toEqual({ b: 1 });

    const ltPass = node.executeNode({
      value: 1,
      condition: { leftPath: 'value', op: 'lt', right: 2 },
    });
    expect(ltPass.output1.value).toBe(1);

    const emptyPath = node.executeNode({
      x: 1,
      condition: { leftPath: '', op: 'neq', right: {} },
    });
    expect(emptyPath.output1.x).toBe(1);

    const nestedPath = node.executeNode({
      a: { b: 1 },
      condition: { leftPath: 'a.b', op: 'eq', right: 1 },
    });
    expect(nestedPath.output1.a).toEqual({ b: 1 });

    const nonObjectPath = node.executeNode({
      value: 123,
      condition: { leftPath: 'value.deep', op: 'eq', right: null },
    });
    expect(nonObjectPath.output1.value).toBe(123);

    const arrayIntermediate = node.executeNode({
      arr: [{ x: 1 }],
      condition: { leftPath: 'arr.x', op: 'eq', right: null },
    });
    expect(arrayIntermediate.output1.arr).toEqual([{ x: 1 }]);

    const nullIntermediate = node.executeNode({
      a: {},
      condition: { leftPath: 'a.b.c', op: 'eq', right: null },
    });
    expect(nullIntermediate.output1.a).toEqual({});
  });

  test('includes returns false for unsupported types', () => {
    const node = new IfElseNode('nodeB');
    const out = node.executeNode({
      value: 1,
      condition: { leftPath: 'value', op: 'includes', right: 1 },
    });
    expect(out.output0.value).toBe(1);
  });
});

describe('IfElse types', () => {
  test('isCondition validates shape', () => {
    expect(isCondition({ leftPath: 'x', op: 'gt', right: 1 })).toBe(true);
    expect(isCondition({ leftPath: 'x', op: 'nope', right: 1 })).toBe(false);
    expect(isCondition(null)).toBe(false);
  });

  test('isConditionOp validates the operator list', () => {
    expect(isConditionOp('eq')).toBe(true);
    expect(isConditionOp('not-an-op' as any)).toBe(false);
  });
});
