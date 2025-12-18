import type { WorkflowLogger } from './core/executeWorkflow';

export type ConsoleWorkflowLoggerOptions = {
  includeData?: boolean;
  prefix?: string;
};

export function createConsoleWorkflowLogger(
  options: ConsoleWorkflowLoggerOptions = {},
): WorkflowLogger {
  const includeData = options.includeData ?? true;
  const prefix = options.prefix ? `[${options.prefix}]` : '';

  return {
    log: (event, data) => {
      const tag = `${prefix}[${event}]`;
      if (!includeData) {
        console.log(tag);
        return;
      }
      console.log(tag, data ?? '');
    },
  };
}
