import { CallbackNode, PassthroughNode } from '.';

describe('CallbackNode', () => {
  test('delegates to provided handler', () => {
    const handler = jest.fn().mockReturnValue({ output0: { ok: true } });
    const node = new CallbackNode('nodeA', handler);

    const result = node.executeNode({ value: 1 });
    expect(handler).toHaveBeenCalledWith({ value: 1 });
    expect(result).toEqual({ output0: { ok: true } });
  });
});

describe('PassthroughNode', () => {
  test('clones the input payload', () => {
    const node = new PassthroughNode('nodeB');
    const input = { hello: 'world' };
    const result = node.executeNode(input);

    expect(result).toEqual({ output0: input });
    expect(result.output0).not.toBe(input);
  });
});
