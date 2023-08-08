import type { User } from '@prisma/client';
import { protectedProcedure, router } from '../trpc';

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const classRouter = router({
	create: protectedProcedure
		.input(
			z.object({
				grade: z.number(),
				name: z.string(),
				code: z.string(),
				schoolCode: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id, schoolId } = ctx.session.user;

			if (ctx.session.user.role === 'STUDENT')
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You are not allowed to perform the function.',
				});

			// Ensure that all fields exists.
			const user = (await ctx.prisma.user.findUniqueOrThrow({
				where: { id },
			})) as User;

			if (!schoolId)
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'User has not joined a school',
				});

			const classroom = await ctx.prisma.classroom.create({
				data: {
					grade: input.grade,
					name: input.name,
					schoolId: schoolId,
					code: `${input.code}`,
					teacherId: user.id,
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
			const user = (await ctx.prisma.user.findUniqueOrThrow({
				where: { id },
			})) as User;

			if (!schoolId)
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'User has not joined a school',
				});

			const classroom = await ctx.prisma.classroom.findUniqueOrThrow({
				where: { code: input.code },
			});

			const joinClassroom = await ctx.prisma.classroomStudents.create({
				data: {
					classroomId: classroom.id,
					userId: user.id,
				},
			});

			return joinClassroom;
		}),
	getByCode: protectedProcedure
		.input(
			z.object({
				code: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const classroom = await ctx.prisma.classroom.findUniqueOrThrow({
				where: { code: input.code },
				include: { school: true },
			});

			return classroom;
		}),
	getClassroom: protectedProcedure
		.input(
			z.object({
				code: z
					.string()
					.max(8, 'Must be a 8 character code.')
					.min(8, 'Must be a 8 character code.'),
			}),
		)
		.query(async ({ ctx, input }) => {
			const classroom = await ctx.prisma.classroom.findUniqueOrThrow({
				where: { code: input.code },
				include: {
					school: true,
					students: true,
					teacher: true,
					testTemplates: true,
				},
			});

			return classroom;
		}),
	getClassrooms: protectedProcedure.query(async ({ ctx }) => {
		const { role, id } = ctx.session.user;

		if (role === 'TEACHER') {
			return await ctx.prisma.classroom.findMany({
				where: { teacherId: id },
			});
		} else {
			const classrooms = await ctx.prisma.classroomStudents.findMany({
				where: { userId: ctx.session.user.id },
				include: { classroom: true },
			});

			return classrooms.map((classroom) => classroom.classroom);
		}
	}),
});
