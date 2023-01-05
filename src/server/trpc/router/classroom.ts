import { User, UsersOnClassrooms } from '@prisma/client';
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
				code: z.string().max(6, 'Must be a 6 character code.').min(6, 'Must be a 6 character code.'),
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
					code: `${input.code}`,
					users,
				},
			});

			return classroom;
		}),
	join: protectedProcedure
		.input(
			z.object({
				code: z.string().max(6, 'Must be a 6 character code.').min(6, 'Must be a 6 character code.'),
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

			const joinClassroom = (await ctx.prisma.usersOnClassrooms.create({
				data: {
					classroomId: classroom.id,
					userId: user.id,
					classroomRole: user.role,
				},
			})) as UsersOnClassrooms;

			return joinClassroom;
		}),
	getByCode: protectedProcedure
		.input(
			z.object({
				code: z.string().max(6, 'Must be a 6 character code.').min(6, 'Must be a 6 character code.'),
			}),
		)
		.query(async ({ ctx, input }) => {
			const classroom = await ctx.prisma.classroom.findUnique({
				where: { code: input.code },
				include: { school: true },
			});

			return classroom;
		}),
	getClassroomData: protectedProcedure
		.input(
			z.object({
				code: z.string().max(6, 'Must be a 6 character code.').min(6, 'Must be a 6 character code.'),
			}),
		)
		.query(async ({ ctx, input }) => {
			const classroom = await ctx.prisma.classroom.findUnique({
				where: { code: input.code },
				include: { school: true, users: true },
			});

			if (!classroom) throw new TRPCError({ code: 'NOT_FOUND', message: 'Classroom not found.' });

			const teacher = await ctx.prisma.usersOnClassrooms.findFirst({
				where: { classroomId: classroom.id, classroomRole: 'TEACHER' },
				include: { user: true },
			});

			return { ...classroom, teacher: teacher?.user };
		}),
	getUserClassrooms: protectedProcedure.query(async ({ ctx }) => {
		const classrooms = await ctx.prisma.usersOnClassrooms.findMany({
			where: { userId: ctx.session.user.id },
			include: { classroom: true },
		});
		return classrooms;
	}),
});
