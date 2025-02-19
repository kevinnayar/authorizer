import express, { Request, Response } from 'express';
import { createAuthorizer } from 'src/index';
import { exampleValidators } from '../data';

const app = express();
const port = 3000;

app.use(express.json());

let authorizer: ReturnType<typeof createAuthorizer> | null = null;

async function getAuthorizerSingleton() {
  if (!authorizer) {
    authorizer = createAuthorizer({
      verbose: true,
      validators: exampleValidators,
    });
  }

  return authorizer;
}

app.get(
  '/teams/:teamId/projects/:projectId/tasks/:taskId',
  async (req: Request, res: Response) => {
    const { teamId, projectId, taskId } = req.params;

    const team = { key: 'teams', id: teamId };
    const project = { key: 'projects', id: projectId };
    const task = { key: 'tasks', id: taskId };

    try {
      const authorizer = await getAuthorizerSingleton();
      await authorizer.validateMany([
        [team, project],
        [project, task],
      ]);

      res.json({
        message: `Retrieved task ${taskId} from project ${projectId} and team ${teamId}`,
        projectId,
        taskId,
      });
      return;
    } catch (error) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }
  },
);

app.listen(port, () => console.log(`Server running on port ${port}`));
