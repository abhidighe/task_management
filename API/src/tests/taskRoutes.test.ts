import request from 'supertest';
import { createTaskItem, seedTasks } from '../urtils/taskStore';
import { createApp } from '../index';

describe('Task API routes', () => {
  beforeEach(() => {
    seedTasks([]);
  });

  it('creates a task and returns it', async () => {
    const app = createApp();

    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Write tests',
        description: 'Add Jest coverage',
        priority: 'high',
        status: 'todo',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      title: 'Write tests',
      priority: 'high',
      status: 'todo',
    });
  });

  it('lists tasks and supports filters', async () => {
    const app = createApp();
    createTaskItem('Alpha', 'First task', 'high', 'todo');
    createTaskItem('Beta', 'Second task', 'low', 'done');

    const response = await request(app).get('/tasks?priority=high&status=todo').expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      title: 'Alpha',
      priority: 'high',
      status: 'todo',
    });
  });

  it('gets a task by id', async () => {
    const app = createApp();
    const task = createTaskItem('Fetch me', 'Existing task', 'medium', 'in-progress');

    const response = await request(app).get(`/tasks/${task.id}`).expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      id: task.id,
      title: 'Fetch me',
    });
  });

  it('updates a task by id', async () => {
    const app = createApp();
    const task = createTaskItem('Old title', 'Old description', 'low', 'todo');

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send({
        title: 'Updated task',
        description: 'Updated description',
        priority: 'high',
        status: 'done',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      id: task.id,
      title: 'Updated task',
      description: 'Updated description',
      priority: 'high',
      status: 'done',
    });
  });

  it('deletes a task by id when authorized', async () => {
    const app = createApp();
    const task = createTaskItem('Delete me', 'Will be removed', 'medium', 'todo');

    const response = await request(app)
      .delete(`/tasks/${task.id}`)
      .set('X-Delete-Auth', 'task-manager-delete')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({ id: task.id });
  });

  it('returns validation errors for invalid task payload', async () => {
    const app = createApp();

    const response = await request(app)
      .post('/tasks')
      .send({
        title: '',
        description: 'Missing valid title',
        priority: 'urgent',
        status: 'todo',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'title' })]),
    );
  });
});
