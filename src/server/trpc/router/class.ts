import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const classRouter = router({
	numberOfClasses: protectedProcedure.query(async ({ ctx }) => {
		const id = ctx.session.user.id;
		const classes = await ctx.prisma.usersOnClasses.findMany({ where: { userId: id, classRole: 'TEACHER' } });
		return classes.length;
	}),
	create: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				schoolId: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { id, schoolId } = ctx.session.user;
		}),
});
