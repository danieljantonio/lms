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
			if (ctx.session.user.role !== 'TEACHER')
				throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have the permissions to create a test' });

			const newTest = await ctx.prisma.test.create({
				data: {
					name: input.testName,
					endDate: new Date(input.endDate),
					startDate: new Date(input.startDate),
					classroomId: input.classroomId,
					duration: input.duration,
				},
			});

			input.questions.forEach(async (question, index) => {
				await ctx.prisma.mCQQuestion.create({
					data: {
						question: question.question,
						questionNo: index + 1,
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
			const test = await ctx.prisma.test.findUniqueOrThrow({
				where: { id: input.testId },
				include: {
					questions: true,
					classroom: true,
				},
			});

			const existingTest = await ctx.prisma.studentTest.findFirst({
				where: {
					...input,
					userId: ctx.session.user.id,
				},
			});

			return { test, existingTest };
		}),
	getDashboardData: protectedProcedure.query(async ({ ctx }) => {
		const studentClassrooms = await ctx.prisma.usersOnClassrooms.findMany({
			where: {
				userId: ctx.session.user.id,
			},
		});

		const doneTests = await ctx.prisma.studentTest.findMany({
			where: {
				submittedDate: {
					lt: new Date(),
				},
				test: {
					classroomId: {
						in: studentClassrooms.map((classroom) => classroom.classroomId),
					},
				},
			},
			include: {
				test: {
					include: {
						classroom: true,
					},
				},
			},
		});

		const tests = await ctx.prisma.test.findMany({
			where: {
				endDate: {
					gt: new Date(),
				},
				classroomId: {
					in: studentClassrooms.map((classroom) => classroom.classroomId),
				},
				id: {
					notIn: doneTests.map((dTest) => dTest.testId as string),
				},
			},
			include: {
				classroom: true,
			},
		});
		return { tests, doneTests };
	}),
});
