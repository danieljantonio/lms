import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const questionRouter = router({
	getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		const question = await ctx.prisma.mCQQuestion.findUniqueOrThrow({
			where: { id: input.id },
			include: {
				choices: {
					select: {
						answer: true,
						id: true,
					},
				},
			},
		});

		return question;
	}),
});
