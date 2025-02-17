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
 *
 * SHOULD FAIL
 * curl http://localhost:3000/projects/a1dcb2fa-2caa-4eca-8aa2-9cfc43158013/tasks/72566e3b-f09f-43cb-8ff3-724529d7e629
 */

app.get(
  '/projects/:projectId/tasks/:taskId',
  async (req: Request, res: Response) => {
    const { projectId, taskId } = req.params;
    const authorizer = await getAuthorizerSingleton();
    try {
      await authorizer.validate(
        { key: 'projects', id: projectId },
        { key: 'tasks', id: taskId },
      );

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
