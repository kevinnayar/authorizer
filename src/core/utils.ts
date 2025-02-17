import { ConsoleMethod } from '../types/authorizer.types';

export function createCacheKey(parent: string, child: string) {
  return `AuthorizerParent:<${parent}>_AuthorizerChild:<${child}>`;
}

export function getLogger(
  verbose?: boolean,
): Record<ConsoleMethod, (...args: any[]) => void> {
  const handleLog = (fn: ConsoleMethod, ...messages: any[]) => {
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
