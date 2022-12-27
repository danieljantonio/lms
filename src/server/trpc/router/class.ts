import { School, User } from '@prisma/client';
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
				code: z.string(),
				schoolCode: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id, schoolId } = ctx.session.user;

			if (ctx.session.user.role === 'STUDENT')
				throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to perform the function.' });

			// Ensure that all fields exists.
			const user = (await ctx.prisma.user.findUnique({ where: { id } })) as User;

			if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

			let school, users;

			if (user.role === 'ADMIN') {
				if (!input.schoolCode) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Missing school code' });
				school = await ctx.prisma.school.findUnique({ where: { code: input.schoolCode } });
			} else {
				if (!schoolId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User has not joined a school' });
				school = await ctx.prisma.school.findUnique({ where: { id: schoolId } });
				users = {
					create: [
						{
							userId: user.id,
							classroomRole: user.role,
						},
					],
				};
			}

			if (!school) throw new TRPCError({ code: 'NOT_FOUND', message: 'School not found' });

			const classroom = await ctx.prisma.classroom.create({
				data: {
					name: input.name,
					schoolId: school.id,
					code: `${school.code}-${input.code}`,
					users,
				},
			});

			return classroom;
		}),
	join: protectedProcedure
		.input(
			z.object({
				code: z.string(),
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

			const classroom = await ctx.prisma.classroom.findUnique({ where: { code: input.code } });

			if (!classroom) throw new TRPCError({ code: 'NOT_FOUND', message: 'Classroom not found' });

			const joinClassroom = await ctx.prisma.usersOnClassrooms.create({
				data: {
					classroomId: classroom.id,
					userId: user.id,
					classroomRole: user.role,
				},
			});

			return joinClassroom;
		}),
});
