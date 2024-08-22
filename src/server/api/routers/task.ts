import { z } from 'zod';

import { getUtcDayRange } from '@/lib/utils';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { tasks } from '@/server/db/schema';

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

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),

  getTasks: protectedProcedure
    .input(
      z.object({
        date: z.string().optional(),
        timezone: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const taskDate = input.date ? new Date(input.date) : new Date();
      const timezone = input.timezone ?? 'UTC';
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
