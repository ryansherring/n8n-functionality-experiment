import { createConsoleWorkflowLogger } from './logger';

describe('createConsoleWorkflowLogger', () => {
  const originalLog = console.log;

  afterEach(() => {
    console.log = originalLog;
  });

  test('logs event with data by default', () => {
    const logSpy = jest.fn();
    console.log = logSpy as unknown as typeof console.log;

    const logger = createConsoleWorkflowLogger({ prefix: 'iv', includeData: true });
    const payload = { foo: 'bar' };
    logger.log('node.execute', payload);

    expect(logSpy).toHaveBeenCalledWith('[iv][node.execute]', payload);
  });

  test('logs event without data when includeData is false', () => {
    const logSpy = jest.fn();
    console.log = logSpy as unknown as typeof console.log;

    const logger = createConsoleWorkflowLogger({ includeData: false });
    logger.log('workflow.done', { foo: 'bar' });

    expect(logSpy).toHaveBeenCalledWith('[workflow.done]');
  });

  test('prints empty string when data is undefined', () => {
    const logSpy = jest.fn();
    console.log = logSpy as unknown as typeof console.log;

    const logger = createConsoleWorkflowLogger({ includeData: true });
    logger.log('workflow.done');

    expect(logSpy).toHaveBeenCalledWith('[workflow.done]', '');
  });

  test('uses defaults when options are omitted', () => {
    const logSpy = jest.fn();
    console.log = logSpy as unknown as typeof console.log;

    const logger = createConsoleWorkflowLogger();
    const payload = { ready: true };
    logger.log('workflow.start', payload);

    expect(logSpy).toHaveBeenCalledWith('[workflow.start]', payload);
  });
});
