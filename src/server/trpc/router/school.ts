import { School, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const schoolRouter = router({
	create: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				code: z.string().length(6),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			input.code = input.code.toUpperCase();

			const school = await ctx.prisma.school.create({
				data: input,
			});

			return school;
		}),

	join: protectedProcedure
		.input(
			z.object({
				code: z.string().length(6),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id } = ctx.session.user;

			const { schoolId } = (await ctx.prisma.user.findUniqueOrThrow({ where: { id } })) as User;

			if (schoolId)
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: 'The user is already in a school',
				});

			const school = await ctx.prisma.school.findUniqueOrThrow({ where: { code: input.code } });

			const updateUser: User = await ctx.prisma.user.update({
				where: { id },
				data: { schoolId: school.id },
			});

			return updateUser;
		}),

	get: protectedProcedure.query(async ({ ctx }) => {
		const { id } = ctx.session.user;

		const { schoolId } = (await ctx.prisma.user.findUniqueOrThrow({ where: { id } })) as User;

		if (!schoolId)
			return {
				id: '',
				name: 'No School',
				code: '',
			} as School;

		const school = await ctx.prisma.school.findUniqueOrThrow({ where: { id: schoolId } });
		return school;
	}),
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const schools = await ctx.prisma.school.findMany();
		return schools;
	}),
});
