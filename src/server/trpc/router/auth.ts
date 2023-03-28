import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const authRouter = router({
	getSession: publicProcedure.query(({ ctx }) => {
		return ctx.session;
	}),
	getSecretMessage: protectedProcedure.query(() => {
		return 'You are logged in and can see this secret message!';
	}),
	createUser: publicProcedure
		.input(
			z.object({
				name: z.string(),
				username: z.string(),
				password: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.user.create({ data: input });
		}),
});
