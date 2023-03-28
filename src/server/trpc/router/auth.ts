import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const authRouter = router({
	createUser: publicProcedure
		.input(
			z.object({
				name: z.string().optional(),
				username: z.string(),
				password: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.user.create({ data: input });
		}),
});
