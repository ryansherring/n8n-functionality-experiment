import { nodeIdFromIndex } from './nodeId';

describe('nodeIdFromIndex', () => {
  test('generates nodeA..nodeZ', () => {
    expect(nodeIdFromIndex(0)).toBe('nodeA');
    expect(nodeIdFromIndex(1)).toBe('nodeB');
    expect(nodeIdFromIndex(25)).toBe('nodeZ');
  });

  test('continues past Z (AA style)', () => {
    expect(nodeIdFromIndex(26)).toBe('nodeAA');
    expect(nodeIdFromIndex(27)).toBe('nodeAB');
  });

  test('throws on negative indices', () => {
    expect(() => nodeIdFromIndex(-1)).toThrow('index must be >= 0');
  });
});
