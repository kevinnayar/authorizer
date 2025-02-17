import { MinimalCache } from 'src/types/authorizer.types';
import { describe, expect, test } from 'vitest';
import { exampleEntities, exampleValidators } from '../examples/data';
import { getRedisClient } from '../examples/redis/redis';
import { createAuthorizer } from './authorizer';

describe('authorizer', async () => {
  const authorizerNoCache = await createAuthorizer({
    validators: exampleValidators,
  });

  const cache = await getRedisClient();
  const authorizerWithCache = await createAuthorizer({
    cache: cache as MinimalCache,
    validators: exampleValidators,
  });

  const { projects, tasks } = exampleEntities;

  test('validate: with cache', async () => {
    await expect(
      authorizerWithCache.validate(projects.one, tasks.one),
    ).resolves.toBe(true);
    await expect(
      authorizerWithCache.validate(projects.one, tasks.two),
    ).rejects.toThrow();
  });

  test('validate: no cache', async () => {
    await expect(
      authorizerNoCache.validate(projects.one, tasks.one),
    ).resolves.toBe(true);
    await expect(
      authorizerNoCache.validate(projects.one, tasks.two),
    ).rejects.toThrow();
  });

  test('validateMany: with cache', async () => {
    const resultsPass = await authorizerWithCache.validateMany([
      [projects.one, tasks.one], // good
      [projects.one, tasks.three], // good
    ]);
    expect(resultsPass).toEqual([true, true]);

    await expect(
      authorizerWithCache.validateMany([
        [projects.one, tasks.one], // good
        [projects.one, tasks.two], // bad
        [projects.one, tasks.three], // good
      ]),
    ).rejects.toThrow();
  });

  test('validateMany: no cache', async () => {
    const resultsPass = await authorizerNoCache.validateMany([
      [projects.one, tasks.one], // good
      [projects.one, tasks.three], // good
    ]);
    expect(resultsPass).toEqual([true, true]);

    await expect(
      authorizerNoCache.validateMany([
        [projects.one, tasks.one], // good
        [projects.one, tasks.two], // bad
        [projects.one, tasks.three], // good
      ]),
    ).rejects.toThrow();
  });
});
