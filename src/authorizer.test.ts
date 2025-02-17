import { describe, expect, test } from 'vitest';
import { createAuthorizer } from './authorizer';
import {
  AuthorizerValidator,
  BaseEntity,
  MinimalRedisClient,
} from './authorizer.types';
import { getRedisClient } from './examples/redis/redis';

const entities = {
  projects: {
    one: {
      key: 'projects',
      id: 'b6dcb2fa-2caa-4eca-8aa2-9cfc43158013',
    },
  },
  files: {
    one: {
      key: 'files',
      id: '0f3fc7b7-8d02-4847-914e-037b03792f69',
    },
    two: {
      key: 'files',
      id: 'f0027730-7a7d-4821-811b-afd6dbd5187b',
    },
  },
  tasks: {
    one: {
      key: 'tasks',
      id: 'a9230aca-7483-492e-856b-7d867d0eb480',
    },
    two: {
      key: 'tasks',
      id: '49566e3b-f09f-43cb-8ff3-724529d7e629',
    },
  },
};

describe('authorizer', async () => {
  const cache = (await getRedisClient()) as unknown as MinimalRedisClient;

  test('validate: with cache', async () => {
    const authorizer = await createAuthorizer({
      cache,
      verbose: true,
      validators: [
        {
          parent: 'projects',
          child: 'files',
          validator: async (p: BaseEntity, c: BaseEntity): Promise<boolean> => {
            return (
              p.id === 'b6dcb2fa-2caa-4eca-8aa2-9cfc43158013' &&
              c.id === '0f3fc7b7-8d02-4847-914e-037b03792f69'
            );
          },
        },
        {
          parent: 'projects',
          child: 'tasks',
          validator: async (p: BaseEntity, c: BaseEntity): Promise<boolean> => {
            return (
              p.id === 'b6dcb2fa-2caa-4eca-8aa2-9cfc43158013' &&
              c.id === '49566e3b-f09f-43cb-8ff3-724529d7e629'
            );
          },
        },
      ] satisfies AuthorizerValidator<BaseEntity>[],
    });

    await expect(
      authorizer.validate(entities.projects.one, entities.files.one),
    ).resolves.toBe(true);
    await expect(
      authorizer.validate(entities.projects.one, entities.files.two),
    ).rejects.toThrow();
    await expect(
      authorizer.validate(entities.projects.one, entities.tasks.one),
    ).rejects.toThrow();
    await expect(
      authorizer.validate(entities.projects.one, entities.tasks.two),
    ).resolves.toBe(true);
  });

  test('validate: no cache', async () => {
    const authorizer = await createAuthorizer({
      verbose: true,
      validators: [
        {
          parent: 'projects',
          child: 'files',
          validator: async (p: BaseEntity, c: BaseEntity): Promise<boolean> => {
            return (
              p.id === 'b6dcb2fa-2caa-4eca-8aa2-9cfc43158013' &&
              c.id === '0f3fc7b7-8d02-4847-914e-037b03792f69'
            );
          },
        },
        {
          parent: 'projects',
          child: 'tasks',
          validator: async (p: BaseEntity, c: BaseEntity): Promise<boolean> => {
            return (
              p.id === 'b6dcb2fa-2caa-4eca-8aa2-9cfc43158013' &&
              c.id === '49566e3b-f09f-43cb-8ff3-724529d7e629'
            );
          },
        },
      ] satisfies AuthorizerValidator<BaseEntity>[],
    });

    await expect(
      authorizer.validate(entities.projects.one, entities.files.one),
    ).resolves.toBe(true);
    await expect(
      authorizer.validate(entities.projects.one, entities.files.two),
    ).rejects.toThrow();
    await expect(
      authorizer.validate(entities.projects.one, entities.tasks.one),
    ).rejects.toThrow();
    await expect(
      authorizer.validate(entities.projects.one, entities.tasks.two),
    ).resolves.toBe(true);
  });

  test('validateMany with cache', async () => {
    const authorizer = await createAuthorizer({
      cache,
      verbose: true,
      validators: [
        {
          parent: 'projects',
          child: 'files',
          validator: async (p: BaseEntity, c: BaseEntity): Promise<boolean> => {
            return (
              p.id === 'b6dcb2fa-2caa-4eca-8aa2-9cfc43158013' &&
              c.id === '0f3fc7b7-8d02-4847-914e-037b03792f69'
            );
          },
        },
        {
          parent: 'projects',
          child: 'tasks',
          validator: async (p: BaseEntity, c: BaseEntity): Promise<boolean> => {
            return (
              p.id === 'b6dcb2fa-2caa-4eca-8aa2-9cfc43158013' &&
              c.id === '49566e3b-f09f-43cb-8ff3-724529d7e629'
            );
          },
        },
      ] satisfies AuthorizerValidator<BaseEntity>[],
    });

    const resultsPass = await authorizer.validateMany([
      [entities.projects.one, entities.files.one], // good
      [entities.projects.one, entities.tasks.two], // good
    ]);
    expect(resultsPass).toEqual([true, true]);

    await expect(
      authorizer.validateMany([
        [entities.projects.one, entities.files.one], // good
        [entities.projects.one, entities.files.two], // bad
        [entities.projects.one, entities.tasks.one], // bad
        [entities.projects.one, entities.tasks.two], // good
      ]),
    ).rejects.toThrow();
  });

  test('validateMany: no cache', async () => {
    const authorizer = await createAuthorizer({
      verbose: true,
      validators: [
        {
          parent: 'projects',
          child: 'files',
          validator: async (p: BaseEntity, c: BaseEntity): Promise<boolean> => {
            return (
              p.id === 'b6dcb2fa-2caa-4eca-8aa2-9cfc43158013' &&
              c.id === '0f3fc7b7-8d02-4847-914e-037b03792f69'
            );
          },
        },
        {
          parent: 'projects',
          child: 'tasks',
          validator: async (p: BaseEntity, c: BaseEntity): Promise<boolean> => {
            return (
              p.id === 'b6dcb2fa-2caa-4eca-8aa2-9cfc43158013' &&
              c.id === '49566e3b-f09f-43cb-8ff3-724529d7e629'
            );
          },
        },
      ] satisfies AuthorizerValidator<BaseEntity>[],
    });

    const resultsPass = await authorizer.validateMany([
      [entities.projects.one, entities.files.one], // good
      [entities.projects.one, entities.tasks.two], // good
    ]);
    expect(resultsPass).toEqual([true, true]);

    await expect(
      authorizer.validateMany([
        [entities.projects.one, entities.files.one], // good
        [entities.projects.one, entities.files.two], // bad
        [entities.projects.one, entities.tasks.one], // bad
        [entities.projects.one, entities.tasks.two], // good
      ]),
    ).rejects.toThrow();
  });
});
