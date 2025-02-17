import {
  AuthorizerOpts,
  AuthorizerValidationFn,
  ConsoleMethod,
  Entity,
} from './authorizer.types';

function createCacheKey(parent: string, child: string) {
  return `AuthorizerParent:<${parent}>_AuthorizerChild:<${child}>`;
}

function getLogger(
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

class UnauthorizedException extends Error {
  public readonly statusCode: number = 401;
  public readonly status: string = 'Unauthorized';

  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedException';
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        statusCode: this.statusCode,
        status: this.status,
      },
    };
  }
}

export async function createAuthorizer<T extends object>(
  opts: AuthorizerOpts<T>,
) {
  const logger = getLogger(opts.verbose);
  const cache = opts.cache || null;
  const CACHED_TOKEN = '__CACHED_TOKEN__';
  const validatorMap: Map<string, AuthorizerValidationFn<T>> = new Map();

  for (const { parent, child, validator } of opts.validators) {
    const key = createCacheKey(parent, child);
    logger.log(`Saving validator method for ${key}`);
    validatorMap.set(key, validator);
  }

  const validate = async (parent: Entity<T>, child: Entity<T>) => {
    const cacheKey = createCacheKey(
      `${parent.key}_${parent.id}`,
      `${child.key}_${child.id}`,
    );

    if (cache && (await cache.get(cacheKey)) === CACHED_TOKEN) {
      logger.log(`Cache hit for ${cacheKey}`);
      return true;
    }

    const key = createCacheKey(parent.key, child.key);
    const validator = validatorMap.get(key);

    if (typeof validator !== 'function') {
      const error = [
        `No authorizer validation function exists for this parent`,
        `"${parent.key}" and child "${child.key}" relationship.`,
      ].join(' ');

      logger.error(error);
      throw new UnauthorizedException(error);
    }

    const value = await validator(parent, child);

    if (!value) {
      const error = [
        `Parent entity "${parent.key}": ${parent.id} does not`,
        `have access to child entity "${child.key}": ${child.id}.`,
      ].join(' ');

      logger.error(error);
      throw new UnauthorizedException(error);
    }

    if (cache) {
      await cache.set(cacheKey, CACHED_TOKEN);
    }

    return value;
  };

  const validateMany = async (
    entities: [Entity<T>, Entity<T>][],
  ): Promise<boolean[]> => {
    const results: boolean[] = [];

    for (let i = 0; i < entities.length; i += 1) {
      const [parent, child] = entities[i];
      const result = await validate(parent, child);
      results.push(result);
    }

    return results;
  };

  return {
    validate,
    validateMany,
  };
}
