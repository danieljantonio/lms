import { protectedProcedure, router } from '../trpc';

import { z } from 'zod';

export const testRouter = router({
	create: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				passcode: z.string(),
				startDate: z.string(),
				endDate: z.string(),
				classroomId: z.string(),
				duration: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			await ctx.prisma.classroom.findFirstOrThrow({
				where: {
					id: input.classroomId,
					teacherId: ctx.session.user.id,
				},
			});

			const newTest = await ctx.prisma.test.create({
				data: {
					...input,
					endDate: new Date(input.endDate),
					startDate: new Date(input.startDate),
				},
			});

			return newTest;
		}),
	createQuestion: protectedProcedure
		.input(
			z.object({
				testId: z.string(),
				question: z.string(),
				choices: z.array(z.string()),
				correctChoice: z.string(),
				hasImage: z.boolean(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			return null;
		}),
	getTestById: protectedProcedure
		.input(
			z.object({
				testId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const test = await ctx.prisma.test.findUniqueOrThrow({
				where: { id: input.testId },
				include: {
					classroom: true,
					questions:
						ctx.session.user.role === 'TEACHER'
							? true
							: {
									select: {
										id: true,
										questionNo: true,
										question: true,
										choices: true,
										hasImage: true,
									},
							  },
				},
			});

			return test;
		}),
});
