import { Test, MCQQuestion, Classroom } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { shuffleArray } from '../../../lib/helpers/common.helpers';
import { protectedProcedure, router } from '../trpc';

const MCQChoices = z.object({
	answer: z.string(),
	isCorrect: z.boolean(),
});

const MCQQuestions = z.object({
	question: z.string(),
	choices: z.array(MCQChoices),
});

export const studentTestRouter = router({
	create: protectedProcedure
		.input(
			z.object({
				testId: z.string(),
				classroomId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (ctx.session.user.role !== 'STUDENT')
				throw new TRPCError({ code: 'FORBIDDEN', message: 'Only students are allowed to take the test' });

			const test = await ctx.prisma.test.findUniqueOrThrow({
				where: { id: input.testId },
				include: {
					questions: true,
				},
			});

			const newStudentTest = await ctx.prisma.studentTest.create({
				data: {
					userId: ctx.session.user.id,
					testId: test.id,
					startDate: new Date(),
				},
			});

			const questionList = shuffleArray(test.questions) as MCQQuestion[];

			questionList.forEach(async (question, index) => {
				await ctx.prisma.questionsOnStudentTest.create({
					data: {
						questionNo: index + 1,
						questionId: question.id,
						studentTestId: newStudentTest.id,
					},
				});
			});

			return newStudentTest;
		}),
	get: protectedProcedure
		.input(
			z.object({
				testId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const test = await ctx.prisma.studentTest.findFirstOrThrow({
				where: {
					...input,
					userId: ctx.session.user.id,
				},
				include: {
					test: true,
				},
			});

			return test;
		}),
});
