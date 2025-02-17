import { createAuthorizer, type MinimalCache } from '../../index';
import { exampleEntities, exampleValidators } from '../data';
import { getRedisClient } from './redis';

async function main() {
  const cache = (await getRedisClient()) as MinimalCache;
  const authorizer = await createAuthorizer({
    cache,
    verbose: true,
    validators: exampleValidators,
  });

  const { projects, tasks } = exampleEntities;

  console.log('\nSHOULD PASS => Testing project.one with tasks.one');
  await authorizer.validate(projects.one, tasks.one);

  console.log('\nSHOULD FAIL => Testing project.one with tasks.two');
  try {
    await authorizer.validate(projects.one, tasks.two);
  } catch (e) {
    console.error(e);
  }
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
