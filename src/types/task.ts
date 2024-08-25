import { z } from 'zod';

export const updateTasksSchema = z.object({
  tasks: z.array(
    z.object({
      taskId: z.string(),
      title: z.string(),
      dueDate: z.string(),
      completed: z.boolean(),
    }),
  ),
});

export type UpdateTasksSchema = z.infer<typeof updateTasksSchema>;
