import { User, UsersOnClassrooms } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const classRouter = router({
	classrooms: protectedProcedure.query(async ({ ctx }) => {
		const id = ctx.session.user.id;
		const user = await ctx.prisma.user.findUniqueOrThrow({ where: { id } });

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
			const user = (await ctx.prisma.user.findUniqueOrThrow({ where: { id } })) as User;

			if (!schoolId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User has not joined a school' });
			const school = await ctx.prisma.school.findUniqueOrThrow({ where: { id: schoolId } });

			const classroom = await ctx.prisma.classroom.create({
				data: {
					name: input.name,
					schoolId: school.id,
					code: `${input.code}`,
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
	join: protectedProcedure
		.input(
			z.object({
				code: z.string().max(6, 'Must be a 6 character code.').min(6, 'Must be a 6 character code.'),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id, schoolId } = ctx.session.user;

			// Ensure that all fields exists.
			const user = (await ctx.prisma.user.findUniqueOrThrow({ where: { id } })) as User;

			if (!schoolId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User has not joined a school' });

			await ctx.prisma.school.findUniqueOrThrow({ where: { id: schoolId } });

			const classroom = await ctx.prisma.classroom.findUniqueOrThrow({ where: { code: input.code } });

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
			const classroom = await ctx.prisma.classroom.findUniqueOrThrow({
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
			const classroom = await ctx.prisma.classroom.findUniqueOrThrow({
				where: { code: input.code },
				include: { school: true, users: true },
			});

			const teacher = await ctx.prisma.usersOnClassrooms.findFirstOrThrow({
				where: { classroomId: classroom.id, classroomRole: 'TEACHER' },
				include: { user: true },
			});

			const students = await ctx.prisma.usersOnClassrooms.findMany({
				where: { classroomId: classroom.id, classroomRole: 'STUDENT' },
				include: { user: true },
				orderBy: { classroomRole: 'asc' },
			});

			return { ...classroom, teacher: teacher.user, students: students.map((student) => student.user as User) };
		}),
	getClassrooms: protectedProcedure.query(async ({ ctx }) => {
		const classrooms = await ctx.prisma.usersOnClassrooms.findMany({
			where: { userId: ctx.session.user.id },
			include: { classroom: true },
		});
		return classrooms;
	}),
});
