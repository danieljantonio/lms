import { User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const classRouter = router({
	classrooms: protectedProcedure.query(async ({ ctx }) => {
		const id = ctx.session.user.id;
		const user = (await ctx.prisma.user.findUnique({ where: { id } })) as User;

		const classrooms = await ctx.prisma.classroom.findMany({
			where: {
				users: {
					some: {
						userId: user.id,
					},
				},
			},
		});

		return classrooms;
	}),
	create: protectedProcedure
		.input(
			z.object({
				name: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id, schoolId } = ctx.session.user;

			// Ensure that all fields exists.
			const user = (await ctx.prisma.user.findUnique({ where: { id } })) as User;

			if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

			if (!schoolId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User has not joined a school' });

			const school = await ctx.prisma.school.findUnique({ where: { id: schoolId } });

			if (!school) throw new TRPCError({ code: 'NOT_FOUND', message: 'School not found' });

			const classroom = await ctx.prisma.classroom.create({
				data: {
					...input,
					schoolId: school.id,
					users: {
						create: [
							{
								userId: user.id,
								classroomRole: user.role,
							},
						],
					},
				},
			});

			return classroom;
		}),
});
