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

/**
 * SHOULD PASS
 * curl http://localhost:3000/projects/a1dcb2fa-2caa-4eca-8aa2-9cfc43158013/tasks/71230aca-7483-492e-856b-7d867d0eb480
 * curl http://localhost:3000/projects/a1dcb2fa-2caa-4eca-8aa2-9cfc43158013/tasks/73689a2d-c2af-4520-9dc7-1033fcb1db7e
 *
 * SHOULD FAIL
 * curl http://localhost:3000/projects/a1dcb2fa-2caa-4eca-8aa2-9cfc43158013/tasks/72566e3b-f09f-43cb-8ff3-724529d7e629
 */

app.get(
  '/projects/:projectId/tasks/:taskId',
  async (req: Request, res: Response) => {
    const { projectId, taskId } = req.params;
    const parent = { key: 'projects', id: projectId };
    const child = { key: 'tasks', id: taskId };

    try {
      const authorizer = await getAuthorizerSingleton();
      await authorizer.validate(parent, child);

      res.json({
        message: `Retrieved task ${taskId} from project ${projectId}`,
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
