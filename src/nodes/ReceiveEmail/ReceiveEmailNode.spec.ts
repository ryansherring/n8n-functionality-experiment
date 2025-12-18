import { ReceiveEmailNode, isEmail } from '.';

describe('ReceiveEmail', () => {
  test('isEmail validates shape', () => {
    expect(isEmail({ from: 'a', subject: 'b', body: 'c' })).toBe(true);
    expect(isEmail({ from: 'a', subject: 'b' })).toBe(false);
    expect(isEmail(null)).toBe(false);
  });

  test('passes through an existing email', () => {
    const node = new ReceiveEmailNode('nodeA');
    const out = node.executeNode({ email: { from: 'a@b.com', subject: 'Hi', body: 'Yo' } });

    expect(out).toEqual({
      output0: { email: { from: 'a@b.com', subject: 'Hi', body: 'Yo' } },
    });
  });

  test('creates a default email when missing', () => {
    const node = new ReceiveEmailNode('nodeA');
    const out = node.executeNode({});
    expect(out.output0.email).toEqual({ from: 'unknown', subject: '', body: '' });
  });
});
