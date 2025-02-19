import { createAuthorizer, type IMinimalCache } from '../../index';
import { exampleValidators, mockDB } from '../data';
import { getRedisClient } from './redis';

async function main() {
  const cache = (await getRedisClient()) as IMinimalCache;
  const authorizer = await createAuthorizer({
    cache,
    verbose: true,
    validators: exampleValidators,
  });

  const { teams, projects, tasks } = mockDB.getData();

  console.log('\nSHOULD PASS...\n');
  await authorizer.validateMany([
    [teams.Engineering, projects.backendAPI],
    [projects.backendAPI, tasks.apiAuth],
  ]);
  console.log('\nPASSED!!!!\n');

  console.log('\nSHOULD FAIL...\n');
  try {
    await authorizer.validateMany([
      [teams.Engineering, projects.backendAPI],
      [projects.backendAPI, tasks.typography],
    ]);
  } catch (e) {
    console.error(e);
    console.log('\nFAILED!!!\n');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
