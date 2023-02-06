import { MCQQuestion } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { getScorePct, shuffleArray } from '../../../lib/helpers/common.helpers';
import { protectedProcedure, router } from '../trpc';
import date from 'date-and-time';

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
					endDate: date.addMinutes(new Date(), test.duration),
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
					questions: {
						orderBy: {
							questionNo: 'asc',
						},
					},
				},
			});

			return test;
		}),
	answer: protectedProcedure
		.input(
			z.object({
				questionId: z.string(),
				chosenAnswerId: z.string(),
				studentTestId: z.string(),
				newPage: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.questionsOnStudentTest.update({
				where: {
					questionId_studentTestId: {
						questionId: input.questionId,
						studentTestId: input.studentTestId,
					},
				},
				data: {
					chosenAnswerId: input.chosenAnswerId,
				},
			});

			const answers = await ctx.prisma.questionsOnStudentTest.findMany({
				where: {
					studentTestId: input.studentTestId,
				},
				include: {
					chosenAnswer: true,
				},
			});

			await ctx.prisma.studentTest.update({
				where: {
					id: input.studentTestId,
				},
				data: {
					score: getScorePct(answers.filter((ans) => ans.chosenAnswer?.isCorrect).length / answers.length),
				},
			});

			return { updated: true, newPage: input.newPage };
		}),
});
