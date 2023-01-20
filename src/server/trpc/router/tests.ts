import { Test, MCQQuestion, Classroom } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

const MCQChoices = z.object({
	answer: z.string(),
	isCorrect: z.boolean(),
});

const MCQQuestions = z.object({
	question: z.string(),
	choices: z.array(MCQChoices),
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
			console.log(input);

			const classroom = (await ctx.prisma.classroom.findUnique({
				where: { id: input.classroomId },
			})) as Classroom;

			if (!classroom)
				throw new TRPCError({ code: 'NOT_FOUND', message: 'You are not allowed to perform the function.' });

			console.log(`${classroom ? 'Classroom exists' : 'Classroom not found'}`);

			const newTest = await ctx.prisma.test.create({
				data: {
					name: input.testName,
					endDate: new Date(input.endDate),
					startDate: new Date(input.startDate),
					classroomId: classroom.id,
					duration: input.duration,
				},
			});

			input.questions.forEach(async (question) => {
				await ctx.prisma.mCQQuestion.create({
					data: {
						question: question.question,
						choices: {
							createMany: {
								data: question.choices,
							},
						},
						testId: newTest.id,
					},
				});
			});

			return newTest;
		}),
	getTests: protectedProcedure.query(async ({ ctx }) => {
		const classrooms = await ctx.prisma.usersOnClassrooms.findMany({
			where: {
				userId: ctx.session.user.id,
			},
		});

		const classroomIds: string[] = [];

		classrooms.forEach((classroom) => {
			classroomIds.push(classroom.classroomId);
		});

		const today = new Date();

		const ongoingTests = await ctx.prisma.test.findMany({
			where: {
				classroomId: { in: classroomIds },
				startDate: {
					lte: today,
				},
				endDate: {
					gte: today,
				},
			},
			include: { classroom: true },
			orderBy: { endDate: 'asc' },
		});

		const upcomingTests = await ctx.prisma.test.findMany({
			where: {
				classroomId: { in: classroomIds },
				startDate: {
					gte: today,
				},
			},
			include: { classroom: true },
			orderBy: { endDate: 'asc' },
		});

		const overdueTests = await ctx.prisma.test.findMany({
			where: {
				classroomId: { in: classroomIds },
				endDate: {
					lte: today,
				},
			},
			include: { classroom: true },
			orderBy: { endDate: 'asc' },
		});

		return { ongoingTests, upcomingTests, overdueTests };
	}),
	getTestById: protectedProcedure
		.input(
			z.object({
				testId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const test = await ctx.prisma.test.findUnique({
				where: { id: input.testId },
				include: {
					questions: true,
				},
			});
			if (!test) throw new TRPCError({ code: 'NOT_FOUND', message: 'Test not found' });
			return test;
		}),
});
