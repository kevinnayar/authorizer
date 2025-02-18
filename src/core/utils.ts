import { LoggerMethod } from './types';

export function createCompositeKey(parent: string, child: string) {
  if (!parent || !child) {
    throw new Error('Parent and child are required to create a composite key');
  }

  return `AuthorizerParent:<${parent}>_AuthorizerChild:<${child}>`;
}

export function getConditionalLogger(
  verbose?: boolean,
): Record<LoggerMethod, (...args: any[]) => void> {
  const handleLog = (fn: LoggerMethod, ...messages: any[]) => {
    if (verbose) {
      console[fn]('[Authorizer]', ...messages);
    }
  };

  return {
    log: (...args) => handleLog('log', ...args),
    error: (...args) => handleLog('error', ...args),
    warn: (...args) => handleLog('warn', ...args),
    debug: (...args) => handleLog('debug', ...args),
    info: (...args) => handleLog('info', ...args),
    trace: (...args) => handleLog('trace', ...args),
  };
}
