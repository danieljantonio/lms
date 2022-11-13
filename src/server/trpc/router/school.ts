import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const schoolRouter = router({
	create: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				invite: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const school = await ctx.prisma.school.create({
				data: input,
			});

			return school;
		}),
});
