import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const questionRouter = router({
	getById: protectedProcedure
		.input(z.object({ questionId: z.string(), studentTestId: z.string() }))
		.query(async ({ ctx, input }) => {
			const question = await ctx.prisma.questionsOnStudentTest.findUniqueOrThrow({
				where: {
					questionId_studentTestId: {
						...input,
					},
				},
				include: {
					question: {
						include: {
							choices: {
								select: {
									answer: true,
									id: true,
								},
							},
						},
					},
				},
			});

			return question;
		}),
});
