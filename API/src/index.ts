import express, { Request, Response, NextFunction } from 'express';
import taskRoutes from './routes/taskRoutes';

const app = express();
const port = process.env.PORT || 3000;
const DELETE_AUTH_HEADER = process.env.DELETE_AUTH_HEADER ?? 'X-Delete-Auth';
const DELETE_AUTH_TOKEN = process.env.DELETE_AUTH_TOKEN ?? 'task-manager-delete';

//CORS 
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    `Origin, X-Requested-With, Content-Type, Accept, ${DELETE_AUTH_HEADER}`,
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: { message: 'Task Management API is running' } });
});

//routes
app.use('/tasks', taskRoutes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next({ status: 404, message: 'Route not found.' });
});

//Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = typeof err.status === 'number' ? err.status : 500;
  const message = typeof err.message === 'string' ? err.message : 'Internal server error.';
  const details = err.details || undefined;

  res.status(status).json({
    success: false,
    error: {
      message,
      ...(details ? { details } : {}),
    },
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
