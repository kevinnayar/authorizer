import { AuthorizerValidator, BaseEntity } from '../core/types';

export const exampleEntities = {
  teams: {
    one: {
      key: 'teams',
      id: '3c8f54d8-70cf-41f4-aa2b-8170dd15abd1',
    },
  },
  projects: {
    one: {
      key: 'projects',
      id: 'a1dcb2fa-2caa-4eca-8aa2-9cfc43158013',
    },
  },
  tasks: {
    one: {
      key: 'tasks',
      id: '71230aca-7483-492e-856b-7d867d0eb480',
    },
    two: {
      key: 'tasks',
      id: '72566e3b-f09f-43cb-8ff3-724529d7e629',
    },
    three: {
      key: 'tasks',
      id: '73689a2d-c2af-4520-9dc7-1033fcb1db7e',
    },
  },
};

const teamHasProject = async (
  p: BaseEntity,
  c: BaseEntity,
): Promise<boolean> => {
  const { teams, projects } = exampleEntities;
  return p.id === teams.one.id && c.id === projects.one.id;
};

const projectHasTask = async (
  p: BaseEntity,
  c: BaseEntity,
): Promise<boolean> => {
  const { projects, tasks } = exampleEntities;
  return (
    p.id === projects.one.id &&
    [tasks.one.id, tasks.three.id].includes(c.id as string)
  );
};

export const exampleValidators = [
  {
    parent: 'teams',
    child: 'projects',
    validator: teamHasProject,
  },
  {
    parent: 'projects',
    child: 'tasks',
    validator: projectHasTask,
  },
] satisfies AuthorizerValidator<BaseEntity>[];
