import { protectedProcedure, router } from '../trpc';

import { Question } from '@prisma/client';
import { TRPCError } from '@trpc/server';
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
});

export const testRouter = router({
	create: protectedProcedure
		.input(
			z.object({
				testName: z.string(),
				startDate: z.date(),
				endDate: z.date(),
				classroomId: z.string(),
				duration: z.number(),
				questions: z.array(MCQQuestions),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (ctx.session.user.role !== 'TEACHER')
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You do not have the permissions to create a test',
				});

			const newTest = await ctx.prisma.testTemplate.create({
				data: {
					name: input.testName,
					endDate: new Date(input.endDate),
					startDate: new Date(input.startDate),
					classroomId: input.classroomId,
					duration: input.duration,
				},
			});

			const questions: Question[] = [];

			for (const question of input.questions) {
				const newQuestion = await ctx.prisma.question.create({
					data: {
						question: question.question,
						questionNo: question.questionNo,
						choices: {
							createMany: {
								data: question.choices,
							},
						},
						hasImage: question.hasImage,
						testTemplateId: newTest.id,
					},
				});
				questions.push(newQuestion);
			}

			return { ...newTest, questions };
		}),
	getTestById: protectedProcedure
		.input(
			z.object({
				testId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const test = await ctx.prisma.testTemplate.findUniqueOrThrow({
				where: { id: input.testId },
				include: {
					questions: true,
					classroom: true,
				},
			});

			return test;
		}),
});
