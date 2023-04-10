import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import date from 'date-and-time';
import { shuffleArray } from '@/lib/helpers/common.helpers';
import { type StudentTestResults, type Question } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export const studentTestRouter = router({
	hasTaken: protectedProcedure
		.input(
			z.object({
				testId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const studentTest = await ctx.prisma.studentTest.findFirst({
				where: {
					testTemplateId: input.testId,
				},
			});

			return studentTest ? true : false;
		}),
	create: protectedProcedure
		.input(
			z.object({
				testId: z.string(),
				duration: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const startDate = new Date();
			const endDate = date.addMinutes(startDate, input.duration);

			const testTemplate =
				await ctx.prisma.testTemplate.findUniqueOrThrow({
					where: {
						id: input.testId,
					},
					include: {
						questions: true,
					},
				});

			const questionIds: Question[] = shuffleArray(
				testTemplate.questions,
			);

			const newStudentTest = await ctx.prisma.studentTest.create({
				data: {
					studentId: ctx.session.user.id,
					testTemplateId: input.testId,
					startDate,
					endDate,
				},
			});

			if (!newStudentTest)
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to start test',
				});

			const studentTestResults = questionIds.map(
				(question, index) =>
					({
						questionOrder: index + 1,
						questionId: question.id,
						studentTestId: newStudentTest.id,
					} as StudentTestResults),
			);

			await ctx.prisma.studentTestResults.createMany({
				data: studentTestResults,
			});

			return newStudentTest;
		}),
	get: protectedProcedure
		.input(z.object({ testId: z.string() }))
		.query(async ({ ctx, input }) => {
			const studentTest = await ctx.prisma.studentTest.findFirstOrThrow({
				where: {
					testTemplateId: input.testId,
					studentId: ctx.session.user.id,
				},
				include: {
					testTemplate: true,
				},
			});

			const questionCount = await ctx.prisma.studentTestResults.count({
				where: {
					studentTestId: studentTest.id,
				},
			});

			return { ...studentTest, questionCount };
		}),
	getQuestion: protectedProcedure
		.input(
			z.object({
				questionOrder: z.number(),
				studentTestId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const question =
				await ctx.prisma.studentTestResults.findFirstOrThrow({
					where: input,
					include: {
						question: {
							include: {
								choices: {
									select: {
										id: true,
										answer: true,
									},
								},
							},
						},
					},
				});
			return question;
		}),
	updateQuestion: protectedProcedure
		.input(
			z.object({
				questionId: z.string(),
				studentTestId: z.string(),
				chosenAnswerId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const updatedQuestion = await ctx.prisma.studentTestResults.update({
				where: {
					studentTestId_questionId: {
						questionId: input.questionId,
						studentTestId: input.studentTestId,
					},
				},
				data: {
					chosenAnswerId: input.chosenAnswerId,
				},
			});

			return updatedQuestion;
		}),
});
