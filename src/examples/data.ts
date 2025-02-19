import { AuthorizerValidator, BaseEntity } from '../core/types';

const teams = {
  Engineering: {
    key: 'teams',
    name: 'Engineering Team',
    id: '3c8f54d8-70cf-41f4-aa2b-8170dd15abd1',
  },
  Design: {
    key: 'teams',
    name: 'Design Team',
    id: '3675e9e0-1916-4f9b-9596-266f150e93ef',
  },
};

const projects = {
  backendAPI: {
    key: 'projects',
    name: 'Backend API',
    id: 'b2cfe39d-19f9-4549-aba0-b713841f5109',
    teamId: teams.Engineering.id,
  },
  frontendApp: {
    key: 'projects',
    name: 'Frontend App',
    id: 'bb9145ab-cb2a-400f-b810-042a9ebc03cf',
    teamId: teams.Engineering.id,
  },
  brandSystem: {
    key: 'projects',
    name: 'Brand System',
    id: 'bfa3fc5f-5593-4bbe-8725-ad4224283994',
    teamId: teams.Design.id,
  },
};

const tasks = {
  apiAuth: {
    key: 'tasks',
    id: '71230aca-7483-492e-856b-7d867d0eb480',
    projectId: projects.backendAPI.id,
  },
  apiRoutes: {
    key: 'tasks',
    id: '72566e3b-f09f-43cb-8ff3-724529d7e629',
    projectId: projects.backendAPI.id,
  },
  stateManagement: {
    key: 'tasks',
    id: '771370b8-2b45-4680-83f1-bd1f97e6c139',
    projectId: projects.frontendApp.id,
  },
  colorSystem: {
    key: 'tasks',
    id: '73eb6055-29cf-42d8-aa3e-bbe826cb9016',
    projectId: projects.brandSystem.id,
  },
  typography: {
    key: 'tasks',
    id: '7c4abf0f-e5d5-4644-a78e-80b696322aa6',
    projectId: projects.brandSystem.id,
  },
};

export const mockDB = {
  getData: () => {
    return {
      teams,
      projects,
      tasks,
    };
  },
  getTeam: (id: string) => {
    return Object.values(teams).find((t) => t.id === id);
  },
  getTeamProject: (teamId: string, projectId: string) => {
    return Object.values(projects).find(
      (p) => p.teamId === teamId && p.id === projectId,
    );
  },
  getProject: (id: string) => {
    return Object.values(projects).find((p) => p.id === id);
  },
  getProjectTask: (projectId: string, taskId: string) => {
    return Object.values(tasks).find(
      (t) => t.projectId === projectId && t.id === taskId,
    );
  },
  getTask: (id: string) => {
    return Object.values(tasks).find((t) => t.id === id);
  },
};

const teamHasProject = async (
  team: BaseEntity,
  project: BaseEntity,
): Promise<boolean> => {
  const projectMaybe = mockDB.getTeamProject(
    team.id as string,
    project.id as string,
  );
  return Boolean(projectMaybe);
};

const projectHasTask = async (
  p: BaseEntity,
  c: BaseEntity,
): Promise<boolean> => {
  const taskMaybe = mockDB.getProjectTask(p.id as string, c.id as string);
  return Boolean(taskMaybe);
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
