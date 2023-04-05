import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import date from 'date-and-time';

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

			const newStudentTest = await ctx.prisma.studentTest.create({
				data: {
					userId: ctx.session.user.id,
					testTemplateId: input.testId,
					startDate,
					endDate,
				},
			});

			return newStudentTest;
		}),
});
