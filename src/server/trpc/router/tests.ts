import { protectedProcedure, router } from '../trpc';

import { z } from 'zod';

const MCQChoices = z.object({
	answer: z.string(),
	isCorrect: z.boolean(),
});

const MCQQuestions = z.object({
	question: z.string(),
	questionNo: z.number(),
	choices: z.array(MCQChoices),
	hasImage: z.boolean().optional(),
	isEssay: z.boolean().optional(),
});

export const testRouter = router({
	create: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				passcode: z.string(),
				startDate: z.date(),
				endDate: z.date(),
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
					questions: true,
					classroom: true,
				},
			});

			return test;
		}),
});
