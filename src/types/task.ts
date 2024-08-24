import { z } from 'zod';

export const createTasksSchema = z.object({
  tasks: z.array(
    z.object({
      taskId: z.string().optional(),
      title: z.string(),
      dueDate: z.string(),
      completed: z.boolean(),
    }),
  ),
});

export type CreateTasksSchema = z.infer<typeof createTasksSchema>;
