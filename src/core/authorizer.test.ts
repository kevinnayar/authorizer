import { describe, expect, test } from 'vitest';
import { exampleEntities, exampleValidators } from '../examples/data';
import { createAuthorizer } from './authorizer';
import { UnauthorizedException } from './errors';

describe('authorizer test suite', async () => {
  const authorizer = await createAuthorizer({ validators: exampleValidators });
  const { projects, tasks } = exampleEntities;

  test('authorizer.validate', async () => {
    await expect(authorizer.validate(projects.one, tasks.one)).resolves.toBe(
      true,
    );
    await expect(
      authorizer.validate(projects.one, tasks.two),
    ).rejects.toThrow();
  });

  test('authorizer.safeValidate', async () => {
    await expect(
      authorizer.safeValidate(projects.one, tasks.one),
    ).resolves.toEqual({
      success: true,
      error: null,
    });
    await expect(
      authorizer.safeValidate(projects.one, tasks.two),
    ).resolves.toEqual({
      success: false,
      error: new UnauthorizedException(
        [
          'Parent entity "projects": a1dcb2fa-2caa-4eca-8aa2-9cfc43158013 does not',
          'have access to child entity "tasks": 72566e3b-f09f-43cb-8ff3-724529d7e629.',
        ].join(' '),
      ),
    });
  });

  test('authorizer.validateMany', async () => {
    const resultsPass = await authorizer.validateMany([
      [projects.one, tasks.one], // good
      [projects.one, tasks.three], // good
    ]);
    expect(resultsPass).toEqual([true, true]);

    await expect(
      authorizer.validateMany([
        [projects.one, tasks.one], // good
        [projects.one, tasks.two], // bad
        [projects.one, tasks.three], // good
      ]),
    ).rejects.toThrow();
  });

  test('authorizer.safeValidateMany', async () => {
    const resultsPass = await authorizer.safeValidateMany([
      [projects.one, tasks.one], // good
      [projects.one, tasks.three], // good
    ]);
    expect(resultsPass).toEqual([
      { error: null, success: true },
      { error: null, success: true },
    ]);

    const resultsFail = await authorizer.safeValidateMany([
      [projects.one, tasks.one], // good
      [projects.one, tasks.two], // bad
      [projects.one, tasks.three], // good
    ]);
    expect(resultsFail).toEqual([
      { error: null, success: true },
      {
        error: new UnauthorizedException(
          [
            'Parent entity "projects": a1dcb2fa-2caa-4eca-8aa2-9cfc43158013 does not',
            'have access to child entity "tasks": 72566e3b-f09f-43cb-8ff3-724529d7e629.',
          ].join(' '),
        ),
        success: false,
      },
      { error: null, success: true },
    ]);
  });
});
