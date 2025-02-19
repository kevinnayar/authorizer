import { describe, expect, test } from 'vitest';
import { exampleValidators, mockDB } from '../examples/data';
import { createAuthorizer } from './authorizer';
import { UnauthorizedException } from './errors';

describe('authorizer test suite', async () => {
  const authorizer = await createAuthorizer({ validators: exampleValidators });
  const { teams, projects, tasks } = mockDB.getData();

  test('authorizer.validate', async () => {
    await expect(
      authorizer.validate(teams.Engineering, projects.backendAPI),
    ).resolves.toBe(true);
    await expect(
      authorizer.validate(teams.Engineering, projects.brandSystem),
    ).rejects.toThrow();
  });

  test('authorizer.safeValidate', async () => {
    await expect(
      authorizer.safeValidate(teams.Engineering, projects.backendAPI),
    ).resolves.toEqual({
      success: true,
      error: null,
    });
    await expect(
      authorizer.safeValidate(teams.Engineering, projects.brandSystem),
    ).resolves.toEqual({
      success: false,
      error: new UnauthorizedException(
        [
          'Parent entity "teams": 3c8f54d8-70cf-41f4-aa2b-8170dd15abd1 does not',
          'have access to child entity "projects": bfa3fc5f-5593-4bbe-8725-ad4224283994.',
        ].join(' '),
      ),
    });
  });

  test('authorizer.validateMany', async () => {
    const resultsPass = await authorizer.validateMany([
      [teams.Engineering, projects.backendAPI],
      [projects.backendAPI, tasks.apiAuth],
    ]);
    expect(resultsPass).toEqual([true, true]);

    await expect(
      authorizer.validateMany([
        [teams.Engineering, projects.backendAPI],
        [projects.backendAPI, tasks.colorSystem],
      ]),
    ).rejects.toThrow();
  });

  test('authorizer.safeValidateMany', async () => {
    const resultsPass = await authorizer.safeValidateMany([
      [teams.Engineering, projects.backendAPI],
      [projects.backendAPI, tasks.apiAuth],
    ]);
    expect(resultsPass).toEqual([
      { error: null, success: true },
      { error: null, success: true },
    ]);

    const resultsFail = await authorizer.safeValidateMany([
      [teams.Engineering, projects.backendAPI],
      [projects.backendAPI, tasks.colorSystem],
    ]);
    expect(resultsFail).toEqual([
      { error: null, success: true },
      {
        error: new UnauthorizedException(
          [
            'Parent entity "projects": b2cfe39d-19f9-4549-aba0-b713841f5109 does not',
            'have access to child entity "tasks": 73eb6055-29cf-42d8-aa3e-bbe826cb9016.',
          ].join(' '),
        ),
        success: false,
      },
    ]);
  });
});
