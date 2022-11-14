import { User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const schoolRouter = router({
	create: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				invite: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const school = await ctx.prisma.school.create({
				data: input,
			});

			return school;
		}),
	join: protectedProcedure
		.input(
			z.object({
				invite: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id, schoolId } = ctx.session.user;
			if (schoolId)
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: 'The user is already in a school',
				});
			const school = await ctx.prisma.school.findUnique({ where: { invite: input.invite } });
			if (!school)
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: `School with invite code ${input.invite} not found.`,
				});
			const updateUser: User = await ctx.prisma.user.update({
				where: { id },
				data: { school: { connect: { id: school.id } } },
			});
			return updateUser;
		}),
});
