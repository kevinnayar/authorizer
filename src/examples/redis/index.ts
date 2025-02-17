import { entities } from '../../entities';
import {
  createAuthorizer,
  type AuthorizerValidator,
  type BaseEntity,
  type MinimalRedisClient,
} from '../../index';
import { getRedisClient } from './redis';

async function main() {
  const cache = (await getRedisClient()) as unknown as MinimalRedisClient;
  const authorizer = await createAuthorizer({
    cache,
    verbose: true,
    validators: [
      {
        parent: 'projects',
        child: 'files',
        validator: async (p: BaseEntity, c: BaseEntity): Promise<boolean> => {
          return (
            p.id === 'a1dcb2fa-2caa-4eca-8aa2-9cfc43158013' &&
            c.id === 'f13fc7b7-8d02-4847-914e-037b03792f69'
          );
        },
      },
      {
        parent: 'projects',
        child: 'tasks',
        validator: async (p: BaseEntity, c: BaseEntity): Promise<boolean> => {
          return (
            p.id === 'a1dcb2fa-2caa-4eca-8aa2-9cfc43158013' &&
            c.id === '72566e3b-f09f-43cb-8ff3-724529d7e629'
          );
        },
      },
    ] satisfies AuthorizerValidator<BaseEntity>[],
  });

  const { files, projects, tasks } = entities;

  console.log('\nSHOULD PASS => Testing project.one with files.one');
  await authorizer.validate(projects.one, files.one);

  console.log('\nSHOULD FAIL => Testing project.one with tasks.one');
  try {
    await authorizer.validate(projects.one, tasks.one);
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
