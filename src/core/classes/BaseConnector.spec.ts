import {
  BaseConnector,
  BaseNode,
  BaseWorkflow,
} from '.';
import {
  isConnectorLike,
  normalizeConnector,
} from './BaseConnector';

describe('BaseConnector', () => {
  test('retains shape and serializes via toJSON', () => {
    const connector = new BaseConnector({ from: 'nodeA', output: 'output0', to: 'nodeB' });
    expect(connector.from).toBe('nodeA');
    expect(connector.output).toBe('output0');
    expect(connector.to).toBe('nodeB');
    expect(connector.toJSON()).toEqual({ from: 'nodeA', output: 'output0', to: 'nodeB' });
  });

  test('isConnectorLike detects plain objects and BaseConnector instances', () => {
    expect(isConnectorLike({ from: 'nodeA', output: 'output0', to: 'nodeB' })).toBe(true);
    expect(isConnectorLike(new BaseConnector({ from: 'nodeA', output: 'output0', to: 'nodeB' }))).toBe(true);
    expect(isConnectorLike(null)).toBe(false);
    expect(isConnectorLike({ from: 'nodeA' })).toBe(false);
  });

  test('normalizeConnector unwraps BaseConnector instances', () => {
    const instance = new BaseConnector({ from: 'nodeA', output: 'output0', to: 'nodeB' });
    expect(normalizeConnector(instance)).toEqual({ from: 'nodeA', output: 'output0', to: 'nodeB' });
    const plain = { from: 'nodeC', output: 'output1', to: 'nodeD' };
    expect(normalizeConnector(plain)).toBe(plain);
  });
});

describe('core/classes index', () => {
  test('re-exports foundational classes', () => {
    expect(typeof BaseNode).toBe('function');
    expect(typeof BaseWorkflow).toBe('function');
  });

  test('BaseConnector is available via index', () => {
    const connector = new BaseConnector({ from: 'nodeA', output: 'output0', to: 'nodeB' });
    expect(connector).toBeInstanceOf(BaseConnector);
  });
});
