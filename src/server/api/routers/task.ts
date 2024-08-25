import { z } from 'zod';

import { getUtcDayRange } from '@/lib/utils';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { tasks } from '@/server/db/schema';
import { updateTasksSchema } from '@/types/task';
import { eq } from 'drizzle-orm';
import { title } from 'process';

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(tasks).values({
        title: input.title,
        userId: ctx.session.user.id,
        completed: false,
        description: input.description,
        dueDate: new Date(),
      });
    }),

  getDailyTasks: protectedProcedure
    .input(
      z.object({
        date: z.string().optional(),
        timezone: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const taskDate = input.date ? new Date(input.date) : new Date();
      const timezone = input.timezone ?? 'Asia/Seoul';
      const { startOfDayUtc, endOfDayUtc } = getUtcDayRange(taskDate, timezone);

      const tasks = await ctx.db.query.tasks.findMany({
        where: (tasks, { eq, and, between }) =>
          and(
            eq(tasks.userId, ctx.session.user.id),
            between(tasks.dueDate, startOfDayUtc, endOfDayUtc),
          ),
      });

      return tasks;
    }),
  updateTasks: protectedProcedure
    .input(updateTasksSchema)
    .mutation(async ({ ctx, input }) => {
      const { tasks: tasksData } = input;

      const updates = tasksData.map(async (task) => {
        await ctx.db
          .update(tasks)
          .set({
            title: task.title,
            completed: task.completed,
          })
          .where(eq(tasks.id, Number(task.taskId)));
      });

      await Promise.all(updates);
    }),
  deleteTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // console.log('🚀 ~ .mutation ~ input:', input);
      await ctx.db.delete(tasks).where(eq(tasks.id, Number(input.id)));
    }),
  getTasksByDate: protectedProcedure
    .input(
      z.object({
        date: z.string().optional(),
        timezone: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const taskDate = input.date ? new Date(input.date) : new Date();
      const timezone = input.timezone ?? 'Asia/Seoul';
      const { startOfDayUtc, endOfDayUtc } = getUtcDayRange(taskDate, timezone);

      const tasks = await ctx.db.query.tasks.findMany({
        where: (tasks, { eq, and, between }) =>
          and(
            eq(tasks.userId, ctx.session.user.id),
            between(tasks.dueDate, startOfDayUtc, endOfDayUtc),
          ),
      });

      return tasks;
    }),
});
