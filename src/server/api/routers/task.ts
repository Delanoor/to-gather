import { z } from 'zod';

import { getUtcDayRange } from '@/lib/utils';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { tasks } from '@/server/db/schema';
import { createTasksSchema } from '@/types/task';
import { eq } from 'drizzle-orm';

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
  createTasks: protectedProcedure
    .input(createTasksSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(tasks).values(
        input.tasks.map((task) => ({
          title: task.title,
          userId: ctx.session.user.id,
          completed: task.completed,
          // description: task.description,
          dueDate: new Date(task.dueDate),
        })),
      );
    }),
  deleteTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log('🚀 ~ .mutation ~ input:', input);
      await ctx.db.delete(tasks).where(eq(tasks.id, Number(input.id)));
    }),
});
