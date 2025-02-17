import {
  InternalServerException,
  UnauthorizedException,
} from '../errors/authorizer.errors';
import {
  AuthorizerOpts,
  Entity,
  IAuthorizer,
  SafeValidationResult,
} from '../types/authorizer.types';
import { createCacheKey, getLogger } from '../utils/authorizer.utils';

export async function createAuthorizer<T extends object>(
  opts: AuthorizerOpts<T>,
): Promise<IAuthorizer<T>> {
  const logger = getLogger(opts.verbose);
  const cache = opts.cache || null;
  const CACHED_TOKEN = '__CACHED_TOKEN__';
  const validatorMap: Map<
    string,
    (parent: Entity<T>, child: Entity<T>) => Promise<boolean>
  > = new Map();

  for (const { parent, child, validator } of opts.validators) {
    const key = createCacheKey(parent, child);
    logger.log(`Saving validator method for ${key}`);
    validatorMap.set(key, validator);
  }

  async function validate(parent: Entity<T>, child: Entity<T>) {
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
      throw new InternalServerException(error);
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
  }

  async function safeValidate(parent: Entity<T>, child: Entity<T>) {
    try {
      const success = await validate(parent, child);
      return {
        success,
        error: null,
      } satisfies SafeValidationResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      return {
        success: false,
        error,
      } satisfies SafeValidationResult;
    }
  }

  async function validateMany(entities: [Entity<T>, Entity<T>][]) {
    const results: true[] = [];

    for (let i = 0; i < entities.length; i += 1) {
      const [parent, child] = entities[i];
      const result = await validate(parent, child);
      results.push(result);
    }

    return results;
  }

  async function safeValidateMany(entities: [Entity<T>, Entity<T>][]) {
    const results: SafeValidationResult[] = [];

    for (let i = 0; i < entities.length; i += 1) {
      const [parent, child] = entities[i];
      const result = await safeValidate(parent, child);
      results.push(result);
    }

    return results;
  }

  async function removeFromCache(parent: Entity<T>, child: Entity<T>) {
    if (cache) {
      logger.log(
        `Deleting cache for ${parent.key}:${parent.id} and ${child.key}:${child.id}`,
      );
      const cacheKey = createCacheKey(
        `${parent.key}_${parent.id}`,
        `${child.key}_${child.id}`,
      );
      await cache.del(cacheKey);
      logger.log(`Deleted cache for ${cacheKey}`);
    }
  }

  async function removeManyFromCache(entities: [Entity<T>, Entity<T>][]) {
    for (const [parent, child] of entities) {
      await removeFromCache(parent, child);
    }
  }

  async function clearCache() {
    if (cache) {
      logger.log('Flushing all cache');
      if (cache.flushAll) {
        await cache.flushAll();
      } else if (cache.clear) {
        await cache.clear();
      }
      logger.log('Flushed all cache');
    }
  }

  return {
    validate,
    safeValidate,
    validateMany,
    safeValidateMany,
    removeFromCache,
    removeManyFromCache,
    clearCache,
  };
}
