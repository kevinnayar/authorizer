import express, { Request, Response } from 'express';
import {
  createAuthorizer,
  type AuthorizerValidator,
  type BaseEntity,
} from 'src/index';

const app = express();
const port = 3000;

app.use(express.json());

let authorizer: ReturnType<typeof createAuthorizer> | null = null;

async function getAuthorizer() {
  if (!authorizer) {
    authorizer = createAuthorizer({
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
  }

  return authorizer;
}

app.get(
  '/projects/:projectId/tasks/:taskId',
  async (req: Request, res: Response) => {
    const { projectId, taskId } = req.params;
    const authorizer = await getAuthorizer();
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

app.get(
  '/projects/:projectId/files/:fileId',
  async (req: Request, res: Response) => {
    const { projectId, fileId } = req.params;
    const authorizer = await getAuthorizer();
    try {
      await authorizer.validate(
        { key: 'projects', id: projectId },
        { key: 'files', id: fileId },
      );

      res.json({
        message: `Retrieved file ${fileId} from project ${projectId}`,
        projectId,
        fileId,
      });
      return;
    } catch (error) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }
  },
);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
